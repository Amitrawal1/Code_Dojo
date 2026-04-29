import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import { problems } from '../../../../Backend/data/dsaProblems.js';
import { useProgress } from '../../context/ProgressContext';

const API_BASE = 'http://localhost:5001/api/ai';

const diffColor = (d) =>
  d === 'easy' ? 'bg-green-500/20 text-green-400 border-green-500/40' :
  d === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' :
  'bg-red-500/20 text-red-400 border-red-500/40';

export default function Workspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseProblem = problems[id];
  const { submitProblemAction } = useProgress();
  const [language, setLanguage] = useState('python');
  const [problem, setProblem] = useState(baseProblem);
  const [isLoadingLeetcode, setIsLoadingLeetcode] = useState(false);
  const [isHtmlDesc, setIsHtmlDesc] = useState(false);
  const [code, setCode] = useState('');

  // Fetch LeetCode API data
  React.useEffect(() => {
      if (!baseProblem) return;
      
      const fetchLeetcodeData = async () => {
          setIsLoadingLeetcode(true);
          try {
              // Convert "Two Sum" -> "two-sum"
              const slug = baseProblem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
              const res = await fetch(`https://alfa-leetcode-api.onrender.com/select?titleSlug=${slug}`);
              if (!res.ok) throw new Error('Network response was not ok');
              const data = await res.json();
              
              if (data && data.question) {
                  setProblem(prev => ({
                      ...prev,
                      description: data.question
                  }));
                  setIsHtmlDesc(true);
              }
          } catch (err) {
              console.warn("Failed to fetch from LeetCode API, using fallback local data.", err);
              setIsHtmlDesc(false);
          } finally {
              setIsLoadingLeetcode(false);
          }
      };

      fetchLeetcodeData();
  }, [baseProblem]);

  // Gatekeeper state
  const [phase, setPhase] = useState('idle'); // idle | questioning | approved | rejected
  const [mcqData, setMcqData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [resultMsg, setResultMsg] = useState(null); // { text, type }
  const [hints] = useState(0);
  const [consoleMsg, setConsoleMsg] = useState('Editor locked. Complete the Socratic session first.');
  const [activeTab, setActiveTab] = useState('solution');

  // Progress bar % based on phase
  const phasePercent = phase === 'idle' ? 0 : phase === 'questioning' ? 50 : phase === 'approved' ? 100 : 0;

  if (!problem) return (
    <div className="h-screen w-screen bg-[#0d1117] text-white flex items-center justify-center font-mono">
      Problem not found.
    </div>
  );

  // Init starter code when language changes
  const starterCode = problem.starterCode?.[language] || `// Write your ${language} solution here\n`;

  // Called when AI approves the answer
  const handleApproved = async () => {
      setPhase('approved');
      
      // Calculate dynamic logic score and XP based on difficulty
      const logicScore = 85 + Math.floor(Math.random() * 15); // Random high score 85-99
      let xpGained = 100;
      if (problem.difficulty === 'Medium') xpGained = 250;
      if (problem.difficulty === 'Hard') xpGained = 500;

      await submitProblemAction(parseInt(id), problem.title, problem.difficulty, logicScore, xpGained);

      // Also save to localStorage as a fallback for some components
      const saved = JSON.parse(localStorage.getItem('solved_problems') || '[]');
      if (!saved.find(s => s.problemIdx === parseInt(id))) {
          saved.push({
              problemIdx: parseInt(id),
              date: new Date().toISOString().split('T')[0],
              attempts: 1,
              logicScore
          });
          localStorage.setItem('solved_problems', JSON.stringify(saved));
      }
  };

  const handleSubmit = async () => {
    setPhase('questioning');
    setMcqData(null);
    setSelectedOption(null);
    setAnswered(false);
    setResultMsg(null);
    setConsoleMsg('Socratic Gatekeeper activated. Answer the question to unlock submission.');

    try {
      const res = await fetch(`${API_BASE}/ask-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: problem.title,
          problemDescription: problem.description,
          userCode: code || starterCode,
          language,
        }),
      });
      const data = await res.json();
      if (data.question && data.options) {
        setMcqData(data);
      } else {
        setMcqData({
          question: 'What is the time complexity of your solution?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
          correctAnswerIndex: 2,
          explanation: 'Most basic array traversals run in O(n) time.',
        });
      }
    } catch {
      setMcqData({
        question: 'What is the time complexity of your solution?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
        correctAnswerIndex: 2,
        explanation: 'Most basic array traversals run in O(n) time.',
      });
    }
  };

  const handleOptionSelect = (idx) => {
    if (answered || phase !== 'questioning') return;
    setSelectedOption(idx);
    setAnswered(true);
    const att = attempts + 1;
    setAttempts(att);
    const correct = idx === mcqData.correctAnswerIndex;

    if (correct) {
      setResultMsg({ text: `✓ Correct! ${mcqData.explanation}`, type: 'success' });
      setPhase('approved');
      setConsoleMsg('✓ Logic verified. Submission accepted!');

      // Save to localStorage
      const now = new Date().toISOString();
      const today = now.split('T')[0];
      const solved = JSON.parse(localStorage.getItem('solved_problems') || '[]');
      if (!solved.find(s => s.problemIdx === parseInt(id))) {
        solved.push({ problemIdx: parseInt(id), date: today, solvedAt: now, attempts: att, logicScore: 95 });
        localStorage.setItem('solved_problems', JSON.stringify(solved));
      }
      const calData = JSON.parse(localStorage.getItem('codedojo_solved') || '[]');
      if (!calData.find(s => s.problemIdx === parseInt(id) && s.solvedAt?.startsWith(today))) {
        calData.push({ problemIdx: parseInt(id), solvedAt: now });
        localStorage.setItem('codedojo_solved', JSON.stringify(calData));
      }

      // Also trigger global progress update
      handleApproved();
    } else if (att >= 2) {
      setResultMsg({ text: `✗ Wrong. Correct answer: "${mcqData.options[mcqData.correctAnswerIndex]}"\n${mcqData.explanation}`, type: 'error' });
      setPhase('rejected');
      setConsoleMsg('✗ Failed Socratic check. Review your logic and try again.');
      setTimeout(() => { setPhase('idle'); setAnswered(false); setSelectedOption(null); setAttempts(0); setMcqData(null); setResultMsg(null); setConsoleMsg('Editor locked. Complete the Socratic session first.'); }, 5000);
    } else {
      setResultMsg({ text: `✗ Not quite. Think again. (${att}/2 attempts)`, type: 'warning' });
      setTimeout(() => { setSelectedOption(null); setAnswered(false); setResultMsg(null); }, 1500);
    }
  };

  const isLocked = phase === 'approved';
  const isQuestioning = phase === 'questioning';

  return (
    <div className="h-screen w-screen bg-[#0d1117] text-white font-mono overflow-hidden pt-20">
      <PanelGroup orientation="horizontal" className="h-full">

        {/* ═══ LEFT PANEL ═══ */}
        <Panel defaultSize={42} minSize={25}>
          <PanelGroup orientation="vertical" className="h-full">

            {/* Question */}
            <Panel defaultSize={60} minSize={15}>
              <div className="h-full overflow-y-auto custom-scrollbar px-5 pt-4 pb-3 border-b border-r border-[#21262d]">
                <div className="flex items-center gap-2 mb-1">
                  <button onClick={() => navigate('/dojomap')} className="text-[#39d353] text-[10px] hover:underline">← Arena Map</button>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-lg font-bold text-white">{problem.title}</h1>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${diffColor(problem.difficulty)}`}>{problem.difficulty}</span>
                </div>
                {isLoadingLeetcode ? (
                  <div className="text-cyan-400 animate-pulse text-xs font-bold mt-2">Connecting to LeetCode API...</div>
                ) : isHtmlDesc ? (
                  <div className="text-gray-400 text-xs mt-2 leading-relaxed leetcode-content" dangerouslySetInnerHTML={{ __html: problem.description }} />
                ) : (
                  <p className="text-gray-400 text-xs mt-2 leading-relaxed line-clamp-3">{problem.description}</p>
                )}
                {problem.testCases?.slice(0, 2).map((tc, i) => (
                  <div key={i} className="text-[10px] text-gray-500 mt-1.5 font-mono">
                    <span className="text-gray-600">In:</span> {tc.input} <span className="text-gray-600">→ Out:</span> <span className="text-gray-300">{tc.output}</span>
                  </div>
                ))}
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {problem.tracks?.map(t => (
                    <span key={t} className="px-2 py-0.5 bg-[#1c2330] border border-[#30363d] rounded text-[9px] text-gray-400 uppercase tracking-wider">{t}</span>
                  ))}
                  <span className="px-2 py-0.5 bg-[#1c2330] border border-[#30363d] rounded text-[9px] text-gray-400 uppercase tracking-wider">Phase 1</span>
                </div>
              </div>
            </Panel>

            <PanelResizeHandle className="h-[3px] bg-[#21262d] hover:bg-[#39d353]/50 transition-colors cursor-row-resize" />

            {/* AI Gatekeeper */}
            <Panel defaultSize={40} minSize={30}>
              <div className="h-full flex flex-col overflow-hidden border-r border-[#21262d]">
                <div className={`px-5 py-2 flex items-center justify-between border-b border-[#21262d] shrink-0 ${isQuestioning ? 'bg-[#1a1f0a]' : phase === 'approved' ? 'bg-[#0a1f0a]' : 'bg-transparent'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isQuestioning ? 'bg-[#39d353] animate-pulse' : phase === 'approved' ? 'bg-[#39d353]' : 'bg-[#21262d]'}`} />
                    <span className="text-[11px] font-bold text-[#39d353] uppercase tracking-[0.2em]">Socratic Gatekeeper</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] text-gray-600">Elenchus Protocol · Phase 1</span>
                    <div className="w-20 h-1 bg-[#21262d] rounded-full overflow-hidden">
                      <div className="h-full bg-[#39d353] transition-all duration-700" style={{ width: `${phasePercent}%` }} />
                    </div>
                    <span className="text-[9px] text-[#39d353]">{phasePercent}%</span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-3 custom-scrollbar">
                  <div className="text-[10px] text-[#39d353] font-bold uppercase tracking-[0.15em] mb-2">AI Gatekeeper</div>
                  {phase === 'idle' && (
                    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 text-sm text-gray-300 leading-relaxed">
                      **Dojo Rule #1:** Think before you type. For **&quot;{problem.title}&quot;** — what algorithm do you have in mind, and why?
                    </div>
                  )}
                  {isQuestioning && !mcqData && (
                    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 text-sm text-gray-400 animate-pulse">🤔 Generating your challenge question...</div>
                  )}
                  {isQuestioning && mcqData && (
                    <div className="space-y-2">
                      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 text-sm text-gray-200 leading-relaxed mb-3">{mcqData.question}</div>
                      {mcqData.options.map((opt, i) => {
                        const isSelected = selectedOption === i;
                        const isCorrect = i === mcqData.correctAnswerIndex;
                        return (
                          <button key={i} onClick={() => handleOptionSelect(i)} disabled={answered}
                            className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all duration-150 ${answered && isCorrect ? 'bg-green-900/40 border-green-500/60 text-green-300' : answered && isSelected && !isCorrect ? 'bg-red-900/40 border-red-500/60 text-red-300' : isSelected ? 'bg-[#1c2330] border-[#39d353] text-white' : 'bg-[#161b22] border-[#30363d] text-gray-300 hover:border-[#39d353]/50 hover:bg-[#1c2330]'}`}>
                            <span className="text-[#39d353] font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {resultMsg && (
                    <div className={`mt-3 p-3 rounded-lg text-xs whitespace-pre-wrap border ${resultMsg.type === 'success' ? 'bg-green-900/30 border-green-500/40 text-green-300' : resultMsg.type === 'error' ? 'bg-red-900/30 border-red-500/40 text-red-300' : 'bg-yellow-900/30 border-yellow-500/40 text-yellow-300'}`}>
                      {resultMsg.text}
                    </div>
                  )}
                  {phase === 'approved' && (
                    <div className="mt-3 p-3 rounded-lg bg-green-900/30 border border-green-500/40 text-green-300 text-xs font-bold text-center">✓ Logic Verified — Submission Accepted!</div>
                  )}
                </div>
                <div className="shrink-0 border-t border-[#21262d] p-3">
                  <div className="flex items-center gap-2">
                    <input className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-gray-300 placeholder-gray-600 outline-none focus:border-[#39d353]/50" placeholder="Explain your logic..." />
                    <button className="w-8 h-8 rounded-lg bg-[#39d353]/10 border border-[#39d353]/30 flex items-center justify-center text-[#39d353] text-xs hover:bg-[#39d353]/20 transition">↗</button>
                  </div>
                  <div className="mt-1.5 text-[9px] text-gray-600">◎ Need a hint? ({hints}/2 used)</div>
                </div>
              </div>
            </Panel>

          </PanelGroup>
        </Panel>

        <PanelResizeHandle className="w-[3px] bg-[#21262d] hover:bg-[#39d353]/50 transition-colors cursor-col-resize" />

        {/* ═══ RIGHT PANEL ═══ */}
        <Panel defaultSize={58} minSize={30}>
          <PanelGroup orientation="vertical" className="h-full">

            {/* Editor */}
            <Panel defaultSize={80} minSize={30}>
              <div className="h-full flex flex-col overflow-hidden">
                <div className="h-10 bg-[#0d1117] border-b border-[#21262d] flex items-center justify-between px-4 shrink-0">
                  <div className="flex items-center gap-0">
                    <button onClick={() => setActiveTab('solution')} className={`px-4 h-10 text-xs font-medium border-b-2 transition-colors ${activeTab === 'solution' ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
                      Solution.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : language === 'java' ? 'java' : 'cpp'}
                    </button>
                    <button onClick={() => setActiveTab('tracer')} className={`px-4 h-10 text-xs font-medium border-b-2 transition-colors ${activeTab === 'tracer' ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
                      Tracer.Canvas
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent text-[10px] text-gray-400 border-none outline-none cursor-pointer">
                      <option value="javascript">Node 20</option>
                      <option value="python">Python 3</option>
                      <option value="java">Java 21</option>
                      <option value="cpp">C++ 17</option>
                    </select>
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold border ${isLocked ? 'border-green-500/40 text-green-400 bg-green-500/10' : 'border-[#30363d] text-gray-500'}`}>
                      {isLocked ? '🔓 UNLOCKED' : '🔒 LOCKED'}
                    </div>
                    <button className="px-3 py-1 rounded text-[11px] font-medium border border-[#30363d] text-gray-400 hover:text-white hover:border-gray-500 transition-all">▶ Run</button>
                    <button onClick={handleSubmit} disabled={isQuestioning || isLocked}
                      className={`px-4 py-1 rounded text-[11px] font-bold transition-all ${isLocked ? 'bg-green-600/20 text-green-400 border border-green-500/30 cursor-not-allowed' : isQuestioning ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30 cursor-wait' : 'bg-[#238636] hover:bg-[#2ea043] text-white border border-transparent'}`}>
                      {isLocked ? '✓ Submitted' : isQuestioning ? 'Checking...' : 'Submit'}
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  {activeTab === 'solution' ? (
                    <Editor height="100%" language={language} theme="vs-dark" value={code || starterCode} onChange={(v) => setCode(v || '')}
                      options={{ minimap: { enabled: false }, fontSize: 13, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", padding: { top: 12 }, scrollBeyondLastLine: false, renderLineHighlight: 'gutter', cursorBlinking: 'smooth', readOnly: isLocked }} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-600 text-sm">Tracer canvas coming soon...</div>
                  )}
                </div>
              </div>
            </Panel>

            <PanelResizeHandle className="h-[3px] bg-[#21262d] hover:bg-[#39d353]/50 transition-colors cursor-row-resize" />

            {/* Console */}
            <Panel defaultSize={20} minSize={10}>
              <div className="h-full flex flex-col overflow-hidden bg-[#0d1117]">
                <div className="flex items-center justify-between px-4 py-1.5 bg-[#161b22] border-b border-[#21262d] shrink-0">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Console</span>
                  <button className="text-gray-600 text-xs hover:text-gray-400">∨</button>
                </div>
                <div className="px-4 py-3 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
                  <span className={`text-[11px] font-mono ${phase === 'approved' ? 'text-green-400' : phase === 'rejected' ? 'text-red-400' : 'text-gray-600'}`}>
                    {consoleMsg}
                  </span>
                  <div className="mt-2 pt-2 border-t border-[#21262d] flex-1">
                    <div className="text-[9px] text-gray-600 uppercase tracking-wider mb-2">Execution Output</div>
                    <div className="text-[11px] text-gray-400 font-mono whitespace-pre-wrap">Ready to run tests...</div>
                  </div>
                </div>
              </div>
            </Panel>

          </PanelGroup>
        </Panel>

      </PanelGroup>
    </div>
  );
}
