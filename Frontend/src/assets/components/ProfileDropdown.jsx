import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { ChevronDown, LayoutDashboard, FileText, LogOut, Settings, User, AtSign, KeyRound, ImagePlus, PencilLine } from "lucide-react";

function GeminiIcon({ className }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2L20 8L12 22L4 8L12 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const SAMPLE_PROFILE_DATA = {
  name: "user@dojo.com",
  email: "itsharmankit@gmail.com",
  avatar:
    "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/profile-mjss82WnWBRO86MHHGxvJ2TVZuyrDv.jpeg",
  subscription: "PRO",
  model: "Gemini 2.0 Flash",
};

export default function ProfileDropdown({ data = SAMPLE_PROFILE_DATA, className = "" }) {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const ref = useRef(null);

  const userStr = localStorage.getItem("codedojo_user");
  const user = userStr ? JSON.parse(userStr) : null;
  const profile = user ? { ...SAMPLE_PROFILE_DATA, ...user } : data;
  const [imageUrl, setImageUrl] = useState(profile.avatar || "");

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function handleSignOut() {
    localStorage.removeItem("codedojo_user");
    setIsOpen(false);
    
    if (isAuthenticated) {
      logout({ logoutParams: { returnTo: window.location.origin } });
    } else {
      navigate("/");
      window.location.reload(); // Force refresh to clear app state and show landing
    }
  }

  function handleImageSave() {
    if (!user || !imageUrl.trim()) return;
    const updatedUser = { ...user, avatar: imageUrl.trim() };
    localStorage.setItem("codedojo_user", JSON.stringify(updatedUser));
  }

  const profileItems = [
    { label: "Your Name", value: profile.email, icon: <User className="h-4 w-4" /> },
    { label: "Change Name", icon: <PencilLine className="h-4 w-4" />, onClick: () => { setIsOpen(false); navigate('/profile/edit-name'); } },
    { label: "Password Change", icon: <KeyRound className="h-4 w-4" />, onClick: () => { setIsOpen(false); navigate('/profile/edit-password'); } },
    { label: "Email Change", icon: <AtSign className="h-4 w-4" />, onClick: () => { setIsOpen(false); navigate('/profile/edit-email'); } },
    { label: "Add Your Photos", icon: <ImagePlus className="h-4 w-4" /> },
  ];

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "Model", href: "#", value: profile.model, icon: <GeminiIcon className="h-4 w-4" /> },
    { label: "Settings", href: "#", icon: <Settings className="h-4 w-4" /> },
    { label: "Terms & Policies", href: "#", icon: <FileText className="h-4 w-4" />, external: true },
  ];

  if (!user && !data) {
    return (
      <button
        onClick={() => navigate("/login")}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-black font-bold text-sm hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20"
        title="Login"
      >
        →
      </button>
    );
  }

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((s) => !s)}
        className="flex items-center gap-4 rounded-2xl border border-zinc-300 bg-white p-3 shadow-sm transition-all duration-200 hover:border-zinc-400 hover:bg-zinc-50 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
      >
        <div className="flex-1 text-left hidden md:block">
          <div className="font-medium text-sm text-zinc-900 leading-tight tracking-tight dark:text-zinc-100">{profile.name}</div>
          <div className="text-xs text-zinc-500 leading-tight tracking-tight dark:text-zinc-400">{profile.email}</div>
        </div>
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5">
            <div className="h-full w-full overflow-hidden rounded-full bg-white dark:bg-zinc-900">
              <img
                alt={profile.name}
                className="h-full w-full rounded-full object-cover"
                height={36}
                src={imageUrl || profile.avatar}
                width={36}
              />
            </div>
          </div>
        </div>
      </button>

      <div className={`absolute top-1/2 -right-3 -translate-y-1/2 transition-all duration-200 ${isOpen ? "opacity-100" : "opacity-60"}`}>
        <svg aria-hidden="true" className={`transition-all duration-200 ${isOpen ? "scale-110 text-blue-500 dark:text-blue-400" : "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300"}`} fill="none" height="24" viewBox="0 0 12 24" width="12">
          <path d="M2 4C6 8 6 16 2 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-2xl border border-zinc-300 bg-white p-2 shadow-xl shadow-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => setIsProfileExpanded((v) => !v)}
            className="group mb-1 flex w-full items-center rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-zinc-200/50 hover:bg-zinc-100/80 hover:shadow-sm dark:hover:border-zinc-700/50 dark:hover:bg-zinc-800/60"
          >
            <div className="flex flex-1 items-center gap-2">
              <User className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">Profile</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${isProfileExpanded ? "rotate-180" : ""}`} />
          </button>

          {isProfileExpanded && (
            <div className="mb-2 space-y-1 rounded-xl border border-zinc-200/70 bg-zinc-50/80 p-2 dark:border-zinc-800 dark:bg-zinc-800/40">
              {profileItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    item.onClick && item.onClick();
                    setIsOpen(false);
                  }}
                  className="group flex w-full items-center rounded-lg border border-transparent p-2.5 text-left transition-all duration-200 hover:border-zinc-200 hover:bg-white dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  <div className="flex flex-1 items-center gap-2">
                    <span className="text-zinc-500 dark:text-zinc-400">{item.icon}</span>
                    <span className="whitespace-nowrap font-medium text-sm text-zinc-900 dark:text-zinc-100">{item.label}</span>
                  </div>
                  {item.value && (
                    <span className="ml-auto rounded-md border border-blue-500/10 bg-blue-50 px-2 py-1 font-medium text-xs text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      {item.value}
                    </span>
                  )}
                </button>
              ))}

              <div className="rounded-lg border border-zinc-200/80 bg-white p-2.5 dark:border-zinc-700 dark:bg-zinc-900">
                <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-300">Change Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL"
                  className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-800 outline-none focus:border-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                />
                <button
                  type="button"
                  onClick={handleImageSave}
                  className="mt-2 rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-500"
                >
                  Apply Image
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.label}>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className="group flex cursor-pointer items-center rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-zinc-200/50 hover:bg-zinc-100/80 hover:shadow-sm dark:hover:border-zinc-700/50 dark:hover:bg-zinc-800/60">
                    <div className="flex flex-1 items-center gap-2">
                      {item.icon}
                      <span className="whitespace-nowrap font-medium text-sm text-zinc-900 leading-tight tracking-tight transition-colors group-hover:text-zinc-950 dark:text-zinc-100 dark:group-hover:text-zinc-50">{item.label}</span>
                    </div>
                    <div className="ml-auto flex-shrink-0">
                      {item.value && <span className="rounded-md px-2 py-1 font-medium text-xs tracking-tight border border-purple-500/10 bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">{item.value}</span>}
                    </div>
                  </a>
                ) : item.href ? (
                  <Link to={item.href} className="group flex cursor-pointer items-center rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-zinc-200/50 hover:bg-zinc-100/80 hover:shadow-sm dark:hover:border-zinc-700/50 dark:hover:bg-zinc-800/60" onClick={() => setIsOpen(false)}>
                    <div className="flex flex-1 items-center gap-2">
                      {item.icon}
                      <span className="whitespace-nowrap font-medium text-sm text-zinc-900 leading-tight tracking-tight transition-colors group-hover:text-zinc-950 dark:text-zinc-100 dark:group-hover:text-zinc-50">{item.label}</span>
                    </div>
                    <div className="ml-auto flex-shrink-0">
                      {item.value && <span className={`rounded-md px-2 py-1 font-medium text-xs tracking-tight ${item.label === 'Model' ? 'border border-blue-500/10 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'border border-purple-500/10 bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'}`}>{item.value}</span>}
                    </div>
                  </Link>
                ) : (
                  <button type="button" className="group flex w-full cursor-pointer items-center rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-zinc-200/50 hover:bg-zinc-100/80 hover:shadow-sm dark:hover:border-zinc-700/50 dark:hover:bg-zinc-800/60" onClick={() => setIsOpen(false)}>
                    <div className="flex flex-1 items-center gap-2">
                      {item.icon}
                      <span className="whitespace-nowrap font-medium text-sm text-zinc-900 leading-tight tracking-tight transition-colors group-hover:text-zinc-950 dark:text-zinc-100 dark:group-hover:text-zinc-50">{item.label}</span>
                    </div>
                    <div className="ml-auto flex-shrink-0">
                      {item.value && <span className="rounded-md px-2 py-1 font-medium text-xs tracking-tight border border-blue-500/10 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">{item.value}</span>}
                    </div>
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="my-3 bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800 h-px" />

          <div>
            <button onClick={handleSignOut} className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-transparent bg-red-500/10 p-3 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/20">
              <LogOut className="h-4 w-4 text-red-500 group-hover:text-red-600" />
              <span className="font-medium text-red-500 text-sm group-hover:text-red-600">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
