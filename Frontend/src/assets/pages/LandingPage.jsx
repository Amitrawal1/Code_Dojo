import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import StickyStepCard, { STEPS } from '../components/landing/StickyStepCard';

export default function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      
      

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyan-500/10 blur-[120px] rounded-full -z-10 opacity-50"></div>


        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-7xl md:text-9xl font-black mb-6 tracking-tighter leading-none"
        >
          DOJO
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-xl md:text-2xl max-w-2xl mb-12 leading-relaxed"
        >
          Don't just solve problems. <span className="text-white font-bold underline decoration-cyan-500/50">Master the logic</span>. 
          The only platform where an AI gatekeeper checks your understanding before your code.
        </motion.p>
        
        
      </section>

      <button 
        onClick={() => navigate('/login')}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 group bg-white text-black px-8 py-4 rounded-2xl text-lg font-black transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-2xl shadow-white/10"
      >
        Enter the Dojo <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>

      {/* STICKY CARDS SECTION */}
      <section ref={containerRef} className="relative">
        <div className="sticky top-0 z-[60] py-10 px-8 bg-[#0d1117]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between">
          
        </div>

        <div className="relative" style={{ height: `${STEPS.length * 100}vh` }}>
          {STEPS.map((step, i) => (
            <StickyStepCard 
              key={i} 
              step={step} 
              index={i} 
              total={STEPS.length} 
              scrollYProgress={scrollYProgress} 
            />
          ))}
        </div>
      </section>

      <footer className="py-20 px-8 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="bg-cyan-500 text-black text-xs font-bold px-2 py-0.5 rounded">✕</span>
          <span className="text-white font-bold tracking-wider text-xl">CODE DOJO</span>
        </div>
        <p className="text-gray-500 text-sm">Built for the next generation of logical thinkers.</p>
      </footer>
    </div>
  );
}
