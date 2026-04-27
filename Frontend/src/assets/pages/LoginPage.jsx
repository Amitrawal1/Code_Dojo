import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock Authentication Logic
    const userData = {
      name: isLogin ? 'User' : name,
      email: email,
      isLoggedIn: true,
      joinedAt: new Date().toISOString()
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#161b22] border border-gray-800 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-2 justify-center mb-8">
          <span className="bg-cyan-500 text-black text-xs font-bold px-2 py-0.5 rounded">✕</span>
          <span className="text-white font-bold tracking-wider text-xl">CODE DOJO</span>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-500 text-center text-sm mb-8">
          {isLogin ? 'Log in to continue your journey' : 'Sign up to start learning'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2 focus:border-cyan-500 outline-none transition"
                placeholder="Your Name"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2 focus:border-cyan-500 outline-none transition"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2 focus:border-cyan-500 outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-lg mt-4 transition shadow-lg shadow-cyan-500/20"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyan-500 hover:underline ml-1 font-medium"
            >
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
      
      <button 
        onClick={() => navigate('/')}
        className="mt-8 text-gray-500 hover:text-white text-sm transition"
      >
        ← Back to Landing Page
      </button>
    </div>
  );
}
