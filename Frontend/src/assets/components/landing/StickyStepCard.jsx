import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { Brain, Terminal, GitBranch } from 'lucide-react';

export const STEPS = [
  {
    n: '01', title: 'Read the Problem',
    longDesc: 'You get the raw problem. No hints, no solutions, no distractions. Just you and the challenge — the way real interviews actually work.',
    chips: ['No spoilers', 'Real constraints', 'Time complexity shown'],
    icon: Terminal,
  },
  {
    n: '02', title: 'Explain Your Approach',
    longDesc: 'Before a single keystroke in the editor, the Socratic AI fires questions at your reasoning. Why that data structure? What is the worst case? It does not accept vague answers.',
    chips: ['AI interrogation', 'Assumption challenged', 'Hints cost XP'],
    icon: GitBranch,
  },
  {
    n: '03', title: 'Write the Code',
    longDesc: 'The editor unlocks only once the AI is convinced you understand. Now you code with full context in your head — not copied from memory.',
    chips: ['Editor gated', 'Syntax highlighted', 'Live test runner'],
    icon: Brain,
  },
  
];

const CARD_COLORS = [
  { bg: 'linear-gradient(135deg,#1a0a3e 0%,#0f0630 100%)', accent: '#a78bfa', num: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.2)' },
  { bg: 'linear-gradient(135deg,#001f3d 0%,#00152a 100%)', accent: '#38bdf8', num: 'rgba(56,189,248,0.12)',   border: 'rgba(56,189,248,0.2)'  },
  { bg: 'linear-gradient(135deg,#0d2e1a 0%,#071a0f 100%)', accent: '#22c55e', num: 'rgba(34,197,94,0.12)',    border: 'rgba(34,197,94,0.2)'   },
  
];

export default function StickyStepCard({ step, index, total, scrollYProgress }) {
  const targetScale = 1 - (total - 1 - index) * 0.04;
  const scale = useTransform(
    scrollYProgress,
    [index / total, (index + 1) / total],
    [1, targetScale]
  );

  const c = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <div className="sticky top-[80px] h-[calc(100vh-100px)] flex items-center justify-center px-4">
      <motion.div 
        className="w-full max-w-[1200px] rounded-[28px] p-8 md:p-16 relative overflow-hidden shadow-2xl border"
        style={{
          scale,
          background: c.bg,
          borderColor: c.border,
        }}
      >
        {/* Ghost Number */}
        <div className="absolute top-[-20px] right-10 font-black text-[12rem] md:text-[18rem] opacity-10 pointer-events-none select-none z-0" style={{ color: c.accent }}>
          {step.n}
        </div>

        <div className="relative z-10">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8 border" style={{ borderColor: `${c.accent}44`, backgroundColor: `${c.accent}14`, color: c.accent }}>
            Step {step.n}
          </span>

          <h3 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tighter">
            {step.title}
          </h3>

          <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-xl mb-10">
            {step.longDesc}
          </p>

          <div className="flex flex-wrap gap-3">
            {step.chips.map(chip => (
              <span key={chip} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-medium">
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="absolute bottom-12 right-12 w-24 h-24 rounded-3xl flex items-center justify-center border" style={{ backgroundColor: `${c.accent}18`, borderColor: `${c.accent}33` }}>
          <step.icon size={48} style={{ color: c.accent }} />
        </div>
      </motion.div>
    </div>
  );
}
