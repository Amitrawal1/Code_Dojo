import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, CreditCard, LogOut, Settings, User, FileText, AtSign, KeyRound, ImagePlus, PencilLine } from 'lucide-react';

export default function ProfileDropdown() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const dropdownRef = useRef(null);

  // Read user from localStorage
  const userStr = localStorage.getItem('codedojo_user');
  const user = userStr ? JSON.parse(userStr) : null;

  const data = {
    name: user?.name || 'Guest',
    email: user?.email || 'Not signed in',
    avatar: user?.avatar || null,
    subscription: user?.subscription || 'FREE',
  };
  const [imageUrl, setImageUrl] = useState(data.avatar || '');

  const initial = data.name?.charAt(0).toUpperCase() || '?';

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('codedojo_user');
    setIsOpen(false);
    navigate('/');
  };

  const handleImageSave = () => {
    if (!user || !imageUrl.trim()) return;
    const updatedUser = { ...user, avatar: imageUrl.trim() };
    localStorage.setItem('codedojo_user', JSON.stringify(updatedUser));
  };

  const profileItems = [
    { label: 'Your Name', icon: <User className="w-4 h-4" />, value: data.email, onClick: () => {} },
    { label: 'Change Name', icon: <PencilLine className="w-4 h-4" />, onClick: () => { setIsOpen(false); navigate('/profile/edit-name'); } },
    { label: 'Password Change', icon: <KeyRound className="w-4 h-4" />, onClick: () => { setIsOpen(false); navigate('/profile/edit-password'); } },
    { label: 'Email Change', icon: <AtSign className="w-4 h-4" />, onClick: () => { setIsOpen(false); navigate('/profile/edit-email'); } },
    { label: 'Add Your Photos', icon: <ImagePlus className="w-4 h-4" />, onClick: () => {} },
  ];

  const menuItems = [
    { label: 'Dashboard', icon: <CreditCard className="w-4 h-4" />, onClick: () => navigate('/dashboard'), value: data.subscription },
    { label: 'Settings', icon: <Settings className="w-4 h-4" />, onClick: () => {} },
    { label: 'Terms & Policies', icon: <FileText className="w-4 h-4" />, onClick: () => {} },
  ];

  // If not logged in, render a simple login redirect button
  if (!user) {
    return (
      <button
        onClick={() => navigate('/login')}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-black font-bold text-sm hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20"
        title="Login"
      >
        →
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(v => !v)}
        className="flex items-center gap-3 rounded-2xl border border-slate-500/60 bg-slate-900 px-3 py-2 shadow-md transition-all duration-200 hover:border-slate-400/80 hover:bg-slate-800 focus:outline-none"
        type="button"
      >
        {/* Name + Email */}
        <div className="text-left hidden sm:block">
          <div className="font-semibold text-sm text-white leading-tight tracking-tight">{data.name}</div>
          <div className="text-[11px] text-gray-400 leading-tight">{data.email}</div>
        </div>

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5">
            <div className="h-full w-full overflow-hidden rounded-full bg-[#0d1117] flex items-center justify-center">
              {imageUrl || data.avatar ? (
                <img alt={data.name} className="h-full w-full rounded-full object-cover" src={imageUrl || data.avatar} />
              ) : (
                <span className="text-white font-bold text-sm">{initial}</span>
              )}
            </div>
          </div>
        </div>
      </button>

      {/* Bending line indicator */}
      <div className={`absolute top-1/2 -right-3 -translate-y-1/2 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-60'}`}>
        <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 12 24" width="12"
          className={`transition-all duration-200 ${isOpen ? 'text-violet-400 scale-110' : 'text-gray-600'}`}>
          <path d="M2 4C6 8 6 16 2 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 origin-top-right rounded-2xl border border-slate-500/60 bg-[#0d1117] p-2 shadow-2xl shadow-black/45 z-[200] animate-in fade-in zoom-in-95 duration-150">

          <button
            type="button"
            onClick={() => setIsProfileExpanded((v) => !v)}
            className="group mb-1 w-full flex items-center gap-2.5 rounded-xl border border-transparent px-3 py-2.5 text-left transition-all duration-150 hover:border-white/10 hover:bg-white/5"
          >
            <span className="text-gray-400 group-hover:text-white transition-colors"><User className="w-4 h-4" /></span>
            <span className="flex-1 font-medium text-sm text-gray-300 group-hover:text-white transition-colors leading-tight">Profile</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileExpanded ? 'rotate-180' : ''}`} />
          </button>

          {isProfileExpanded && (
            <div className="mb-2 space-y-0.5 rounded-xl border border-slate-600/70 bg-slate-900/80 p-2">
              {profileItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => { item.onClick(); setIsOpen(false); }}
                  className="group w-full flex items-center gap-2.5 rounded-xl border border-transparent px-3 py-2.5 text-left transition-all duration-150 hover:border-slate-500/40 hover:bg-slate-800/70"
                >
                  <span className="text-slate-400 group-hover:text-white transition-colors">{item.icon}</span>
                  <span className="flex-1 font-medium text-sm text-slate-300 group-hover:text-white transition-colors leading-tight">
                    {item.label}
                  </span>
                  {item.value && (
                    <span className="rounded-md px-2 py-0.5 font-medium text-[10px] tracking-tight border border-sky-400/25 bg-sky-500/10 text-sky-300">
                      {item.value}
                    </span>
                  )}
                </button>
              ))}

              <div className="rounded-xl border border-slate-600/80 bg-slate-900 p-2.5">
                <label className="mb-1 block text-xs font-medium text-slate-300">Change Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL"
                  className="w-full rounded-md border border-slate-600 bg-slate-800 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-sky-400"
                />
                <button
                  type="button"
                  onClick={handleImageSave}
                  className="mt-2 rounded-md bg-sky-500 px-2 py-1 text-xs font-medium text-slate-950 hover:bg-sky-400"
                >
                  Apply Image
                </button>
              </div>
            </div>
          )}

          {/* Menu items */}
          <div className="space-y-0.5">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => { item.onClick(); setIsOpen(false); }}
                className="group w-full flex items-center gap-2.5 rounded-xl border border-transparent px-3 py-2.5 text-left transition-all duration-150 hover:border-white/10 hover:bg-white/5"
              >
                <span className="text-gray-400 group-hover:text-white transition-colors">{item.icon}</span>
                <span className="flex-1 font-medium text-sm text-gray-300 group-hover:text-white transition-colors leading-tight">
                  {item.label}
                </span>
                {item.value && (
                  <span className="rounded-md px-2 py-0.5 font-medium text-[10px] tracking-tight border border-sky-400/25 bg-sky-500/10 text-sky-300">
                    {item.value}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Separator */}
          <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="group w-full flex items-center gap-2.5 rounded-xl border border-transparent bg-red-500/10 px-3 py-2.5 transition-all duration-150 hover:border-red-500/30 hover:bg-red-500/20"
          >
            <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-400" />
            <span className="font-medium text-sm text-red-500 group-hover:text-red-400">Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
