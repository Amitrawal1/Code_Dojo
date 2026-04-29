import React from 'react';
import { useNavigate } from 'react-router-dom';
import { problems } from '../../../../../Backend/data/dsaProblems.js';
import TrackerCalendar from './TrackerCalendar';

const diffColors = {
  easy:   { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/40' },
  medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/40' },
  hard:   { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/40' },
};

export default function DojoSidebar({ completedCount, logicAvg, selectedTopic, filteredProblems, solvedHistory }) {
  const navigate = useNavigate();

  return (
    <div className="w-64 md:w-72 bg-[#161b22] border-l border-gray-800 flex flex-col shrink-0 overflow-hidden">
      
      {/* Stats */}
      <div className="p-4 border-b border-gray-800">
        <div className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-3">Your Progress</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-xl font-bold text-cyan-400">{completedCount}</div>
            <div className="text-[9px] text-gray-500 uppercase tracking-wider mt-1">Cleared</div>
          </div>
          <div>
            <div className="text-xl font-bold text-yellow-400">{problems.length - completedCount}</div>
            <div className="text-[9px] text-gray-500 uppercase tracking-wider mt-1">Remaining</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-400">{logicAvg}</div>
            <div className="text-[9px] text-gray-500 uppercase tracking-wider mt-1">Logic Avg</div>
          </div>
        </div>
      </div>

      {/* Tracker Calendar */}
      <TrackerCalendar />

      {/* Problems List */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        <div className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-3">
          {selectedTopic ? `${selectedTopic.label} Problems` : 'All Problems'}
        </div>
        <div className="flex flex-col gap-2">
          {filteredProblems.map((problem, idx) => {
            const dc = diffColors[problem.difficulty] || diffColors.easy;
            const globalIdx = problems.indexOf(problem);
            const solvedData = solvedHistory.find(s => s.problemIdx === globalIdx);
            const pStatus = solvedData ? 'done' : 'arena';

            return (
              <div
                key={idx}
                onClick={() => navigate(`/problem/${globalIdx}`)}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:translate-x-1
                  ${pStatus === 'done'
                    ? 'bg-cyan-500/5 border-cyan-500/30 hover:border-cyan-400'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                  }
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xs font-bold text-white">{problem.title}</h3>
                  {pStatus === 'done' && (
                    <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-[9px] font-bold text-black">{solvedData.logicScore}</div>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${dc.bg} ${dc.text} ${dc.border}`}>
                    {problem.difficulty}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border bg-gray-700/50 text-gray-300 border-gray-600">
                    {problem.track}
                  </span>
                  {pStatus === 'done' && (
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border bg-cyan-500/20 text-cyan-400 border-cyan-500/40">
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
  );
}
