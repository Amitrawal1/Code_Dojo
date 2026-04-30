import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import TrackerCalendar from '../components/dojomap/TrackerCalendar';

const sections = [
  {
    id: 'dsa',
    title: 'DSA',
    subtitle: 'Data Structures & Algorithms',
    description: 'Master arrays, trees, graphs, DP and more through the Socratic Dojo Map.',
    icon: '⚔️',
    color: 'cyan',
    route: '/dojomap',
    available: true,
  },
  {
    id: 'webdev',
    title: 'WebDev',
    subtitle: 'Full-Stack Web Development',
    description: 'Build real projects with React, Node.js, databases, and deployment.',
    icon: '🌐',
    color: 'purple',
    route: null,
    available: false,
  },
  {
    id: 'ai',
    title: 'AI',
    subtitle: 'Artificial Intelligence & ML',
    description: 'Learn machine learning, neural networks, and AI fundamentals.',
    icon: '🤖',
    color: 'green',
    route: null,
    available: false,
  },
  {
    id: 'devops',
    title: 'DevOps',
    subtitle: 'Cloud & DevOps Engineering',
    description: 'Master Docker, Kubernetes, CI/CD pipelines, and cloud infrastructure.',
    icon: '⚙️',
    color: 'blue',
    route: null,
    available: false,
  },
];

const colorMap = {
  cyan:   { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', hover: 'hover:border-cyan-400', text: 'text-cyan-400', glow: 'shadow-cyan-500/20', btnBg: 'bg-cyan-500 hover:bg-cyan-400' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', hover: 'hover:border-purple-400', text: 'text-purple-400', glow: 'shadow-purple-500/20', btnBg: 'bg-purple-500 hover:bg-purple-400' },
  green:  { bg: 'bg-green-500/10', border: 'border-green-500/30', hover: 'hover:border-green-400', text: 'text-green-400', glow: 'shadow-green-500/20', btnBg: 'bg-green-500 hover:bg-green-400' },
  blue:   { bg: 'bg-blue-500/10', border: 'border-blue-500/30', hover: 'hover:border-blue-400', text: 'text-blue-400', glow: 'shadow-blue-500/20', btnBg: 'bg-blue-500 hover:bg-blue-400' },
};

export default function HomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('codedojo_user') || '{}');
  const { profileData } = useProgress();
  const proofOfWork = profileData?.proofOfWork || { activityHeatmap: [] };

  const handleLogout = () => {
    localStorage.removeItem('codedojo_user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }}></div>

      {/* Fixed Right Sidebar for Tracker Calendar */}
      <div className="hidden lg:block fixed right-8 top-28 w-72 bg-[#12161d]/90 backdrop-blur-md border border-gray-800 rounded-2xl overflow-hidden z-40 shadow-2xl">
        <TrackerCalendar />
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-8 pt-24 pb-12 max-w-6xl mx-auto lg:pr-96">
        <div className="mb-12">
          <div className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-2">Welcome back</div>
          <h1 className="text-4xl font-bold text-white">Choose Your Arena, <span className="text-cyan-400">{user.name || 'Coder'}</span></h1>
          <p className="text-gray-500 mt-2">Pick a track and start mastering skills through real practice.</p>
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map(section => {
            const c = colorMap[section.color];
            return (
              <div 
                key={section.id}
                onClick={() => section.available && navigate(section.route)}
                className={`relative ${c.bg} border ${c.border} ${section.available ? c.hover + ' cursor-pointer' : 'opacity-60 cursor-not-allowed'} rounded-2xl p-8 transition-all duration-300 group ${section.available ? 'hover:translate-y-[-4px] hover:shadow-xl ' + c.glow : ''}`}
              >
                {!section.available && (
                  <div className="absolute top-4 right-4 bg-gray-700/80 text-gray-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    Coming Soon
                  </div>
                )}
                <div className={`text-5xl mb-6 ${section.available ? 'group-hover:scale-110 transition-transform' : ''}`}>
                  {section.icon}
                </div>
                <h2 className={`text-2xl font-bold ${c.text} mb-1`}>{section.title}</h2>
                <p className="text-gray-400 text-sm font-medium mb-3">{section.subtitle}</p>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{section.description}</p>
                
                {section.available && (
                  <button className={`${c.btnBg} text-black px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-lg ${c.glow}`}>
                    Enter Arena →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
