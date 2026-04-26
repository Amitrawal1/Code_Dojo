import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor() {
    const [code, setCode] = useState('// Type your code here\nconsole.log("Hello, World!");');

    return (
        <div className="h-screen w-screen flex flex-col bg-gray-900 text-white">
            <header className="p-4 bg-gray-800 shadow-md">
                <h1 className="text-xl font-bold">Code Dojo Editor</h1>
            </header>
            <main className="flex-grow p-4 h-full">
                <div className="h-full border border-gray-700 rounded-lg overflow-hidden">
                    <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        theme="vs-dark"
                        value={code}
                        onChange={(value) => setCode(value)}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                        }}
                    />
                </div>
            </main>
        </div>
    );
}

