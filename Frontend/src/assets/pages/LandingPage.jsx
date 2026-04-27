import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d1117] text-white overflow-hidden relative">
      
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }}></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-gray-800/50">
        <div className="flex items-center gap-2">
          <span className="bg-cyan-500 text-black text-xs font-bold px-2 py-0.5 rounded">✕</span>
          <span className="text-white font-bold tracking-wider text-lg">CODE <span className="text-cyan-400">DOJO</span></span>
          <span className="text-gray-600 text-xs ml-1">v2.1</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="text-gray-400 hover:text-white transition text-sm font-medium"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-2 rounded-lg text-sm font-bold transition shadow-lg shadow-cyan-500/20"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Socratic Learning Platform</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6 max-w-4xl">
          Master Code Through
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
            Understanding
          </span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          Code Dojo doesn't just check your answers — it challenges your <span className="text-cyan-400 font-semibold">thinking</span>. 
          Our AI Gatekeeper asks you to explain your logic before accepting your submission.
        </p>

        <div className="flex items-center gap-4 mb-16">
          <button 
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black px-8 py-3.5 rounded-xl text-base font-bold transition shadow-xl shadow-cyan-500/25 flex items-center gap-2"
          >
            ⚔️ Try Now — It's Free
          </button>
          <button className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-6 py-3.5 rounded-xl text-base font-medium transition">
            Learn More
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-8">
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 text-left hover:border-cyan-500/40 transition group">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center text-2xl mb-4 group-hover:bg-cyan-500/20 transition">🧠</div>
            <h3 className="text-white font-bold text-lg mb-2">Socratic Gatekeeper</h3>
            <p className="text-gray-500 text-sm leading-relaxed">AI asks you to explain your approach before accepting your code submission. No shortcuts.</p>
          </div>

          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 text-left hover:border-purple-500/40 transition group">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-2xl mb-4 group-hover:bg-purple-500/20 transition">🗺️</div>
            <h3 className="text-white font-bold text-lg mb-2">Dojo Map</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Visual skill tree showing your DSA journey. Unlock topics as you master the fundamentals.</p>
          </div>

          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 text-left hover:border-green-500/40 transition group">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center text-2xl mb-4 group-hover:bg-green-500/20 transition">📊</div>
            <h3 className="text-white font-bold text-lg mb-2">Logic Score</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Track your real understanding, not just solved count. Build genuine problem-solving skills.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 py-6 text-center text-gray-600 text-xs tracking-wider">
        CODE DOJO © 2026 · Built for real learning
      </footer>
    </div>
  );
}
