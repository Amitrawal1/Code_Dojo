import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { problems } from '../../../../Backend/data/dsaProblems.js';

// DSA Topic nodes - Tree Hierarchy (Top to Bottom)
// Level 1: Array (Root)
// Level 2: LinkedList, Strings
// Level 3: Stack, Trees, Queue, DP
// Level 4: Graphs, Heap, Trie
const topicNodes = [
  // Level 1 - Root
  { id: 'arrays',     label: 'ARRAYS',      icon: '▦', x: 50, y: 10, status: 'complete' },
  // Level 2
  { id: 'linkedlist', label: 'LINKEDLIST',  icon: '⊿', x: 30, y: 30, status: 'active' },
  { id: 'strings',    label: 'STRINGS',     icon: '≡', x: 70, y: 30, status: 'active' },
  // Level 3
  { id: 'stack',      label: 'STACK',       icon: '☐', x: 15, y: 55, status: 'locked' },
  { id: 'trees',      label: 'TREES',       icon: '△', x: 40, y: 55, status: 'locked' },
  { id: 'queue',      label: 'QUEUE',       icon: '⊞', x: 60, y: 55, status: 'locked' },
  { id: 'dp',         label: 'DP',          icon: '◇', x: 85, y: 55, status: 'locked' },
  // Level 4
  { id: 'graphs',     label: 'GRAPHS',      icon: '◆', x: 25, y: 80, status: 'locked' },
  { id: 'heap',       label: 'HEAP',        icon: '△', x: 50, y: 80, status: 'locked' },
  { id: 'trie',       label: 'TRIE',        icon: '☐', x: 75, y: 80, status: 'locked' },
];

// Connections (parent → child in tree)
const connections = [
  // Level 1 → Level 2
  ['arrays', 'linkedlist'],
  ['arrays', 'strings'],
  // Level 2 → Level 3
  ['linkedlist', 'stack'],
  ['linkedlist', 'trees'],
  ['strings', 'queue'],
  ['strings', 'dp'],
  // Level 3 → Level 4
  ['stack', 'graphs'],
  ['trees', 'graphs'],
  ['trees', 'heap'],
  ['queue', 'heap'],
  ['queue', 'trie'],
  ['dp', 'trie'],
];

// Map track names to topic node IDs
const trackToNodeId = {
  'Array': 'arrays',
  'String': 'strings',
  'Linked List': 'linkedlist',
  'Stack': 'stack',
  'Queue': 'queue',
  'Tree': 'trees',
  'Graph': 'graphs',
  'Heap': 'heap',
  'Trie': 'trie',
  'DP': 'dp',
};

function getNodePos(id) {
  const node = topicNodes.find(n => n.id === id);
  return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
}

