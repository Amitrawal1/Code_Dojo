import React from 'react';
import { useNavigate } from 'react-router-dom';
import { problems } from '../../../../Backend/data/dsaProblems.js';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('codedojo_user') || '{}');
  const solvedHistory = JSON.parse(localStorage.getItem('solved_problems') || '[]');

  return (
    <div className="min-h-screen bg-[#0d1117] text-white relative">
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }}></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-gray-800/50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition flex items-center gap-2 text-sm">
            <span>←</span> Landing Page
          </button>
          <div className="h-5 w-px bg-gray-700"></div>
          <button onClick={() => navigate('/home')} className="text-gray-400 hover:text-white transition flex items-center gap-2 text-sm">
            <span>←</span> Home
          </button>
          <div className="h-5 w-px bg-gray-700"></div>
          <span className="text-white font-bold tracking-wider">CODE <span className="text-cyan-400">DOJO</span></span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-black font-bold text-sm">
            {(user.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-white">{user.name || 'Coder'}</div>
            <div className="text-xs text-gray-500">{user.email || 'user@codedojo.com'}</div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 px-8 py-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="text-gray-500 text-xs uppercase tracking-[0.2em] mb-1">Your Profile</div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5">
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Problems Solved</div>
            <div className="text-3xl font-bold text-cyan-400">{solvedHistory.length}</div>
          </div>
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5">
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Avg Logic Score</div>
            <div className="text-3xl font-bold text-green-400">
              {solvedHistory.length > 0 ? Math.round(solvedHistory.reduce((a, h) => a + h.logicScore, 0) / solvedHistory.length) : 0}
            </div>
          </div>
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5">
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Total Problems</div>
            <div className="text-3xl font-bold text-yellow-400">{problems.length}</div>
          </div>
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5">
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Streak</div>
            <div className="text-3xl font-bold text-purple-400">2 🔥</div>
          </div>
        </div>

        {/* Solved History */}
        <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-cyan-400">#</span> Submission History
          </h2>

          {solvedHistory.length === 0 ? (
            <p className="text-gray-500 text-sm">No submissions yet. Go solve some problems!</p>
          ) : (
            <div className="flex flex-col gap-3">
              {solvedHistory.map((entry, idx) => {
                const prob = problems[entry.problemIdx];
                if (!prob) return null;
                return (
                  <div 
                    key={idx}
                    onClick={() => navigate(`/problem/${entry.problemIdx}`)}
                    className="flex items-center justify-between bg-gray-900/50 border border-gray-800 rounded-lg p-4 cursor-pointer hover:border-cyan-500/40 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold text-sm">
                        ✓
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">{prob.title}</h3>
                        <p className="text-gray-500 text-xs">{prob.track} · {entry.date} · {entry.attempts} attempt{entry.attempts > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        prob.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                        prob.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {prob.difficulty}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs border border-cyan-500/30">
                        {entry.logicScore}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}