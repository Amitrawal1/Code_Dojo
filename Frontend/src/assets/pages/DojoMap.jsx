import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { problems } from '../../../../Backend/data/dsaProblems.js';

// ============================================================
//  TOPIC GRID DATA — 3 columns × 3 rows
// ============================================================
const columns = [
  { heading: 'FOUNDATION', accent: '#38bdf8' },
  { heading: 'CORE STRUCTURES', accent: '#a78bfa' },
  { heading: 'ADVANCED', accent: '#f97316' },
];

const topicGrid = [
  // Row 0
  [
    { id: 'arrays',   label: 'ARRAYS',              icon: '▦',  tracks: ['Array', 'Matrix'] },
    { id: 'linkedlist', label: 'LINKED LISTS',      icon: '⊞',  tracks: ['Linked List'] },
    { id: 'graphs',  label: 'GRAPHS',               icon: '◆',  tracks: ['Graph'] },
  ],
  // Row 1
  [
    { id: 'strings', label: 'STRINGS',              icon: 'Tt', tracks: ['String', 'Hashing'] },
    { id: 'stackqueue', label: 'STACKS & QUEUES',   icon: '◇',  tracks: ['Stack', 'Deque'] },
    { id: 'dp',      label: 'DYNAMIC PROGRAMMING',  icon: '⊛',  tracks: ['DP', 'Greedy'] },
  ],
  // Row 2
  [
    { id: 'sorting', label: 'SORTING',              icon: '≡',  tracks: ['Sorting', 'Merge Sort', 'Binary Search', 'binary Search', 'Two Pointer'] },
    { id: 'trees',   label: 'TREES',                icon: '⌘',  tracks: ['Tree', 'Trie', 'Backtracking'] },
    { id: 'heaps',   label: 'HEAPS',                icon: '!',  tracks: ['Heap'] },
  ],
];

// Flatten for quick lookup
const allTopics = topicGrid.flat();