// Difficulty color helpers
const diffColors = {
  easy:   { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/40' },
  medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/40' },
  hard:   { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/40' },
};

export default function DojoMap() {
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState(null);

  // Filter problems by selected node
  const filteredProblems = selectedNode
    ? problems.filter(p => trackToNodeId[p.track] === selectedNode)
    : problems;

  // Stats
  const completedCount = 2; // mock
  const activeCount = 1;    // mock
  const logicAvg = 91;      // mock

  return (
    <div className="h-screen w-screen flex bg-[#0d1117] text-white overflow-hidden font-mono">

      {/* ===== LEFT: MAP AREA ===== */}
      <div className="flex-1 flex flex-col">

        {/* Map Content */}
        <div className="flex-1 relative p-8 overflow-hidden">
          {/* Title */}
          <div className="mb-6 relative z-10">
            <div className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-1">DSA WORLD</div>
            <h1 className="text-3xl font-bold text-white tracking-tight">The Arena Map</h1>
            <div className="flex gap-4 mt-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Complete</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400/50 border border-cyan-400"></span> Active</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-600"></span> Locked</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Boss</span>
            </div>
          </div>

          {/* SVG Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {connections.map(([fromId, toId], idx) => {
              const from = getNodePos(fromId);
              const to = getNodePos(toId);
              const fromNode = topicNodes.find(n => n.id === fromId);
              const toNode = topicNodes.find(n => n.id === toId);
              const isActive = fromNode?.status !== 'locked' && toNode?.status !== 'locked';
              return (
                <line
                  key={idx}
                  x1={`${from.x + 2}%`} y1={`${from.y}%`}
                  x2={`${to.x + 2}%`}   y2={`${to.y}%`}
                  stroke={isActive ? '#22d3ee' : '#2d3748'}
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray={isActive ? '' : '6 4'}
                  opacity={isActive ? 0.7 : 0.4}
                  filter={isActive ? 'url(#glow)' : ''}
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {topicNodes.map(node => {
            const isComplete = node.status === 'complete';
            const isActive = node.status === 'active';
            const isSelected = selectedNode === node.id;

            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(isSelected ? null : node.id)}
                className={`absolute z-10 flex flex-col items-center gap-2 transition-all duration-300 group
                  ${isSelected ? 'scale-125' : 'hover:scale-110'}
                `}
                style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                {/* Node circle */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl border-2 transition-all duration-300
                  ${isComplete
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                    : isActive
                      ? 'bg-cyan-500/10 border-cyan-400/60 text-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,0.2)] animate-pulse'
                      : 'bg-gray-800/80 border-gray-600 text-gray-500'
                  }
                  ${isSelected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0d1117]' : ''}
                `}>
                  {node.icon}
                </div>
                {/* Label */}
                <span className={`text-[10px] font-bold tracking-[0.15em] uppercase
                  ${isComplete ? 'text-cyan-400' : isActive ? 'text-cyan-400/70' : 'text-gray-600'}
                `}>
                  {node.label}
                </span>
              </button>
            );
          })}

          {/* Background grid dots */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>
      </div>

      {/* ===== RIGHT: SIDEBAR ===== */}
      <div className="w-80 bg-[#161b22] border-l border-gray-800 flex flex-col shrink-0 overflow-hidden">

        {/* Stats */}
        <div className="p-6 border-b border-gray-800">
          <div className="text-gray-500 text-xs uppercase tracking-[0.2em] mb-4">Current Challenges</div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-cyan-400">{completedCount}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Cleared</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{activeCount}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Active</div>
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
            {selectedNode ? `${selectedNode.toUpperCase()} Problems` : 'Problems'}
          </div>
          <div className="flex flex-col gap-3">
            {filteredProblems.map((problem, idx) => {
              const dc = diffColors[problem.difficulty] || diffColors.easy;
              // Mock statuses
              const statuses = ['done', 'arena', 'locked', 'locked'];
              const pStatus = statuses[idx % statuses.length];

              return (
                <div
                  key={idx}
                  onClick={() => {
                    const globalIdx = problems.indexOf(problem);
                    navigate(`/problem/${globalIdx}`);
                  }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:translate-x-1
                    ${pStatus === 'done'
                      ? 'bg-cyan-500/5 border-cyan-500/30 hover:border-cyan-400'
                      : pStatus === 'arena'
                        ? 'bg-yellow-500/5 border-yellow-500/30 hover:border-yellow-400'
                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                    }
                  `}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-sm font-bold text-white">{problem.title}</h3>
                    {pStatus === 'done' && (
                      <div className="w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center text-[10px] font-bold text-black">95</div>
                    )}
                    {pStatus === 'arena' && (
                      <div className="w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center text-[10px] font-bold text-black">87</div>
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
                    {pStatus === 'arena' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-yellow-500/20 text-yellow-400 border-yellow-500/40">
                        IN ARENA
                      </span>
                    )}
                    {pStatus === 'locked' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-gray-700/50 text-gray-500 border-gray-700">
                        🔒 LOCKED
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
