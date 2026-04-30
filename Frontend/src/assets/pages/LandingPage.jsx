import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import ShinyText from '../components/landing/ShinyText';
import StickyStepCard, { STEPS } from '../components/landing/StickyStepCard';
import CpuArchitecture from '../components/landing/CpuArchitecture';
import Particles from '../components/landing/Particles';

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
      <section className="relative z-0 min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-6">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_20%,rgba(34,211,238,0.14)_0%,rgba(14,165,233,0.08)_38%,transparent_72%)]" />
          <div style={{ width: '100%', height: '100%', position: 'relative', pointerEvents: 'auto' }}>
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


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative z-10 mb-6"
        >
          <p className="text-sm md:text-base font-bold tracking-[0.3em] uppercase text-cyan-400/80 mb-8">
            India's First AI-Powered Socratic DSA Arena
          </p>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-10 text-7xl md:text-9xl font-black mb-6 tracking-tighter leading-tight"
        >
          <ShinyText 
            text="DOJO" 
            speed={3} 
            color="#b5b5b5" 
            shineColor="#ffffff" 
            spread={100}
            direction="left"
            className="pb-4 pr-2"
          />
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative z-10 mb-8"
        >
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-6 leading-relaxed">
            Where the AI never gives you the answer. Instead, it asks the right questions until you find it.
          </p>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-gray-400 text-xl md:text-2xl max-w-2xl mb-12 leading-relaxed"
        >
          Don't just solve problems. <span className="text-white font-bold underline decoration-cyan-500/50">Master the logic</span>. 
          The only platform where an AI gatekeeper checks your understanding before your code.
        </motion.p>
        
      </section>

      {/* STICKY CARDS SECTION */}
      <section ref={containerRef} className="relative pt-16 md:pt-20">

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

      {/* Who It's For Section */}
      <section className="relative py-24 px-6 overflow-hidden border-t border-white/5 bg-[#0d1117]">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm font-bold tracking-[0.3em] uppercase text-cyan-400/80 mb-4">Who It's For</p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
              Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">One Student</span> in Particular
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              You've been coding for a year or two. You understand what a binary tree is. But when the interviewer asks you to implement a problem you've never seen, your mind goes blank. You've done 50 LeetCode problems and you're not sure you've actually learned anything. CodeDojo was built for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5, backgroundColor: "rgba(22, 27, 34, 0.8)" }}
              className="bg-[#161b22]/50 backdrop-blur-sm border border-white/10 p-8 rounded-2xl relative overflow-hidden group transition-colors"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 border border-cyan-500/20 text-cyan-400 font-bold text-xl">01</div>
              <h3 className="text-xl font-bold text-white mb-4">The Placement Aspirant</h3>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                B.Tech CS student preparing for SDE roles at top tech companies. You need placement-pattern problems with guidance that mimics what a senior mentor would give you.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, backgroundColor: "rgba(22, 27, 34, 0.8)" }}
              className="bg-[#161b22]/50 backdrop-blur-sm border border-white/10 p-8 rounded-2xl relative overflow-hidden group transition-colors"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
              <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center mb-6 border border-violet-500/20 text-violet-400 font-bold text-xl">02</div>
              <h3 className="text-xl font-bold text-white mb-4">The Conceptual Learner</h3>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                You want to understand DSA deeply — not just pass tests. You want to be asked why, not just told what.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5, backgroundColor: "rgba(22, 27, 34, 0.8)" }}
              className="bg-[#161b22]/50 backdrop-blur-sm border border-white/10 p-8 rounded-2xl relative overflow-hidden group transition-colors"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20 text-emerald-400 font-bold text-xl">03</div>
              <h3 className="text-xl font-bold text-white mb-4">The Productive Struggler</h3>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                You don't want the answer handed to you. You want just enough of a nudge to keep going. You know the struggle is the point — you just need a system designed around that insight.
              </p>
            </motion.div>
          </div>
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
      {/* FIXED CTA BUTTON — always visible */}
      <motion.button 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => navigate('/login')}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] group bg-white text-black px-8 py-4 rounded-2xl text-lg font-black transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-2xl shadow-white/10"
      >
        Enter the Dojo <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  );
}
