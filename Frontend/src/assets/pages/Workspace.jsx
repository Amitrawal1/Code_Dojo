import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodeEditor from '../components/editor/CodeEditor';
import { problems } from '../../../../Backend/data/dsaProblems.js';

export default function Workspace() {
    const { id } = useParams();
    const navigate = useNavigate();
    const problem = problems[id];
    const [language, setLanguage] = useState('python');

    if (!problem) return <div className="p-8 text-white h-screen bg-gray-900 flex items-center justify-center">Problem not found!</div>;

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
            <main className="flex-grow flex p-4 gap-4 h-[calc(100vh-56px)]">
                {/* Left Pane - Question Details */}
                <div className="w-1/2 h-full bg-gray-800 rounded-lg border border-gray-700 overflow-y-auto p-6 custom-scrollbar shadow-lg">
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
                        <p className="text-gray-300 leading-relaxed text-lg mb-8">
                            {problem.description}
                        </p>

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

                {/* Right Pane - Code Editor */}
                <div className="w-full h-full">
                    <CodeEditor 
                        starterCode={problem.starterCode?.[language]} 
                        language={language}
                    />
                </div>
            </main>
        </div>
    );
}
