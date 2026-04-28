import React, { useState, useEffect, useRef } from 'react';

export default function AiChat({ mcqData, submissionState, onApproved, onRejected, problemTitle }) {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '🥋 I am the Socratic Gatekeeper. Submit your code and I will test your understanding!', type: 'info' }
    ]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const scrollRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, mcqData]);

    // When new MCQ data arrives from Workspace
    useEffect(() => {
        if (mcqData && submissionState === 'questioning') {
            setAttempts(0);
            setSelectedOption(null);
            setAnswered(false);
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: `⚔️ Before I accept your submission, answer this question:`, type: 'question' }
            ]);
        }
    }, [mcqData, submissionState]);

    const handleOptionSelect = (index) => {
        if (answered || submissionState !== 'questioning') return;

        setSelectedOption(index);
        setAnswered(true);
        const currentAttempt = attempts + 1;
        setAttempts(currentAttempt);

        const isCorrect = index === mcqData.correctAnswerIndex;

        if (isCorrect) {
            setMessages(prev => [
                ...prev,
                { role: 'user', content: `Selected: ${mcqData.options[index]}` },
                { role: 'assistant', content: `✅ Correct! ${mcqData.explanation}`, type: 'success' }
            ]);
            if (onApproved) onApproved();
        } else {
            if (currentAttempt >= 2) {
                setMessages(prev => [
                    ...prev,
                    { role: 'user', content: `Selected: ${mcqData.options[index]}` },
                    { role: 'assistant', content: `❌ Wrong answer.\n\n💡 The correct answer was: "${mcqData.options[mcqData.correctAnswerIndex]}"\n\n📖 ${mcqData.explanation}\n\n🚫 Maximum attempts reached. Review your logic and try again.`, type: 'error' }
                ]);
                if (onRejected) onRejected();
            } else {
                setMessages(prev => [
                    ...prev,
                    { role: 'user', content: `Selected: ${mcqData.options[index]}` },
                    { role: 'assistant', content: `❌ Not quite right. Think again carefully.\n\nAttempts: ${currentAttempt}/2`, type: 'warning' }
                ]);
                // Allow retry
                setTimeout(() => {
                    setSelectedOption(null);
                    setAnswered(false);
                }, 1500);
            }
        }
    };

    const isGatekeeper = submissionState === 'questioning';
    const showMCQ = isGatekeeper && mcqData && !answered;

    return (
        <div className={`h-full w-full flex flex-col bg-gray-900 text-white rounded-lg overflow-hidden border shadow-xl transition-colors duration-300
            ${isGatekeeper ? 'border-yellow-500/50' : submissionState === 'approved' ? 'border-green-500/50' : 'border-gray-700'}
        `}>
            <header className={`p-3 shadow-sm flex items-center justify-between border-b transition-colors duration-300
                ${isGatekeeper ? 'bg-yellow-900/30 border-yellow-500/30' : submissionState === 'approved' ? 'bg-green-900/30 border-green-500/30' : 'bg-gray-800 border-gray-700'}
            `}>
                <div className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${isGatekeeper ? 'bg-yellow-500 animate-pulse' : submissionState === 'approved' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                    {isGatekeeper ? '⚔️ Gatekeeper Active' : submissionState === 'approved' ? '✅ Approved' : 'AI Gatekeeper'}
                </div>
                {isGatekeeper && (
                    <div className="text-xs text-yellow-400 font-bold">Attempts: {attempts}/2</div>
                )}
            </header>
            
            <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[90%] p-3 rounded-lg text-sm whitespace-pre-wrap
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

                {/* MCQ Question & Options */}
                {showMCQ && mcqData && (
                    <div className="bg-gray-800 border border-yellow-500/30 rounded-lg p-4 mt-2">
                        <p className="text-sm text-yellow-100 font-medium mb-4 leading-relaxed">
                            {mcqData.question}
                        </p>
                        <div className="flex flex-col gap-2">
                            {mcqData.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(idx)}
                                    className={`w-full text-left p-3 rounded-lg border text-sm transition-all duration-200 hover:translate-x-1
                                        ${selectedOption === idx
                                            ? 'bg-purple-600/30 border-purple-500 text-white'
                                            : 'bg-gray-900/50 border-gray-700 text-gray-300 hover:border-yellow-500/50 hover:bg-gray-800'
                                        }
                                    `}
                                >
                                    <span className="font-bold text-yellow-400 mr-2">{String.fromCharCode(65 + idx)}.</span>
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Loading state */}
                {submissionState === 'questioning' && !mcqData && (
                    <div className="flex justify-start">
                        <div className="bg-gray-700 text-gray-400 p-3 rounded-lg text-sm border border-gray-600 animate-pulse">
                            🤔 Generating your challenge question...
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom bar */}
            <div className="p-3 bg-gray-800 border-t border-gray-700">
                <div className="text-xs text-gray-500 text-center">
                    {submissionState === 'idle' && '📝 Submit your code to face the Gatekeeper'}
                    {submissionState === 'questioning' && '🎯 Select the correct answer above'}
                    {submissionState === 'approved' && '✅ Logic verified — Submission accepted!'}
                    {submissionState === 'rejected' && '🔄 Resetting... You can try again soon.'}
                </div>
            </div>
        </div>
    );
}
