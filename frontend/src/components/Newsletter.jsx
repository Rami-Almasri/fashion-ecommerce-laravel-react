import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Send } from 'lucide-react';
import Reveal from './Reveal';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
    setEmail('');
    setTimeout(() => setDone(false), 4000);
  };

  return (
    <section className="container-px py-20 lg:py-28">
      <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-sage-700 px-6 py-16 text-center text-cream sm:px-12 lg:py-24">
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-sage-600/60 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-clay-500/30 blur-3xl" />
        <div className="relative mx-auto max-w-xl">
          <p className="label-eyebrow text-clay-200">Join the little world</p>
          <h2 className="mt-3 text-3xl text-cream sm:text-4xl">
            10% off your first order
          </h2>
          <p className="mt-4 text-cream/75">
            Be first to shop new arrivals, seasonal edits and members-only offers. No clutter — just
            the good stuff, a few times a month.
          </p>
          <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-full border border-cream/20 bg-cream/10 px-5 py-3.5 text-cream outline-none transition placeholder:text-cream/50 focus:border-cream/60"
            />
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="btn flex-shrink-0 gap-2 bg-cream px-7 py-3.5 text-ink hover:bg-clay-100"
            >
              {done ? (
                <>
                  <Check size={17} /> Subscribed
                </>
              ) : (
                <>
                  Subscribe <Send size={16} />
                </>
              )}
            </motion.button>
          </form>
          <p className="mt-4 text-xs text-cream/50">By subscribing you agree to our privacy policy.</p>
        </div>
      </Reveal>
    </section>
  );
}
