import React, { useState } from 'react';

export default function AiChat() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your AI coding assistant. Need a hint?' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { role: 'user', content: input }]);
        setInput('');
        
        // Mock AI response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', content: 'I am a mock AI. In the future, I will connect to the backend AI route!' }]);
        }, 1000);
    };

    return (
        <div className="h-full w-full flex flex-col bg-gray-900 text-white rounded-lg overflow-hidden border border-gray-700 shadow-xl">
            <header className="p-3 bg-gray-800 shadow-sm flex items-center border-b border-gray-700">
                <div className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    AI Assistant
                </div>
            </header>
            
            <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-200 border border-gray-600'}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 bg-gray-800 border-t border-gray-700">
                <div className="flex items-center bg-gray-900 border border-gray-600 rounded-md overflow-hidden focus-within:border-purple-500 transition-colors">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask for a hint..."
                        className="flex-grow bg-transparent p-2 text-sm outline-none px-3"
                    />
                    <button 
                        onClick={handleSend}
                        className="p-2 px-4 bg-gray-700 hover:bg-gray-600 text-white transition font-medium text-sm border-l border-gray-600"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
