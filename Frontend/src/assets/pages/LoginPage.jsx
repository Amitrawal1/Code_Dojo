import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please fill all fields.');
      return;
    }
    if (!isLogin && !form.name) {
      setError('Please enter your name.');
      return;
    }

    // Mock auth — save to localStorage
    const user = {
      name: form.name || 'Coder',
      email: form.email,
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem('codedojo_user', JSON.stringify(user));
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"></div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="bg-cyan-500 text-black text-xs font-bold px-2 py-0.5 rounded">✕</span>
            <span className="text-white font-bold tracking-wider text-2xl">CODE <span className="text-cyan-400">DOJO</span></span>
          </div>
          <p className="text-gray-500 text-sm">Master code through understanding</p>
        </div>

        {/* Card */}
        <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {/* Toggle */}
          <div className="flex bg-gray-900 rounded-lg p-1 mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-md text-sm font-bold transition ${isLogin ? 'bg-cyan-500 text-black shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-md text-sm font-bold transition ${!isLogin ? 'bg-cyan-500 text-black shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <div>
                <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">Name</label>
                <input 
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  placeholder="Your name"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-cyan-500 transition placeholder:text-gray-600"
                />
              </div>
            )}

            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">Email</label>
              <input 
                type="email"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                placeholder="you@example.com"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-cyan-500 transition placeholder:text-gray-600"
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">Password</label>
              <input 
                type="password"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                placeholder="••••••••"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-cyan-500 transition placeholder:text-gray-600"
              />
            </div>

            {error && (
              <div className="text-red-400 text-xs font-medium bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black py-3 rounded-lg font-bold text-sm transition shadow-lg shadow-cyan-500/20 mt-2"
            >
              {isLogin ? 'Login to Dojo' : 'Create Account'}
            </button>
          </form>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="w-full text-center mt-6 text-gray-500 hover:text-gray-300 text-sm transition"
        >
          ← Back to Landing
        </button>
      </div>
    </div>
  );
}
