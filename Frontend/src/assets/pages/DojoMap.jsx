import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { problems } from '../../../../Backend/data/dsaProblems.js';
import { useProgress } from '../../context/ProgressContext';
import DojoSidebar from '../components/dojomap/DojoSidebar';

// ============================================================
//  TOPIC GRID DATA — 3 columns × 3 rows
// ============================================================
const columns = [
  { heading: 'FOUNDATION', accent: '#38bdf8' },
  { heading: 'CORE STRUCTURES', accent: '#a78bfa' },
  { heading: 'ADVANCED', accent: '#f97316' },
];

const topicGrid = [
  [
    { id: 'arrays',     label: 'ARRAYS',             icon: '▦', tracks: ['Array', 'Matrix'] },
    { id: 'linkedlist', label: 'LINKED LISTS',        icon: '⊞', tracks: ['Linked List'] },
    { id: 'graphs',     label: 'GRAPHS',              icon: '◆', tracks: ['Graph'] },
  ],
  [
    { id: 'strings',   label: 'STRINGS',              icon: 'Tt', tracks: ['String', 'Hashing'] },
    { id: 'stackqueue',label: 'STACKS & QUEUES',      icon: '◇', tracks: ['Stack', 'Deque'] },
    { id: 'dp',        label: 'DYNAMIC PROGRAMMING',  icon: '⊛', tracks: ['DP', 'Greedy'] },
  ],
  [
    { id: 'sorting',   label: 'SORTING',              icon: '≡', tracks: ['Sorting', 'Merge Sort', 'Binary Search', 'binary Search', 'Two Pointer'] },
    { id: 'trees',     label: 'TREES',                icon: '⌘', tracks: ['Tree', 'Trie', 'Backtracking'] },
    { id: 'heaps',     label: 'HEAPS',                icon: '!', tracks: ['Heap'] },
  ],
];

const allTopics = topicGrid.flat();

// ============================================================
//  MINI PROGRESS RING (SVG)
// ============================================================
function ProgressRing({ percent, size = 36, stroke = 2.5, accent = '#38bdf8' }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={radius} stroke="#1e293b" strokeWidth={stroke} fill="none" />
      <circle
        cx={size/2} cy={size/2} r={radius}
        stroke={accent} strokeWidth={stroke} fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
      />
    </svg>
  );
}

// ============================================================
//  MAIN COMPONENT
// ============================================================
export default function DojoMap() {
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState(null);
  const { profileData, loading } = useProgress();

  if (loading || !profileData) {
    return <div className="h-screen w-screen bg-[#0d1117] flex items-center justify-center text-cyan-400 font-mono">LOADING MAP DATA...</div>;
  }

  // Solved data from Global State
  const solvedHistory = profileData.proofOfWork.solvedHistory || [];

  function getTopicProblems(topic) {
    return problems.filter(p => topic.tracks.includes(p.track));
  }

  function getProgress(topic) {
    const topicProbs = getTopicProblems(topic);
    if (topicProbs.length === 0) return 0;
    const solvedCount = topicProbs.filter(p => {
      const idx = problems.indexOf(p);
      return solvedHistory.some(s => s.problemIdx === idx);
    }).length;
    return Math.round((solvedCount / topicProbs.length) * 100);
  }

  const selectedTopic = allTopics.find(t => t.id === selectedNode);
  const filteredProblems = selectedTopic ? getTopicProblems(selectedTopic) : problems;

  const completedCount = solvedHistory.length;
  const logicAvg = solvedHistory.length > 0
    ? Math.round(solvedHistory.reduce((a, c) => a + c.logicScore, 0) / solvedHistory.length)
    : 0;

  return (
    <div className="h-screen w-screen flex bg-[#0d1117] text-white overflow-hidden font-mono">

      {/* ===== LEFT: MAP GRID ===== */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Header */}
        <div className="px-5 pt-3 pb-2 flex justify-between items-center border-b border-gray-800/60 shrink-0">
          <div>
            <div className="text-gray-500 text-[9px] uppercase tracking-[0.3em]">DSA WORLD</div>
            <h1 className="text-base font-bold text-white tracking-tight leading-tight">The Arena Map</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-gray-500 hover:text-white transition text-xs">← Landing</button>
            <div className="h-3 w-px bg-gray-700" />
            <button onClick={() => navigate('/home')} className="text-gray-500 hover:text-white transition text-xs">← Home</button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="px-5 py-2 shrink-0">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Global Arena Completion</span>
            <span className="text-[9px] font-bold text-cyan-400">
              {Math.round((completedCount / problems.length) * 100)}% ({completedCount}/{problems.length})
            </span>
          </div>
          <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-1000 ease-out"
              style={{ width: `${(completedCount / problems.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-3 gap-2 px-5 pb-1 shrink-0">
          {columns.map((col, ci) => (
            <div key={ci} className="text-center pb-1" style={{ borderBottom: `1.5px solid ${col.accent}33` }}>
              <span className="text-[8px] font-black tracking-[0.2em] uppercase" style={{ color: col.accent }}>
                {col.heading}
              </span>
            </div>
          ))}
        </div>

        {/* Topic Grid — vertical cards with ring centred, fills remaining height */}
        <div className="flex-1 px-5 py-2 flex flex-col gap-2 overflow-hidden">
          {topicGrid.map((row, ri) => (
            <div key={ri} className="grid grid-cols-3 gap-2 flex-1 min-h-0">
              {row.map((topic, ci) => {
                const progress = getProgress(topic);
                const accent = columns[ci].accent;
                const isSelected = selectedNode === topic.id;
                const totalProblems = getTopicProblems(topic).length;

                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedNode(isSelected ? null : topic.id)}
                    className={`flex flex-col items-center justify-center gap-1 rounded-xl border transition-all duration-200 group w-full h-full
                      ${isSelected
                        ? 'border-white/20 bg-white/5 scale-[1.02]'
                        : 'bg-[#161b22] border-gray-800/60 hover:border-gray-600 hover:bg-[#1c2330]'
                      }`}
                  >
                    {/* % label */}
                    <div className="text-[9px] font-bold" style={{ color: accent }}>{progress}%</div>

                    {/* Ring with icon inside — centred */}
                    <div className="relative w-[52px] h-[52px] flex items-center justify-center">
                      <ProgressRing percent={progress} size={52} stroke={3} accent={accent} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="w-[38px] h-[38px] rounded-full bg-[#1a1f2e] border border-gray-700/50 flex items-center justify-center text-sm transition-colors"
                          style={isSelected ? { color: accent, borderColor: `${accent}44` } : { color: '#6b7280' }}
                        >
                          {topic.icon}
                        </div>
                      </div>
                    </div>

                    {/* Label */}
                    <div
                      className="text-[7.5px] font-bold tracking-[0.1em] uppercase leading-tight text-center px-1"
                      style={{ color: isSelected ? accent : '#6b7280' }}
                    >
                      {topic.label}
                    </div>

                    {/* Problem count */}
                    <div className="text-[7px] text-gray-700">{totalProblems}p</div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ===== RIGHT: SIDEBAR ===== */}
      <DojoSidebar
        completedCount={completedCount}
        logicAvg={logicAvg}
        selectedTopic={selectedTopic}
        filteredProblems={filteredProblems}
        solvedHistory={solvedHistory}
      />
    </div>
  );
}
