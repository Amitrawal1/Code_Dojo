import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import StickyStepCard, { STEPS } from '../components/landing/StickyStepCard';
import Particles from '../components/landing/Particles';
import CpuArchitecture from '../components/landing/CpuArchitecture';

export default function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div className="min-h-screen bg-[#0d1117] text-white relative">
      {/* Global violet gradient overlay — behind cards (z-0), covers whole page */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(139,92,246,0.13) 0%, rgba(109,40,217,0.07) 40%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(139,92,246,0.08) 0%, transparent 60%)',
        }}
      />
      
      

      {/* Hero Section */}
      <section className="relative z-0 pt-32 pb-20 px-6 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[640px] pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_20%,rgba(34,211,238,0.14)_0%,rgba(14,165,233,0.08)_38%,transparent_72%)]" />
          <div style={{ width: '100%', height: '600px', position: 'relative', pointerEvents: 'auto' }}>
            <Particles
              particleColors={["#a669ed"]}
              particleCount={400}
              particleSpread={10}
              speed={0.1}
              particleBaseSize={100}
              moveParticlesOnHover
              alphaParticles={false}
              disableRotation={false}
              pixelRatio={1}
            />
          </div>
        </div>


        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-10 text-7xl md:text-9xl font-black mb-6 tracking-tighter leading-none"
        >
          DOJO
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-gray-400 text-xl md:text-2xl max-w-2xl mb-12 leading-relaxed"
        >
          Don't just solve problems. <span className="text-white font-bold underline decoration-cyan-500/50">Master the logic</span>. 
          The only platform where an AI gatekeeper checks your understanding before your code.
        </motion.p>
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate('/login')}
          className="relative z-10 mt-4 group bg-white text-black px-8 py-4 rounded-2xl text-lg font-black transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-2xl shadow-white/10"
        >
          Enter the Dojo <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
        
      </section>

      {/* STICKY CARDS SECTION */}
      <section ref={containerRef} className="relative pt-16 md:pt-20">
        <div className="sticky top-0 z-[60] py-3 md:py-5 px-8 bg-[#0d1117]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-gray-500">The Arena Flow</h2>
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => {
                const userStr = localStorage.getItem('codedojo_user');
                navigate(userStr ? '/dashboard' : '/login');
              }}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-black font-bold text-sm hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20"
              title="Profile / Login"
            >
              {localStorage.getItem('codedojo_user') ? JSON.parse(localStorage.getItem('codedojo_user')).name?.charAt(0).toUpperCase() || 'U' : '→'}
            </button>
          </div>
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

      {/* CPU Architecture Section */}
      <section className="relative py-16 px-6 overflow-hidden border-t border-white/5 bg-[#0d1117]">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-violet-400/60 mb-2">Powered by Logic</p>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Every submission flows through the <span className="text-violet-400">Gatekeeper</span>
          </h2>
          <p className="text-gray-500 text-sm mt-3 max-w-xl mx-auto">Your code doesn't just run — it travels through an AI circuit that verifies your reasoning before it's accepted.</p>
        </div>
        <div className="max-w-3xl mx-auto w-full" style={{ height: '240px' }}>
          <CpuArchitecture
            width="100%"
            height="100%"
            text="DOJO"
            animateText={true}
            animateLines={true}
            animateMarkers={true}
            showCpuConnections={true}
          />
        </div>
      </section>

      <footer className="py-16 px-8 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="bg-cyan-500 text-black text-xs font-bold px-2 py-0.5 rounded">✕</span>
          <span className="text-white font-bold tracking-wider text-xl">CODE DOJO</span>
        </div>
        <p className="text-gray-500 text-sm">Built for the next generation of logical thinkers.</p>
      </footer>
    </div>
  );
}
