import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show navbar on Landing Page (/) or Login Page (/login) if you want, 
  // but the user said "compulsory for every page".
  // However, usually it's better to hide it on the landing page if the landing page has its own hero CTA.
  // I will show it on all pages except maybe the / login page if it's too distracting.
  // Actually, I'll show it everywhere as requested.

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] grid grid-cols-3 items-center px-8 py-2 bg-[#0d1117]/80 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {location.pathname !== '/' && location.pathname !== '/home' && (
          <button 
            onClick={() => navigate(-1)} 
            className="text-gray-400 hover:text-white transition flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            <span>←</span> Back
          </button>
        )}
      </div>

      {/* Center: Perfectly Centered Logo */}
      <div 
        onClick={() => navigate('/')}
        className="flex items-center justify-center gap-2 cursor-pointer group"
      >
        <span className="bg-cyan-500 text-black text-xs font-bold px-1.5 py-0.5 rounded transition-transform group-hover:scale-110">✕</span>
        <span className="text-white font-black tracking-[0.3em] text-lg uppercase">CODE <span className="text-cyan-400">DOJO</span></span>
      </div>

      {/* Right: Profile Dropdown */}
      <div className="flex justify-end items-center gap-4">
        {/* Only show ProfileDropdown if user is logged in */}
        {localStorage.getItem('codedojo_user') ? (
          <ProfileDropdown />
        ) : (
          <button 
            onClick={() => navigate('/login')}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 hover:text-cyan-300 transition"
          >
            Login →
          </button>
        )}
      </div>
    </nav>
  );
}
