import { useState } from 'react';
import { Mail, MapPin, Phone, Clock, Send, Check } from 'lucide-react';
import Page from '../components/Page';
import Reveal from '../components/Reveal';

const FAQS = [
  { q: 'How do I find the right size?', a: 'Each product page has a detailed size guide based on age and height. When in doubt, size up — kids grow fast!' },
  { q: 'What is your returns policy?', a: 'Return any unworn item within 30 days for a full refund. Returns are free within the EU and US.' },
  { q: 'Are your fabrics really organic?', a: 'Yes — every piece is GOTS-certified organic cotton, independently audited from farm to finish.' },
  { q: 'Do you ship internationally?', a: 'We ship worldwide. Free shipping kicks in on orders over $75, and most parcels arrive in 3–7 days.' },
];

const DETAILS = [
  { icon: Mail, label: 'Email', value: 'hello@petitmonde.com' },
  { icon: Phone, label: 'Phone', value: '+351 210 000 000' },
  { icon: MapPin, label: 'Studio', value: 'Rua das Flores 24, Lisbon' },
  { icon: Clock, label: 'Hours', value: 'Mon–Fri · 9am–6pm WET' },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <Page>
      <div className="bg-sand">
        <div className="container-px py-14 text-center lg:py-20">
          <p className="label-eyebrow">We'd love to hear from you</p>
          <h1 className="mt-3 text-4xl text-ink lg:text-5xl">Get in touch</h1>
          <p className="mx-auto mt-4 max-w-xl text-ink/60">
            Questions about sizing, an order, or a custom request? Our little team is here to help.
          </p>
        </div>
      </div>

      <div className="container-px py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          {/* Details */}
          <Reveal>
            <h2 className="font-serif text-2xl">Contact details</h2>
            <div className="mt-6 space-y-5">
              {DETAILS.map((d) => (
                <div key={d.label} className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-100 text-sage-600">
                    <d.icon size={19} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-ink/45">{d.label}</p>
                    <p className="font-medium text-ink">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="mt-12 font-serif text-2xl">FAQs</h2>
            <div className="mt-5 space-y-4">
              {FAQS.map((f) => (
                <div key={f.q} className="rounded-2xl bg-white/70 p-5 shadow-soft">
                  <p className="font-medium text-ink">{f.q}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{f.a}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <form onSubmit={submit} className="rounded-[2rem] bg-sand p-8 lg:p-10">
              <h2 className="font-serif text-2xl">Send a message</h2>
              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink/70">Name</span>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm outline-none focus:border-ink/50" placeholder="Your name" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink/70">Email</span>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm outline-none focus:border-ink/50" placeholder="you@email.com" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink/70">Message</span>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full resize-none rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm outline-none focus:border-ink/50" placeholder="How can we help?" />
                </label>
                <button type="submit" className="btn-primary w-full py-3.5">
                  {sent ? <><Check size={18} /> Message sent</> : <>Send message <Send size={16} /></>}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </Page>
  );
}
