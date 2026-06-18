import { Link } from 'react-router-dom';
import { Instagram, Facebook, Truck, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'New Arrivals', to: '/shop' },
      { label: 'Baby', to: '/shop/baby' },
      { label: 'Girls', to: '/shop/girls' },
      { label: 'Boys', to: '/shop/boys' },
      { label: 'Essentials', to: '/shop/essentials' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Our Story', to: '/about' },
      { label: 'Sustainability', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Journal', to: '/about' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Shipping & Returns', to: '/contact' },
      { label: 'Size Guide', to: '/shop' },
      { label: 'Track Order', to: '/account' },
      { label: 'FAQs', to: '/contact' },
    ],
  },
];

const PERKS = [
  { icon: Truck, title: 'Free shipping', text: 'On orders over $75' },
  { icon: RefreshCw, title: 'Easy returns', text: '30-day returns' },
  { icon: ShieldCheck, title: 'Secure checkout', text: 'Encrypted & safe' },
  { icon: Sparkles, title: 'Made to last', text: 'Organic fabrics' },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink text-cream">
      {/* Perks strip */}
      <div className="border-b border-cream/10">
        <div className="container-px grid grid-cols-2 gap-6 py-10 lg:grid-cols-4">
          {PERKS.map((p) => (
            <div key={p.title} className="flex items-center gap-3">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-cream/10">
                <p.icon size={19} className="text-clay-200" />
              </span>
              <div>
                <p className="text-sm font-semibold">{p.title}</p>
                <p className="text-xs text-cream/55">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-px grid gap-12 py-16 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-sm">
          <p className="font-serif text-2xl font-semibold tracking-[0.16em]">PETIT MONDE</p>
          <p className="mt-4 text-sm leading-relaxed text-cream/60">
            A little world of beautifully made children's clothing. Designed with care, cut from
            organic fabrics, and built for play — for ages 0 to 12.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 transition hover:bg-cream hover:text-ink"
            >
              <Instagram size={18} />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 transition hover:bg-cream hover:text-ink"
            >
              <Facebook size={18} />
            </a>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/50">{col.title}</p>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-cream/75 transition hover:text-cream link-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-cream/10">
        <div className="container-px flex flex-col items-center justify-between gap-3 py-6 text-xs text-cream/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Petit Monde. Crafted with love.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-cream">Privacy</a>
            <a href="#" className="hover:text-cream">Terms</a>
            <a href="#" className="hover:text-cream">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
