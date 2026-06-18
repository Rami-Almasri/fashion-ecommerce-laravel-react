import { motion } from 'framer-motion';

// Entrance animation that runs on mount (no IntersectionObserver), so content
// is always rendered and never stuck invisible. Still gives a smooth fade-up.
export default function Reveal({ children, delay = 0, y = 28, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
