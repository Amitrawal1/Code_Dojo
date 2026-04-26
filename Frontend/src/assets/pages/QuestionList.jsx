import React from 'react'
import { useNavigate } from 'react-router-dom'
import { problems } from '../../../../Backend/data/dsaProblems.js'

export default function QuestionList() {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 gap-4">
            {problems.map((problem, idx) => (
                <div 
                    key={idx} 
                    onClick={() => navigate(`/problem/${idx}`)}
                    className="flex justify-between items-center bg-gray-700 p-4 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors duration-200 border border-gray-600 hover:border-purple-500"
                >
                    <div>
                        <h3 className="text-lg font-semibold text-white">{problem.title}</h3>
                        <p className="text-gray-400 text-sm mt-1">{problem.track} • {problem.description.substring(0, 50)}...</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        problem.difficulty === 'easy' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                        problem.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                        'bg-red-500/20 text-red-400 border border-red-500/50'
                    }`}>
                        {problem.difficulty}
                    </span>
                </div>
            ))}
        </div>
    )
}