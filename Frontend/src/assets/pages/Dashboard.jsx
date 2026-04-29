import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { profileData, loading } = useProgress();

  if (loading || !profileData) {
    return <div className="min-h-screen bg-[#090b10] flex items-center justify-center text-cyan-400 font-mono">LOADING PROFILE DATA...</div>;
  }

  const { identity, coreMetrics, proofOfWork } = profileData;

  const totalXP = identity.currentXP + identity.xpToNextLevel;
  const xpPercent = (identity.currentXP / totalXP) * 100;

  // Mock quick actions
  const quickActions = {
    resumeJourney: { topic: "Dynamic Programming", actionEndpoint: "/dojomap" },
    multiplayerMode: { actionText: "Challenge a Peer", actionEndpoint: "/multiplayer" }
  };

  // Helper for difficulty colors
  const diffColor = {
    Easy: "text-green-400 bg-green-500/10 border-green-500/20",
    Medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    Hard: "text-red-400 bg-red-500/10 border-red-500/20"
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-white font-mono relative overflow-x-hidden">
      
      {/* Background Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-gray-800/50 bg-[#0d1117]/80 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition flex items-center gap-2 text-sm">
            <span>←</span> Landing Page
          </button>
          <div className="h-5 w-px bg-gray-700"></div>
          <button onClick={() => navigate('/home')} className="text-gray-400 hover:text-white transition flex items-center gap-2 text-sm">
            <span>←</span> Home
          </button>
          <div className="h-5 w-px bg-gray-700"></div>
          <span className="text-white font-bold tracking-[0.2em]">CODE <span className="text-cyan-400">DOJO</span></span>
        </div>
      </nav>

      <main className="relative z-10 px-8 py-8 max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* ==========================================
            SECTION 1: IDENTITY & LEVEL HERO
        ========================================== */}
        <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-8 shadow-2xl flex items-center justify-between relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center gap-8 relative z-10">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 p-0.5">
                <div className="w-full h-full bg-[#12161f] rounded-2xl flex items-center justify-center text-4xl font-black">
                  {identity.fullName.charAt(0)}
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-xs font-bold text-yellow-400">
                Lv.{identity.level}
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="text-cyan-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">{identity.currentTitle}</div>
              <h1 className="text-3xl font-black tracking-tight mb-1">{identity.fullName}</h1>
              <div className="text-gray-400 text-sm">{identity.degree}</div>
            </div>
          </div>

          <div className="flex items-center gap-12 relative z-10">
            {/* XP Bar */}
            <div className="w-64">
              <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                <span>XP Progress</span>
                <span className="text-purple-400">{identity.currentXP} / {totalXP}</span>
              </div>
              <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-cyan-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                  style={{ width: `${xpPercent}%` }}
                ></div>
              </div>
              <div className="text-[10px] text-gray-500 mt-2 text-right">{identity.xpToNextLevel} XP to Level {identity.level + 1}</div>
            </div>

            {/* Rank */}
            <div className="text-center pl-8 border-l border-gray-800">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-bold">Global Rank</div>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
                #{identity.globalRank}
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            SECTION 2: METRICS & SKILLS
        ========================================== */}
        <div className="grid grid-cols-3 gap-6">
          {/* Trust Score */}
          <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Socratic Trust Score</div>
            <div className="mt-4">
              <div className="text-5xl font-black text-cyan-400 mb-2">{coreMetrics.socraticTrustScore}%</div>
              <p className="text-xs text-gray-400 leading-relaxed">AI validation success rate against Hardcore Gatekeeper.</p>
            </div>
          </div>

          {/* Streak */}
          <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 text-[100px] opacity-5">🔥</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Active Streak</div>
            <div className="mt-4 relative z-10">
              <div className="text-5xl font-black text-orange-400 mb-2">{coreMetrics.currentStreakDays} <span className="text-2xl">Days</span></div>
              <p className="text-xs text-gray-400 leading-relaxed">Consistent daily problem solving algorithm training.</p>
            </div>
          </div>

          {/* Skill Radar */}
          <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-6">
             <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-5">Skill Analysis</div>
             <div className="flex flex-col gap-3">
               {[
                 { label: "Algorithmic Thinking", val: coreMetrics.skillRadar.algorithmicThinking, color: "bg-blue-500" },
                 { label: "Code Optimization", val: coreMetrics.skillRadar.codeOptimization, color: "bg-green-500" },
                 { label: "AI Defense", val: coreMetrics.skillRadar.aiDefense, color: "bg-purple-500" },
                 { label: "Consistency", val: coreMetrics.skillRadar.consistency, color: "bg-yellow-500" },
               ].map(skill => (
                 <div key={skill.label}>
                   <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400 mb-1">
                     <span>{skill.label}</span>
                     <span className="text-white">{skill.val}</span>
                   </div>
                   <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                     <div className={`h-full ${skill.color}`} style={{ width: `${skill.val}%` }}></div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* ==========================================
            SECTION 3: PROOF OF WORK
        ========================================== */}
        <div className="grid grid-cols-3 gap-6">
          
          {/* Main Column (Heatmap + Battle Log) */}
          <div className="col-span-2 flex flex-col gap-6">
            
            {/* Heatmap */}
            <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-6">
              <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-8">Activity Heatmap (Last 7 Days)</div>
              <div className="flex gap-3 h-32 items-end">
                {proofOfWork.activityHeatmap.map((day, idx) => {
                  // Determine color intensity based on submissions
                  const intensity = 
                    day.submissions === 0 ? "bg-gray-800" :
                    day.submissions <= 2 ? "bg-cyan-900" :
                    day.submissions <= 4 ? "bg-cyan-700" :
                    day.submissions <= 6 ? "bg-cyan-500" : "bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)]";
                  
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                      {/* Tooltip */}
                      <div className="absolute -top-10 bg-gray-900 text-[10px] px-3 py-1.5 rounded-lg border border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl font-bold">
                        {day.submissions} subs on {day.date}
                      </div>
                      <div 
                        className={`w-full rounded-sm ${intensity} transition-all duration-300 hover:brightness-125`} 
                        style={{ height: `${Math.max(5, day.submissions * 14)}%` }}
                      ></div>
                      <div className="text-[10px] text-gray-600 font-bold uppercase mt-3">
                        {new Date(day.date).toLocaleDateString('en-US', {weekday: 'short'})}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Battle Log */}
            <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-0 overflow-hidden">
               <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                 <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Recent Battle Log</div>
               </div>
               <div className="divide-y divide-gray-800/50">
                 {proofOfWork.recentBattleLog.map((log, idx) => (
                   <div key={idx} className="p-4 px-6 flex items-center justify-between hover:bg-gray-800/20 transition-colors">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center font-bold text-gray-400">
                         {idx + 1}
                       </div>
                       <div>
                         <div className="text-sm font-bold text-white mb-1">{log.problemName}</div>
                         <div className="flex items-center gap-3 text-[10px] font-bold uppercase">
                           <span className={`px-2 py-0.5 rounded border ${diffColor[log.difficulty]}`}>
                             {log.difficulty}
                           </span>
                           <span className="text-gray-500">Hints Used: <span className="text-gray-300">{log.hintsUsed}</span></span>
                         </div>
                       </div>
                     </div>
                     <div className="text-right">
                       <div className="text-sm font-black text-purple-400">+{log.xpGained} XP</div>
                       <div className="text-[10px] text-gray-500 uppercase font-bold mt-1">Stages: {log.stagesCleared}/3</div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

          </div>

          {/* Right Column (Trophies & Actions) */}
          <div className="flex flex-col gap-6">
            
            {/* Trophies */}
            <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-6 flex-1">
              <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-5">Trophies Unlocked</div>
              <div className="flex flex-col gap-4">
                {proofOfWork.trophies.map((trophy, idx) => (
                  <div key={idx} className="bg-gray-900/50 border border-yellow-500/20 rounded-xl p-4 flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-xl shrink-0">
                      {trophy.icon}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-yellow-400 mb-1">{trophy.title}</div>
                      <div className="text-xs text-gray-400 leading-snug">{trophy.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => navigate(quickActions.resumeJourney.actionEndpoint)}
                className="bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase tracking-widest text-xs py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(8,145,178,0.4)]"
              >
                Resume: {quickActions.resumeJourney.topic}
              </button>
              <button 
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold uppercase tracking-widest text-xs py-4 rounded-xl transition-all"
              >
                {quickActions.multiplayerMode.actionText}
              </button>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}