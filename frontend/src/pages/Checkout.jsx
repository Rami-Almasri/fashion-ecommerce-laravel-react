import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CreditCard, Lock, MapPin, User, ChevronLeft, PartyPopper } from 'lucide-react';
import Page from '../components/Page';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { formatPrice } from '../lib/utils';

const STEPS = ['Contact', 'Shipping', 'Payment'];

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink/70">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm outline-none transition focus:border-ink/50"
      />
    </label>
  );
}

export default function Checkout() {
  const { items, subtotal, shipping, total, clear } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '', address: '', city: '', zip: '', country: 'United States',
    card: '', exp: '', cvc: '', name: '',
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (items.length === 0 && !placed) {
    return (
      <Page>
        <div className="container-px flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h1 className="font-serif text-3xl">Your bag is empty</h1>
          <p className="mt-2 text-ink/55">Add a few pieces before checking out.</p>
          <Link to="/shop" className="btn-primary mt-6">Browse the shop</Link>
        </div>
      </Page>
    );
  }

  if (placed) {
    return (
      <Page>
        <div className="container-px flex min-h-[70vh] flex-col items-center justify-center text-center">
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-sage-500 text-cream"
          >
            <PartyPopper size={40} />
          </motion.span>
          <h1 className="mt-7 font-serif text-4xl">Thank you!</h1>
          <p className="mt-3 max-w-md text-ink/60">
            Your order is confirmed. We've sent a confirmation to{' '}
            <span className="font-medium text-ink">{form.email || 'your inbox'}</span>. Your little
            one's new favourites are on the way.
          </p>
          <p className="mt-4 rounded-full bg-sand px-5 py-2 text-sm font-medium">
            Order #PM-{Math.floor(100000 + (total * 97) % 900000)}
          </p>
          <Link to="/shop" className="btn-primary mt-8">Continue shopping</Link>
        </div>
      </Page>
    );
  }

  const next = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    // Final step → place the order. Persist to the API when signed in;
    // otherwise fall back to the demo confirmation.
    setSubmitting(true);
    if (isAuthenticated) {
      try {
        await api.createOrder({
          items: items.map((l) => ({
            product_id: l.id,
            name: l.name,
            color: l.color,
            size: l.size,
            quantity: l.qty,
          })),
        });
      } catch (_) {
        /* keep the demo flow even if the API is unavailable */
      }
    }
    setSubmitting(false);
    clear();
    setPlaced(true);
  };

  return (
    <Page>
      <div className="container-px py-10 lg:py-14">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="font-serif text-xl font-semibold tracking-[0.16em]">PETIT MONDE</Link>
          <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink">
            <ChevronLeft size={16} /> Back to bag
          </Link>
        </div>

        {/* Stepper */}
        <div className="mx-auto mb-10 flex max-w-md items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition ${i <= step ? 'bg-ink text-cream' : 'bg-sand text-ink/40'}`}>
                  {i < step ? <Check size={16} /> : i + 1}
                </div>
                <span className={`text-xs font-medium ${i <= step ? 'text-ink' : 'text-ink/40'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`mx-2 h-px flex-1 ${i < step ? 'bg-ink' : 'bg-ink/15'}`} />}
            </div>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
              >
                {step === 0 && (
                  <div className="space-y-5">
                    <h2 className="flex items-center gap-2 font-serif text-2xl"><User size={20} /> Contact details</h2>
                    <Field label="Email address" type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="First name" placeholder="Jane" value={form.firstName} onChange={set('firstName')} />
                      <Field label="Last name" placeholder="Doe" value={form.lastName} onChange={set('lastName')} />
                    </div>
                  </div>
                )}
                {step === 1 && (
                  <div className="space-y-5">
                    <h2 className="flex items-center gap-2 font-serif text-2xl"><MapPin size={20} /> Shipping address</h2>
                    <Field label="Street address" placeholder="123 Blossom Lane" value={form.address} onChange={set('address')} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="City" placeholder="Lisbon" value={form.city} onChange={set('city')} />
                      <Field label="Postal code" placeholder="1100-000" value={form.zip} onChange={set('zip')} />
                    </div>
                    <Field label="Country" value={form.country} onChange={set('country')} />
                    <div className="rounded-2xl bg-sage-50 p-4 text-sm text-sage-700">
                      🚚 {shipping === 0 ? 'You qualify for free shipping!' : `Standard shipping ${formatPrice(shipping)} — arrives in 3–5 days.`}
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-5">
                    <h2 className="flex items-center gap-2 font-serif text-2xl"><CreditCard size={20} /> Payment</h2>
                    <div className="flex items-center gap-2 rounded-xl bg-sand px-4 py-3 text-sm text-ink/60">
                      <Lock size={15} /> This is a demo — no real payment is processed.
                    </div>
                    <Field label="Name on card" placeholder="Jane Doe" value={form.name} onChange={set('name')} />
                    <Field label="Card number" placeholder="4242 4242 4242 4242" value={form.card} onChange={set('card')} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Expiry" placeholder="MM / YY" value={form.exp} onChange={set('exp')} />
                      <Field label="CVC" placeholder="123" value={form.cvc} onChange={set('cvc')} />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex gap-3">
              {step > 0 && (
                <button onClick={() => setStep(step - 1)} className="btn-secondary">
                  <ChevronLeft size={16} /> Back
                </button>
              )}
              <button onClick={next} disabled={submitting} className="btn-primary flex-1 py-3.5">
                {submitting ? 'Placing order…' : step === STEPS.length - 1 ? `Pay ${formatPrice(total)}` : 'Continue'}
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-3xl bg-sand p-7">
              <h2 className="font-serif text-xl">Your order</h2>
              <ul className="mt-5 space-y-4">
                {items.map((line) => (
                  <li key={line.key} className="flex gap-3">
                    <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-cream">
                      <img src={line.image} alt={line.name} className="h-full w-full object-cover" />
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-cream">{line.qty}</span>
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="text-sm font-medium leading-tight">{line.name}</p>
                      <p className="text-xs text-ink/50">{line.color} · {line.size}</p>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(line.price * line.qty)}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-5 space-y-2 border-t border-ink/10 pt-5 text-sm">
                <div className="flex justify-between text-ink/70"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-ink/70"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
                <span className="font-serif text-lg">Total</span>
                <span className="font-serif text-xl">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
