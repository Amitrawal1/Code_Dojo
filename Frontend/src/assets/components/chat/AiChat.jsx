import React, { useState, useEffect, useRef } from 'react';

const API_BASE = 'http://localhost:5001/api/ai';

export default function AiChat({ gatekeeperQuestion, submissionState, onApproved, onRejected, problemTitle }) {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '🥋 I am the Socratic Gatekeeper. Submit your code and I will test your understanding!' }
    ]);
    const [input, setInput] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    // When a new gatekeeper question arrives from Workspace
    useEffect(() => {
        if (gatekeeperQuestion && submissionState === 'questioning') {
            setAttempts(0);
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: `⚔️ Before I accept your submission, answer this:\n\n"${gatekeeperQuestion}"`, type: 'question' }
            ]);
        }
    }, [gatekeeperQuestion, submissionState]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        const userAnswer = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userAnswer }]);
        setInput('');

        // If in gatekeeper mode, evaluate the answer
        if (submissionState === 'questioning') {
            setLoading(true);
            const currentAttempt = attempts + 1;
            setAttempts(currentAttempt);

            try {
                const res = await fetch(`${API_BASE}/evaluate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        problemTitle,
                        question: gatekeeperQuestion,
                        userAnswer,
                        attemptNumber: currentAttempt
                    })
                });
                const data = await res.json();

                if (data.correct) {
                    setMessages(prev => [
                        ...prev,
                        { role: 'assistant', content: `✅ ${data.feedback || 'Correct! Your understanding is verified.'}`, type: 'success' }
                    ]);
                    if (onApproved) onApproved();
                } else {
                    if (currentAttempt >= 3) {
                        setMessages(prev => [
                            ...prev,
                            { role: 'assistant', content: `❌ ${data.feedback || 'Incorrect.'}\n\n🚫 Maximum attempts reached. Submission rejected. Review your approach and try again.`, type: 'error' }
                        ]);
                        if (onRejected) onRejected();
                    } else {
                        setMessages(prev => [
                            ...prev,
                            { role: 'assistant', content: `❌ ${data.feedback || 'Not quite right.'}\n\n💡 ${data.hint || 'Think deeper about your approach.'}\n\nAttempts: ${currentAttempt}/3`, type: 'warning' }
                        ]);
                    }
                }
            } catch (error) {
                setMessages(prev => [
                    ...prev,
                    { role: 'assistant', content: `⚠️ Could not reach AI server: ${error.message}. Please check your backend.` }
                ]);
            }
            setLoading(false);
        } else {
            // Normal chat mode (not gatekeeper)
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: '💬 Submit your code first, and I will ask you a question to verify your understanding!' }
            ]);
        }
    };

    const isGatekeeper = submissionState === 'questioning';

    return (
        <div className={`h-full w-full flex flex-col bg-gray-900 text-white rounded-lg overflow-hidden border shadow-xl transition-colors duration-300
            ${isGatekeeper ? 'border-yellow-500/50' : submissionState === 'approved' ? 'border-green-500/50' : 'border-gray-700'}
        `}>
            <header className={`p-3 shadow-sm flex items-center justify-between border-b transition-colors duration-300
                ${isGatekeeper ? 'bg-yellow-900/30 border-yellow-500/30' : submissionState === 'approved' ? 'bg-green-900/30 border-green-500/30' : 'bg-gray-800 border-gray-700'}
            `}>
                <div className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${isGatekeeper ? 'bg-yellow-500 animate-pulse' : submissionState === 'approved' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                    {isGatekeeper ? '⚔️ Gatekeeper Active' : submissionState === 'approved' ? '✅ Approved' : 'AI Assistant'}
                </div>
                {isGatekeeper && (
                    <div className="text-xs text-yellow-400 font-bold">Attempts: {attempts}/3</div>
                )}
            </header>
            
            <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-lg text-sm whitespace-pre-wrap
                            ${msg.role === 'user' 
                                ? 'bg-purple-600 text-white' 
                                : msg.type === 'success'
                                    ? 'bg-green-800/50 text-green-200 border border-green-500/40'
                                    : msg.type === 'error'
                                        ? 'bg-red-800/50 text-red-200 border border-red-500/40'
                                        : msg.type === 'warning'
                                            ? 'bg-yellow-800/50 text-yellow-200 border border-yellow-500/40'
                                            : msg.type === 'question'
                                                ? 'bg-yellow-900/30 text-yellow-100 border border-yellow-500/30'
                                                : 'bg-gray-700 text-gray-200 border border-gray-600'
                            }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-700 text-gray-400 p-3 rounded-lg text-sm border border-gray-600 animate-pulse">
                            🤔 Evaluating your answer...
                        </div>
                    </div>
                )}
            </div>

            <div className="p-3 bg-gray-800 border-t border-gray-700">
                <div className={`flex items-center bg-gray-900 border rounded-md overflow-hidden transition-colors
                    ${isGatekeeper ? 'border-yellow-500/50 focus-within:border-yellow-400' : 'border-gray-600 focus-within:border-purple-500'}
                `}>
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isGatekeeper ? "Type your answer..." : "Ask for a hint..."}
                        disabled={loading || submissionState === 'approved' || submissionState === 'rejected'}
                        className="flex-grow bg-transparent p-2 text-sm outline-none px-3 disabled:opacity-50"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={loading || submissionState === 'approved' || submissionState === 'rejected'}
                        className={`p-2 px-4 text-white transition font-medium text-sm border-l disabled:opacity-50
                            ${isGatekeeper ? 'bg-yellow-700 hover:bg-yellow-600 border-yellow-600' : 'bg-gray-700 hover:bg-gray-600 border-gray-600'}
                        `}
                    >
                        {loading ? '...' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    );
}
