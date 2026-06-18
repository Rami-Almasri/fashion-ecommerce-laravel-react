import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Page from '../components/Page';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { login } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await login(form);
    setLoading(false);
    if (res.ok) {
      push('Welcome back!');
      navigate('/account');
    } else {
      setError(res.message || 'Something went wrong.');
    }
  };

  return (
    <Page>
      <div className="container-px grid min-h-[80vh] items-stretch gap-0 py-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex items-center justify-center py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="w-full max-w-sm"
          >
            <p className="label-eyebrow">Welcome back</p>
            <h1 className="mt-3 text-4xl text-ink">Sign in</h1>
            <p className="mt-2 text-ink/55">Good to see you again. Let's get you styled.</p>

            <form onSubmit={submit} className="mt-8 space-y-4">
              {error && <div className="rounded-xl bg-clay-100 px-4 py-3 text-sm text-clay-700">{error}</div>}
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink/70">Email</span>
                <input
                  type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@email.com"
                  className="w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm outline-none focus:border-ink/50"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink/70">Password</span>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'} required value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 pr-11 text-sm outline-none focus:border-ink/50"
                  />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink">
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-ink/60">
                  <input type="checkbox" className="accent-ink" /> Remember me
                </label>
                <a href="#" className="text-clay-600 hover:underline">Forgot password?</a>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign in'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink/60">
              New here? <Link to="/signup" className="font-medium text-clay-600 hover:underline">Create an account</Link>
            </p>
          </motion.div>
        </div>

        <div className="relative hidden overflow-hidden rounded-[2.5rem] lg:block">
          <img
            src="https://images.unsplash.com/photo-1695262620884-b1fdb55a631e?auto=format&fit=crop&w=1000&q=80"
            alt="Child in a white dress"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
          <div className="absolute bottom-10 left-10 max-w-xs text-cream">
            <p className="font-serif text-3xl leading-tight">Dressed for the little moments that matter.</p>
          </div>
        </div>
      </div>
    </Page>
  );
}
