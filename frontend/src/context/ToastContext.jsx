import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  const push = (message, opts = {}) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message, ...opts }]);
    setTimeout(() => remove(id), opts.duration || 2800);
  };

  const value = useMemo(() => ({ push }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="pointer-events-auto flex items-center gap-3 rounded-full bg-ink px-5 py-3 text-sm font-medium text-cream shadow-card"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sage-400 text-ink">
                <Check size={13} strokeWidth={3} />
              </span>
              {t.message}
              <button onClick={() => remove(t.id)} className="ml-1 text-cream/50 hover:text-cream">
                <X size={15} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
