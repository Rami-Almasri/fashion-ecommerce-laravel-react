import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const MESSAGES = [
  'Free shipping on orders over $75 — always',
  'New summer collection just landed ☀️',
  '30-day easy returns · made for growing kids',
];

export default function Announcement() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % MESSAGES.length), 4200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative z-40 overflow-hidden bg-ink text-cream">
      <div className="container-px flex h-9 items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-[11px] font-medium uppercase tracking-[0.22em]"
          >
            {MESSAGES[i]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
