import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { LayoutDashboard, FileText, LogOut, Settings, User } from "lucide-react";

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
  name: "Eugene An",
  email: "eugene@kokonutui.com",
  avatar:
    "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/profile-mjss82WnWBRO86MHHGxvJ2TVZuyrDv.jpeg",
  subscription: "PRO",
  model: "Gemini 2.0 Flash",
};

export default function ProfileDropdown({ data = SAMPLE_PROFILE_DATA, className = "" }) {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const userStr = localStorage.getItem("codedojo_user");
  const user = userStr ? JSON.parse(userStr) : null;
  const profile = user ? { ...SAMPLE_PROFILE_DATA, ...user } : data;

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

  const menuItems = [
    { label: "Profile", href: "/home", icon: <User className="h-4 w-4" /> },
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
        className="flex items-center gap-4 rounded-2xl border border-zinc-200/60 bg-white p-3 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50/80 hover:shadow-sm focus:outline-none dark:border-zinc-800/60 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/40"
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
                src={profile.avatar}
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
        <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-2xl border border-zinc-200/60 bg-white/95 p-2 shadow-xl shadow-zinc-900/5 backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/95">
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
                ) : (
                  <Link to={item.href} className="group flex cursor-pointer items-center rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-zinc-200/50 hover:bg-zinc-100/80 hover:shadow-sm dark:hover:border-zinc-700/50 dark:hover:bg-zinc-800/60" onClick={() => setIsOpen(false)}>
                    <div className="flex flex-1 items-center gap-2">
                      {item.icon}
                      <span className="whitespace-nowrap font-medium text-sm text-zinc-900 leading-tight tracking-tight transition-colors group-hover:text-zinc-950 dark:text-zinc-100 dark:group-hover:text-zinc-50">{item.label}</span>
                    </div>
                    <div className="ml-auto flex-shrink-0">
                      {item.value && <span className={`rounded-md px-2 py-1 font-medium text-xs tracking-tight ${item.label === 'Model' ? 'border border-blue-500/10 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'border border-purple-500/10 bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'}`}>{item.value}</span>}
                    </div>
                  </Link>
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
