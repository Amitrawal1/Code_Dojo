import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ starterCode, language }) {
    const [code, setCode] = useState(starterCode || '// Type your code here\nconsole.log("Hello, World!");');

    useEffect(() => {
        if (starterCode) setCode(starterCode);
    }, [starterCode]);

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
            <div className="p-3 bg-gray-800 border-t border-gray-700 flex justify-end gap-3">
                <button className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-bold transition text-white border border-gray-600">Run Code</button>
                <button className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-sm font-bold transition text-white shadow-lg shadow-purple-500/20">Submit</button>
            </div>
        </div>
    );
}

