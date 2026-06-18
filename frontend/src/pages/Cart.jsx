import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight, Tag } from 'lucide-react';
import { useState } from 'react';
import Page from '../components/Page';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';

export default function Cart() {
  const { items, setQty, removeItem, subtotal, shipping, total } = useCart();
  const [promo, setPromo] = useState('');
  const [applied, setApplied] = useState(false);
  const discount = applied ? subtotal * 0.1 : 0;

  if (items.length === 0) {
    return (
      <Page>
        <div className="container-px flex min-h-[60vh] flex-col items-center justify-center text-center">
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-sand">
            <ShoppingBag size={36} className="text-ink/40" />
          </span>
          <h1 className="mt-6 font-serif text-3xl">Your bag is empty</h1>
          <p className="mt-3 max-w-sm text-ink/55">
            Looks like you haven't added anything yet. Let's find something they'll love.
          </p>
          <Link to="/shop" className="btn-primary mt-7">Start shopping <ArrowRight size={17} /></Link>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className="container-px py-12 lg:py-16">
        <h1 className="text-4xl text-ink lg:text-5xl">Shopping bag</h1>
        <p className="mt-2 text-ink/55">{items.reduce((n, l) => n + l.qty, 0)} items in your bag</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Lines */}
          <div>
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              <AnimatePresence initial={false}>
                {items.map((line) => (
                  <motion.li
                    key={line.key}
                    layout
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: 40 }}
                    className="flex gap-5 py-6"
                  >
                    <Link to={`/product/${line.slug}`} className="h-32 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-sand">
                      <img src={line.image} alt={line.name} className="h-full w-full object-cover" />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-3">
                        <div>
                          <Link to={`/product/${line.slug}`} className="font-serif text-lg hover:text-clay-600">{line.name}</Link>
                          <p className="mt-1 text-sm text-ink/55">{line.color} · Size {line.size}</p>
                        </div>
                        <p className="font-semibold">{formatPrice(line.price * line.qty)}</p>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center gap-1 rounded-full border border-ink/15">
                          <button onClick={() => setQty(line.key, line.qty - 1)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-sand" aria-label="Decrease"><Minus size={15} /></button>
                          <span className="w-6 text-center text-sm font-medium">{line.qty}</span>
                          <button onClick={() => setQty(line.key, line.qty + 1)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-sand" aria-label="Increase"><Plus size={15} /></button>
                        </div>
                        <button onClick={() => removeItem(line.key)} className="inline-flex items-center gap-1.5 text-sm text-ink/50 hover:text-clay-500">
                          <Trash2 size={15} /> Remove
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            <Link to="/shop" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink/70 hover:text-ink link-underline">
              <ArrowRight size={16} className="rotate-180" /> Continue shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-3xl bg-sand p-7">
              <h2 className="font-serif text-2xl">Order summary</h2>

              {/* Promo */}
              <div className="mt-5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                    <input
                      value={promo}
                      onChange={(e) => setPromo(e.target.value)}
                      placeholder="Promo code"
                      className="w-full rounded-full border border-ink/15 bg-cream py-2.5 pl-9 pr-3 text-sm outline-none focus:border-ink/40"
                    />
                  </div>
                  <button
                    onClick={() => setApplied(!!promo)}
                    className="rounded-full bg-ink px-4 text-sm font-medium text-cream hover:bg-clay-600"
                  >
                    Apply
                  </button>
                </div>
                {applied && <p className="mt-2 text-xs font-medium text-sage-600">✓ WELCOME10 applied — 10% off</p>}
                {!applied && <p className="mt-2 text-xs text-ink/45">Try <button onClick={() => { setPromo('WELCOME10'); setApplied(true); }} className="underline">WELCOME10</button> for 10% off</p>}
              </div>

              <div className="mt-6 space-y-3 border-t border-ink/10 pt-5 text-sm">
                <div className="flex justify-between text-ink/70"><span>Subtotal</span><span className="font-medium text-ink">{formatPrice(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-sage-600"><span>Discount (10%)</span><span>−{formatPrice(discount)}</span></div>}
                <div className="flex justify-between text-ink/70"><span>Shipping</span><span className="font-medium text-ink">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-5">
                <span className="font-serif text-xl">Total</span>
                <span className="font-serif text-2xl">{formatPrice(total - discount)}</span>
              </div>

              <Link to="/checkout" className="btn-primary mt-6 w-full py-3.5">
                Proceed to checkout <ArrowRight size={17} />
              </Link>
              <p className="mt-4 text-center text-xs text-ink/45">Taxes calculated at checkout · Secure payment</p>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
