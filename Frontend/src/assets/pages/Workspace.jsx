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
  const [phase, setPhase] = useState('idle'); // idle | questioning | approved
  const [chatHistory, setChatHistory] = useState([]); 
  const [gatekeeperStage, setGatekeeperStage] = useState(1);
  const [isAILoading, setIsAILoading] = useState(false);
  const [mcqData, setMcqData] = useState(null);
  const [consoleMsg, setConsoleMsg] = useState('Editor locked. Complete the Socratic session first.');
  const [runOutput, setRunOutput] = useState('');
  const [runError, setRunError] = useState('');
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

  const fetchQuestion = async (stage) => {
    setIsAILoading(true);
    setMcqData(null);
    try {
      const res = await fetch(`${API_BASE}/ask-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: problem.title,
          problemDescription: problem.description,
          userCode: code || starterCode,
          language,
          stage
        }),
      });
      const data = await res.json();
      if (data.question && data.options) {
        setMcqData(data);
        setChatHistory(prev => [...prev, { role: 'ai', text: `**Stage ${stage}/3:**\n${data.question}` }]);
      } else {
        throw new Error('Invalid format');
      }
    } catch {
      const fallback = {
        question: `What is the time complexity of your solution? (Fallback Stage ${stage})`,
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
        correctAnswerIndex: 2,
        explanation: 'Basic traversals take O(n) time.',
        hint: 'Think about a simple loop.'
      };
      setMcqData(fallback);
      setChatHistory(prev => [...prev, { role: 'ai', text: `**Stage ${stage}/3:**\n${fallback.question}` }]);
    } finally {
      setIsAILoading(false);
    }
  };

  const handleSubmit = async () => {
    setPhase('questioning');
    setGatekeeperStage(1);
    setChatHistory([{ role: 'ai', text: "I see you're ready to submit. Let's verify your logic. I will ask you 3 questions of increasing difficulty." }]);
    setConsoleMsg('Socratic Gatekeeper activated. Answer the questions to unlock submission.');
    await fetchQuestion(1);
  };

  const handleRun = async () => {
    setConsoleMsg('Compiling and running code...');
    setRunOutput('');
    setRunError('');
    try {
      const res = await fetch('http://localhost:5001/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          code: code || starterCode,
        }),
      });
      const data = await res.json();
      
      if (data.error) {
        setRunError(data.error);
        setConsoleMsg('Execution failed with errors.');
      } else {
        setRunOutput(data.output || '(No output)');
        setConsoleMsg('Execution completed successfully.');
      }
    } catch (err) {
      setRunError(`Error executing code: ${err.message}`);
      setConsoleMsg('Failed to connect to execution engine.');
    }
  };

  const handleOptionSelect = async (idx) => {
    if (phase !== 'questioning' || !mcqData || isAILoading) return;
    
    const selectedText = mcqData.options[idx];
    setChatHistory(prev => [...prev, { role: 'user', text: selectedText }]);

    const correct = idx === mcqData.correctAnswerIndex;

    if (correct) {
      if (gatekeeperStage === 3) {
        setChatHistory(prev => [...prev, { role: 'ai', text: `**Correct!** ${mcqData.explanation}\n\nYou've passed all 3 stages. Code Submitted successfully! 🎉` }]);
        setMcqData(null);
        setPhase('approved');
        setConsoleMsg('✓ Logic verified. Submission accepted!');
        
        // Dynamic XP logic
        const logicScore = 85 + Math.floor(Math.random() * 15);
        let xpGained = 100;
        if (problem.difficulty === 'Medium') xpGained = 250;
        if (problem.difficulty === 'Hard') xpGained = 500;
        await submitProblemAction(parseInt(id), problem.title, problem.difficulty, logicScore, xpGained);

        // Fallback save to localStorage
        const now = new Date().toISOString();
        const today = now.split('T')[0];
        const saved = JSON.parse(localStorage.getItem('solved_problems') || '[]');
        if (!saved.find(s => s.problemIdx === parseInt(id))) {
            saved.push({ problemIdx: parseInt(id), date: today, attempts: 1, logicScore });
            localStorage.setItem('solved_problems', JSON.stringify(saved));
        }
        const calData = JSON.parse(localStorage.getItem('codedojo_solved') || '[]');
        if (!calData.find(s => s.problemIdx === parseInt(id) && s.solvedAt?.startsWith(today))) {
            calData.push({ problemIdx: parseInt(id), solvedAt: now });
            localStorage.setItem('codedojo_solved', JSON.stringify(calData));
        }
      } else {
        setChatHistory(prev => [...prev, { role: 'ai', text: `**Correct!** ${mcqData.explanation}\n\nLet's move to the next stage.` }]);
        const nextStage = gatekeeperStage + 1;
        setGatekeeperStage(nextStage);
        await fetchQuestion(nextStage);
      }
    } else {
      setChatHistory(prev => [...prev, { role: 'ai', text: `**Incorrect.**\n\n**Hint:** ${mcqData.hint || 'Review your code and try again.'}` }]);
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
              <div className="h-full flex flex-col overflow-hidden border-r border-[#21262d] bg-[#0d1117]">
                
                {/* Header (Gemini Style) */}
                <div className="px-5 py-3 flex items-center justify-between border-b border-[#21262d] shrink-0 bg-gradient-to-r from-[#131720] to-[#0d1117]">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <span className="text-white text-[10px] font-black tracking-widest">AI</span>
                    </div>
                    <span className="text-xs font-bold text-gray-200 uppercase tracking-widest font-sans">Socratic Gatekeeper</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-medium text-gray-500">Stage {gatekeeperStage}/3</span>
                  </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar font-sans bg-[#0a0c10]">
                  {phase === 'idle' && (
                    <div className="flex gap-3 mb-4">
                      <div className="w-6 h-6 shrink-0 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mt-1">
                        <span className="text-white text-[9px] font-black tracking-widest">AI</span>
                      </div>
                      <div className="bg-[#1c212b] rounded-2xl rounded-tl-sm px-4 py-3 text-[13px] text-gray-300 shadow-sm border border-white/5">
                        <p className="leading-relaxed">Hi there! Ready to submit? Click <strong>Submit</strong> and I'll verify your logic with 3 questions. Think of me as your personal code reviewer.</p>
                      </div>
                    </div>
                  )}

                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex gap-3 mb-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {msg.role === 'ai' && (
                        <div className="w-6 h-6 shrink-0 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mt-1 shadow-lg shadow-purple-500/20">
                          <span className="text-white text-[9px] font-black tracking-widest">AI</span>
                        </div>
                      )}
                      <div className={`px-4 py-3 text-[13px] shadow-sm max-w-[85%] border leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-blue-600/20 text-blue-100 rounded-2xl rounded-tr-sm border-blue-500/30' 
                          : 'bg-[#1c212b] text-gray-200 rounded-2xl rounded-tl-sm border-white/5 whitespace-pre-wrap'
                      }`}>
                        {msg.text.includes('**') ? (
                           <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        ) : msg.text}
                      </div>
                    </div>
                  ))}

                  {isAILoading && (
                     <div className="flex gap-3 mb-4">
                        <div className="w-6 h-6 shrink-0 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mt-1 shadow-lg shadow-purple-500/20">
                          <span className="text-white text-[9px] font-black tracking-widest">AI</span>
                        </div>
                        <div className="bg-[#1c212b] rounded-2xl rounded-tl-sm px-4 py-3 text-[13px] text-gray-400 border border-white/5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                        </div>
                     </div>
                  )}

                  {/* MCQ Options as chat bubbles */}
                  {isQuestioning && mcqData && !isAILoading && (
                    <div className="flex flex-col gap-2 mt-2 ml-9 mb-4">
                      {mcqData.options.map((opt, i) => (
                        <button key={i} onClick={() => handleOptionSelect(i)}
                          className="w-full text-left px-4 py-2.5 rounded-xl border border-white/10 bg-[#161a22] text-[12px] text-gray-300 hover:bg-[#1f242f] hover:border-blue-500/50 transition-all duration-200 shadow-sm group">
                          <span className="font-bold text-blue-400 mr-2 group-hover:text-blue-300">{String.fromCharCode(65 + i)}.</span> {opt}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Dummy scroll anchor */}
                  <div style={{ float:"left", clear: "both" }} />
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
                    <button onClick={handleRun} className="px-3 py-1 rounded text-[11px] font-medium border border-[#30363d] text-gray-400 hover:text-white hover:border-gray-500 transition-all">▶ Run</button>
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
                  <span className={`text-[11px] font-mono ${phase === 'approved' ? 'text-green-400' : phase === 'rejected' ? 'text-red-400' : 'text-gray-500'}`}>
                    {consoleMsg}
                  </span>
                  
                  {(runOutput || runError) && (
                    <div className="mt-2 pt-2 border-t border-[#21262d] flex-1 flex flex-col gap-2">
                      <div className="text-[9px] text-gray-600 uppercase tracking-wider">Execution Output</div>
                      
                      {runError && (
                        <div className="text-[12px] text-red-400 font-mono whitespace-pre-wrap leading-relaxed p-2 bg-red-950/20 border border-red-900/30 rounded">
                          {runError}
                        </div>
                      )}
                      
                      {runOutput && !runError && (
                        <div className="text-[12px] text-gray-300 font-mono whitespace-pre-wrap leading-relaxed p-2 bg-[#161b22] border border-[#30363d] rounded">
                          {runOutput}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Panel>

          </PanelGroup>
        </Panel>

      </PanelGroup>
    </div>
  );
}
