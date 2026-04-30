import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MousePointerClick } from 'lucide-react';

function SuccessParticles({ buttonRef }) {
  const rect = buttonRef.current?.getBoundingClientRect();

  if (!rect) return null;

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return (
    <AnimatePresence>
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 0],
            x: [0, (index % 2 ? 1 : -1) * (Math.random() * 28 + 12)],
            y: [0, -Math.random() * 28 - 12],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.55, delay: index * 0.05, ease: 'easeOut' }}
          className="fixed h-1.5 w-1.5 rounded-full bg-sky-300"
          style={{ left: centerX, top: centerY }}
        />
      ))}
    </AnimatePresence>
  );
}

export default function ParticleButton({
  children,
  className = '',
  onClick,
  successDuration = 700,
  ...props
}) {
  const [showParticles, setShowParticles] = useState(false);
  const buttonRef = useRef(null);

  const handleClick = (event) => {
    event.stopPropagation();
    setShowParticles(true);
    window.setTimeout(() => setShowParticles(false), successDuration);
    onClick?.(event);
  };

  return (
    <>
      {showParticles && <SuccessParticles buttonRef={buttonRef} />}
      <button
        ref={buttonRef}
        onClick={handleClick}
        className={[
          'relative inline-flex items-center gap-2 rounded-2xl border border-sky-200/80 bg-sky-300 px-8 py-4 text-lg font-black text-slate-950 transition-transform duration-150 hover:bg-sky-200 active:scale-95 shadow-none',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
        <MousePointerClick className="h-4 w-4" />
      </button>
    </>
  );
}