// Difficulty color helpers
const diffColors = {
  easy:   { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/40' },
  medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/40' },
  hard:   { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/40' },
};

// ============================================================
//  CIRCULAR PROGRESS RING COMPONENT (SVG)
// ============================================================
function ProgressRing({ percent, size = 120, stroke = 4, accent = '#38bdf8' }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background ring */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke="#1e293b"
        strokeWidth={stroke}
        fill="none"
      />
      {/* Progress arc */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke={accent}
        strokeWidth={stroke}
        fill="none"
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

  // Solved data from localStorage
  const solvedHistory = JSON.parse(localStorage.getItem('solved_problems') || '[]');

  // Helper: get problems belonging to a topic
  function getTopicProblems(topic) {
    return problems.filter(p => topic.tracks.includes(p.track));
  }

  // Helper: calc progress % for a topic
  function getProgress(topic) {
    const topicProbs = getTopicProblems(topic);
    if (topicProbs.length === 0) return 0;
    const solvedCount = topicProbs.filter(p => {
      const idx = problems.indexOf(p);
      return solvedHistory.some(s => s.problemIdx === idx);
    }).length;
    return Math.round((solvedCount / topicProbs.length) * 100);
  }

  // Filter problems for sidebar
  const selectedTopic = allTopics.find(t => t.id === selectedNode);
  const filteredProblems = selectedTopic
    ? getTopicProblems(selectedTopic)
    : problems;

  // Overall stats
  const completedCount = solvedHistory.length;
  const logicAvg = solvedHistory.length > 0
    ? Math.round(solvedHistory.reduce((a, c) => a + c.logicScore, 0) / solvedHistory.length)
    : 0;

  return (
    <div className="h-screen w-screen flex bg-[#0d1117] text-white overflow-hidden font-mono">

      {/* ===== LEFT: MAP GRID ===== */}
      <div className="flex-1 flex flex-col overflow-y-auto">

        {/* Header */}
        <div className="px-6 pt-4 pb-1">
          <div className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mb-0.5">DSA WORLD</div>
          <h1 className="text-xl font-bold text-white tracking-tight">The Arena Map</h1>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-3 gap-0 px-6 pt-3">
          {columns.map((col, ci) => (
            <div key={ci} className="text-center">
              <h2 className="text-xs font-black tracking-[0.25em] uppercase" style={{ color: col.accent }}>
                {col.heading}
              </h2>
            </div>
          ))}
        </div>

        {/* Topic Grid */}
        <div className="flex-1 px-6 py-2">
          {topicGrid.map((row, ri) => (
            <div key={ri} className="grid grid-cols-3 gap-3 mb-3">
              {row.map((topic, ci) => {
                const progress = getProgress(topic);
                const accent = columns[ci].accent;
                const isSelected = selectedNode === topic.id;
                const totalProblems = getTopicProblems(topic).length;

                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedNode(isSelected ? null : topic.id)}
                    className={`flex flex-col items-center py-3 rounded-2xl border transition-all duration-300 group
                      ${isSelected
                        ? 'bg-white/5 border-white/20 scale-[1.03]'
                        : 'bg-[#161b22] border-gray-800/60 hover:border-gray-600 hover:bg-[#1c2330]'
                      }
                    `}
                  >
                    {/* Percentage */}
                    <div className="text-[10px] font-bold mb-1" style={{ color: accent }}>{progress}%</div>

                    {/* Ring + Icon */}
                    <div className="relative w-[80px] h-[80px] flex items-center justify-center">
                      <ProgressRing percent={progress} size={80} stroke={3} accent={accent} />
                      {/* Inner dark circle with icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[64px] h-[64px] rounded-full bg-[#1a1f2e] border border-gray-700/50 flex items-center justify-center text-xl text-gray-400 group-hover:text-white transition-colors"
                             style={ isSelected ? { color: accent, borderColor: `${accent}44` } : {} }
                        >
                          {topic.icon}
                        </div>
                      </div>
                    </div>

                    {/* Label badge */}
                    <div
                      className={`mt-2 px-2 py-0.5 rounded-full text-[8px] font-bold tracking-[0.12em] uppercase border transition-colors
                        ${isSelected
                          ? 'text-white'
                          : 'text-gray-400 border-gray-700'
                        }
                      `}
                      style={isSelected ? { borderColor: accent, color: accent } : {}}
                    >
                      {topic.label}
                    </div>

                    {/* Problem count */}
                    <div className="text-[10px] text-gray-600 mt-1">{totalProblems} problems</div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Background grid texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* ===== RIGHT: SIDEBAR ===== */}
      <div className="w-80 bg-[#161b22] border-l border-gray-800 flex flex-col shrink-0 overflow-hidden">

        {/* Stats */}
        <div className="p-6 border-b border-gray-800">
          <div className="text-gray-500 text-xs uppercase tracking-[0.2em] mb-4">Your Progress</div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-cyan-400">{completedCount}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Cleared</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{problems.length - completedCount}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Remaining</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{logicAvg}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Logic Avg</div>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-gray-500 text-xs uppercase tracking-[0.2em] mb-4">
            {selectedTopic ? `${selectedTopic.label} Problems` : 'All Problems'}
          </div>
          <div className="flex flex-col gap-3">
            {filteredProblems.map((problem, idx) => {
              const dc = diffColors[problem.difficulty] || diffColors.easy;
              const globalIdx = problems.indexOf(problem);
              const solvedData = solvedHistory.find(s => s.problemIdx === globalIdx);
              const pStatus = solvedData ? 'done' : 'arena';

              return (
                <div
                  key={idx}
                  onClick={() => navigate(`/problem/${globalIdx}`)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:translate-x-1
                    ${pStatus === 'done'
                      ? 'bg-cyan-500/5 border-cyan-500/30 hover:border-cyan-400'
                      : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                    }
                  `}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-sm font-bold text-white">{problem.title}</h3>
                    {pStatus === 'done' && (
                      <div className="w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center text-[10px] font-bold text-black">{solvedData.logicScore}</div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${dc.bg} ${dc.text} ${dc.border}`}>
                      {problem.difficulty}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-gray-700/50 text-gray-300 border-gray-600">
                      {problem.track}
                    </span>
                    {pStatus === 'done' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-cyan-500/20 text-cyan-400 border-cyan-500/40">
                        ✓ DONE
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
