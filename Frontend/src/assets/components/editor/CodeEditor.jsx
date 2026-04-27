import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ starterCode, language, onSubmit, submissionState }) {
    const [code, setCode] = useState(starterCode || '// Type your code here\nconsole.log("Hello, World!");');

    useEffect(() => {
        if (starterCode) setCode(starterCode);
    }, [starterCode]);

    const handleSubmit = () => {
        if (onSubmit) onSubmit(code);
    };

    const isSubmitting = submissionState === 'questioning';
    const isApproved = submissionState === 'approved';

    return (
        <div className="h-full w-full flex flex-col bg-gray-900 text-white rounded-lg overflow-hidden border border-gray-700 shadow-xl">
            <header className="p-3 bg-gray-800 shadow-sm flex justify-between items-center border-b border-gray-700">
                <div className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    Code Editor
                </div>
                <div className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300 uppercase tracking-wider">{language}</div>
            </header>
            <div className="flex-grow">
                <Editor
                    height="100%"
                    defaultLanguage={language}
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value)}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 15,
                        padding: { top: 16 }
                    }}
                />
            </div>
            <div className="p-3 bg-gray-800 border-t border-gray-700 flex justify-between items-center gap-3">
                {isApproved && (
                    <div className="text-green-400 text-sm font-bold flex items-center gap-2 animate-pulse">
                        ✅ Submitted Successfully!
                    </div>
                )}
                {isSubmitting && (
                    <div className="text-yellow-400 text-sm font-bold flex items-center gap-2">
                        ⏳ Answer the AI question to submit...
                    </div>
                )}
                {!isApproved && !isSubmitting && <div></div>}
                <div className="flex gap-3">
                    <button className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-bold transition text-white border border-gray-600">Run Code</button>
                    <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting || isApproved}
                        className={`px-5 py-2 rounded-md text-sm font-bold transition text-white shadow-lg
                            ${isApproved 
                                ? 'bg-green-600 shadow-green-500/20 cursor-not-allowed' 
                                : isSubmitting 
                                    ? 'bg-yellow-600 shadow-yellow-500/20 cursor-wait'
                                    : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20'
                            }`}
                    >
                        {isApproved ? '✓ Submitted' : isSubmitting ? 'Awaiting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
}
