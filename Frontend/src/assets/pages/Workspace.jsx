import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import CodeEditor from '../components/editor/CodeEditor';
import AiChat from '../components/chat/AiChat';
import { problems } from '../../../../Backend/data/dsaProblems.js';
import { useProgress } from '../../context/ProgressContext';

const API_BASE = 'http://localhost:5001/api/ai';

export default function Workspace() {
    const { id } = useParams();
    const navigate = useNavigate();
    const baseProblem = problems[id];
    const { submitProblemAction } = useProgress();
    const [language, setLanguage] = useState('python');
    const [problem, setProblem] = useState(baseProblem);
    const [isLoadingLeetcode, setIsLoadingLeetcode] = useState(false);
    const [isHtmlDesc, setIsHtmlDesc] = useState(false);

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

    // Submission gatekeeper state
    const [submissionState, setSubmissionState] = useState('idle'); // idle | questioning | approved | rejected
    const [mcqData, setMcqData] = useState(null);

    if (!problem) return <div className="p-8 text-white h-screen bg-gray-900 flex items-center justify-center">Problem not found!</div>;

    // Called when user clicks Submit in CodeEditor
    const handleSubmit = async (code) => {
        setSubmissionState('questioning');
        setMcqData(null); // Reset previous MCQ

        try {
            const res = await fetch(`${API_BASE}/ask-question`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    problemTitle: problem.title,
                    problemDescription: problem.description,
                    userCode: code,
                    language
                })
            });
            const data = await res.json();
            if (data.question && data.options) {
                setMcqData(data);
            } else {
                // Fallback MCQ if AI fails
                setMcqData({
                    question: 'What is the time complexity of your solution?',
                    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
                    correctAnswerIndex: 2,
                    explanation: 'Most basic array traversals run in O(n) time.'
                });
            }
        } catch (error) {
            console.error('Failed to get MCQ:', error);
            setMcqData({
                question: 'What is the time complexity of your solution?',
                options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
                correctAnswerIndex: 2,
                explanation: 'Most basic array traversals run in O(n) time.'
            });
        }
    };

    // Called when AI approves the answer
    const handleApproved = async () => {
        setSubmissionState('approved');
        
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

    // Called when user exhausts all attempts
    const handleRejected = () => {
        setSubmissionState('rejected');
        // Allow retry after 3 seconds
        setTimeout(() => setSubmissionState('idle'), 5000);
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-gray-900 text-white overflow-hidden">
            {/* Topbar */}
            <header className="h-14 bg-gray-800 border-b border-gray-700 flex items-center px-6 justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition flex items-center gap-2">
                        <span>←</span> Dashboard
                    </button>
                    <div className="h-6 w-px bg-gray-700"></div>
                    <h1 className="text-lg font-bold text-gray-100">{problem.title}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-gray-700 text-sm rounded px-3 py-1.5 border border-gray-600 outline-none text-white cursor-pointer"
                    >
                        <option value="python">Python 3</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                    </select>
                </div>
            </header>

            {/* Split Layout */}
            <main className="flex-grow flex p-2 h-[calc(100vh-56px)]">
                <PanelGroup direction="horizontal" className="h-full w-full">
                    
                    {/* Panel 1: Problem Description */}
                    <Panel defaultSize={30} minSize={20} className="p-2 h-full">
                        <div className="h-full bg-gray-800 rounded-lg border border-gray-700 overflow-y-auto p-6 custom-scrollbar shadow-lg">
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-4">
                                <h2 className="text-3xl font-bold text-white">{problem.title}</h2>
                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                                    problem.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                                    problem.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                                }`}>
                                    {problem.difficulty}
                                </span>
                            </div>

                            <div className="prose prose-invert max-w-none">
                                {isLoadingLeetcode ? (
                                    <div className="text-cyan-400 animate-pulse text-sm font-bold">Connecting to LeetCode API...</div>
                                ) : isHtmlDesc ? (
                                    <div 
                                        className="text-gray-300 leading-relaxed text-[15px] mb-8 leetcode-content"
                                        dangerouslySetInnerHTML={{ __html: problem.description }}
                                    />
                                ) : (
                                    <p className="text-gray-300 leading-relaxed text-lg mb-8">
                                        {problem.description}
                                    </p>
                                )}

                                <div className="mt-8">
                                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                        <span className="text-purple-400">#</span> Test Cases
                                    </h3>
                                    {problem.testCases?.map((tc, index) => (
                                        <div key={index} className="bg-gray-900/50 p-5 rounded-lg mb-4 border border-gray-700 font-mono text-sm shadow-inner">
                                            <div className="mb-3">
                                                <div className="text-gray-500 font-bold mb-1 text-xs uppercase tracking-wider">Input</div> 
                                                <div className="text-gray-300 bg-gray-800 p-2 rounded border border-gray-700">{tc.input}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500 font-bold mb-1 text-xs uppercase tracking-wider">Output</div> 
                                                <div className="text-green-400 bg-gray-800 p-2 rounded border border-gray-700">{tc.output}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Panel>

                    {/* Resizer 1 */}
                    <PanelResizeHandle className="w-2 flex items-center justify-center hover:bg-purple-500/50 transition-colors cursor-col-resize group rounded">
                        <div className="h-8 w-1 bg-gray-600 rounded-full group-hover:bg-white transition-colors"></div>
                    </PanelResizeHandle>

                    {/* Panel 2: Code Editor */}
                    <Panel defaultSize={45} minSize={30} className="p-2 h-full">
                        <CodeEditor 
                            starterCode={problem.starterCode?.[language]} 
                            language={language}
                            onSubmit={handleSubmit}
                            submissionState={submissionState}
                        />
                    </Panel>

                    {/* Resizer 2 */}
                    <PanelResizeHandle className="w-2 flex items-center justify-center hover:bg-purple-500/50 transition-colors cursor-col-resize group rounded">
                        <div className="h-8 w-1 bg-gray-600 rounded-full group-hover:bg-white transition-colors"></div>
                    </PanelResizeHandle>

                    {/* Panel 3: AI Chat */}
                    <Panel defaultSize={25} minSize={15} className="p-2 h-full">
                        <AiChat 
                            mcqData={mcqData}
                            submissionState={submissionState}
                            onApproved={handleApproved}
                            onRejected={handleRejected}
                            problemTitle={problem.title}
                        />
                    </Panel>

                </PanelGroup>
            </main>
        </div>
    );
}
