import React, { useState, useEffect, useRef } from 'react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Activity level → color
const getHeatmapColor = (lv) => {
  if (lv === 4) return '#f97316';
  if (lv === 3) return '#ea580c';
  if (lv === 2) return '#c2410c';
  if (lv === 1) return '#9a3412';
  return '#2e2e2e'; // 0 = no activity
};

/**
 * Builds an activityMap { 'YYYY-MM-DD': level (0-4) }
 * from the solvedHistory array stored in localStorage.
 * Each solve on a given day adds to the tally, then we map
 * tally → level: 0→0, 1→1, 2→2, 3-4→3, 5+→4
 */
function buildActivityMap() {
  const raw = localStorage.getItem('codedojo_solved') || '[]';
  let history = [];
  try { history = JSON.parse(raw); } catch(e) { history = []; }

  const tally = {}; // { 'YYYY-MM-DD': count }
  history.forEach(item => {
    if (!item.solvedAt) return;
    const key = new Date(item.solvedAt).toISOString().slice(0, 10);
    tally[key] = (tally[key] || 0) + 1;
  });

  const aMap = {};
  Object.entries(tally).forEach(([key, cnt]) => {
    if (cnt === 0) aMap[key] = 0;
    else if (cnt === 1) aMap[key] = 1;
    else if (cnt === 2) aMap[key] = 2;
    else if (cnt <= 4) aMap[key] = 3;
    else aMap[key] = 4;
  });
  return aMap;
}

/**
 * Calculate current streak (consecutive days with activity, including today).
 */
function calcStreak(aMap) {
  const today = new Date();
  today.setHours(0,0,0,0);
  let streak = 0;
  for (let i = 0; ; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const k = d.toISOString().slice(0, 10);
    if (aMap[k] > 0) streak++;
    else break;
  }
  return streak;
}

export default function TrackerCalendar() {
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());
  const [streak, setStreak] = useState(0);
  const [activityMap, setActivityMap] = useState({});
  const [ringOffset, setRingOffset] = useState(283); // start full (empty ring)
  const [tip, setTip] = useState({ show: false, text: '', sub: '', x: 0, y: 0 });

  // Load data on mount
  useEffect(() => {
    const aMap = buildActivityMap();
    setActivityMap(aMap);
    const s = calcStreak(aMap);
    setStreak(s);
    // Animate ring after a short delay
    const CIRCUMFERENCE = 283;
    const offset = CIRCUMFERENCE * (1 - Math.min(s / 30, 1));
    setTimeout(() => setRingOffset(offset), 150);
  }, []);

  // Today (stable reference for rendering)
  const todayRef = useRef(new Date());
  todayRef.current.setHours(0,0,0,0);
  const today = todayRef.current;

  const handlePrev = () => {
    setViewMonth(m => {
      if (m === 0) { setViewYear(y => y - 1); return 11; }
      return m - 1;
    });
  };

  const handleNext = () => {
    setViewMonth(m => {
      if (m === 11) { setViewYear(y => y + 1); return 0; }
      return m + 1;
    });
  };

  // Build grid cells
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells = [];
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`e-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(viewYear, viewMonth, day);
    const key = date.toISOString().slice(0, 10);
    const lv = activityMap[key] ?? 0;
    const isFuture = date > today;
    const isToday = date.getTime() === today.getTime();
    const cnt = [0, 1, 3, 7, 12][lv];
    const ds = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    cells.push(
      <div key={day} className="aspect-square flex items-center justify-center">
        <div
          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center
            text-[9px] font-bold text-white select-none
            transition-all duration-100
            ${isFuture
              ? 'opacity-20 pointer-events-none'
              : 'cursor-pointer hover:scale-150 hover:z-20 relative z-10'
            }
          ${isToday ? 'ring-[1.5px] ring-[#2d8de0]' : ''}
          ${!isFuture && !isToday ? 'hover:ring-[1.5px] hover:ring-[#f97316]' : ''}
        `}
        style={{ backgroundColor: isFuture ? '#1a1a1a' : getHeatmapColor(lv) }}
        onMouseEnter={(e) => !isFuture && setTip({
          show: true,
          text: cnt > 0 ? `${cnt} problem${cnt > 1 ? 's' : ''} solved` : 'No activity',
          sub: ds,
          x: e.clientX,
          y: e.clientY,
        })}
        onMouseMove={(e) => setTip(prev => ({ ...prev, x: e.clientX, y: e.clientY }))}
        onMouseLeave={() => setTip(prev => ({ ...prev, show: false }))}
        >
          {/* Empty circle */}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#12161d] border-b border-gray-800 p-4 w-full font-mono select-none">

      {/* Tooltip (portal-like fixed positioning) */}
      {tip.show && (
        <div
          className="fixed z-[999] pointer-events-none whitespace-nowrap
            bg-[#1e1e1e] border border-[#333] rounded-lg px-3 py-2 shadow-xl"
          style={{ left: tip.x + 12, top: tip.y - 44 }}
        >
          <div className="text-[10px] font-semibold text-[#f97316]">{tip.text}</div>
          <div className="text-[9px] text-[#777] mt-0.5">{tip.sub}</div>
        </div>
      )}

      {/* Streak Ring */}
      <div className="flex justify-center mb-3">
        <svg viewBox="0 0 100 100" className="w-[72px] h-[72px]">
          {/* Background track */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="#2e2e2e" strokeWidth="7" />
          {/* Animated fill — rotate via SVG transform so it works correctly */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="#f97316"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="283"
            strokeDashoffset={ringOffset}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '50px 50px',
              transition: 'stroke-dashoffset 1.2s ease',
            }}
          />
          {/* Streak number */}
          <text
            x="50" y="46"
            fill="#f0f0f0" fontSize="18" fontWeight="700"
            textAnchor="middle" dominantBaseline="middle"
          >
            {streak}
          </text>
          <text
            x="50" y="61"
            fill="#555" fontSize="8.5"
            textAnchor="middle" dominantBaseline="middle"
          >
            day streak
          </text>
        </svg>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={handlePrev}
          className="w-6 h-6 flex items-center justify-center rounded border border-[#333]
            text-[#666] text-sm hover:border-[#f97316] hover:text-[#f97316] transition-colors"
        >
          ‹
        </button>
        <span className="text-[11px] font-semibold text-[#f0f0f0] tracking-wide">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={handleNext}
          className="w-6 h-6 flex items-center justify-center rounded border border-[#333]
            text-[#666] text-sm hover:border-[#f97316] hover:text-[#f97316] transition-colors"
        >
          ›
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d, i) => (
          <div
            key={d}
            className={`text-center text-[8px] font-semibold py-0.5
              ${i === 0 || i === 6 ? 'text-[#2d8de0]' : 'text-[#f97316]'}`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day Grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-2.5 text-[8px] text-[#666]">
        <span>less</span>
        {['#2e2e2e','#9a3412','#c2410c','#ea580c','#f97316'].map(c => (
          <div key={c} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
        ))}
        <span>more</span>
      </div>
    </div>
  );
}
