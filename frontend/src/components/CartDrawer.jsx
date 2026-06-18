import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';

const FREE_THRESHOLD = 75;

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQty, removeItem, subtotal, shipping } = useCart();
  const remaining = Math.max(0, FREE_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-ink/45 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cream"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="flex items-center gap-2 font-serif text-xl">
                <ShoppingBag size={20} /> Your bag
                <span className="text-sm font-sans font-normal text-ink/50">
                  ({items.reduce((n, l) => n + l.qty, 0)})
                </span>
              </h2>
              <button onClick={closeCart} aria-label="Close cart" className="text-ink/60 hover:text-ink">
                <X size={22} />
              </button>
            </div>

            {/* Free shipping progress */}
            {items.length > 0 && (
              <div className="border-b border-ink/10 px-6 py-4">
                <p className="text-xs text-ink/70">
                  {remaining > 0 ? (
                    <>
                      You're <span className="font-semibold text-ink">{formatPrice(remaining)}</span> away
                      from free shipping
                    </>
                  ) : (
                    <span className="font-semibold text-sage-600">🎉 You've unlocked free shipping!</span>
                  )}
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-sand">
                  <motion.div
                    className="h-full rounded-full bg-sage-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-sand">
                    <ShoppingBag size={30} className="text-ink/40" />
                  </span>
                  <p className="mt-5 font-serif text-xl">Your bag is empty</p>
                  <p className="mt-2 max-w-xs text-sm text-ink/55">
                    Discover beautifully made pieces your little one will love.
                  </p>
                  <Link to="/shop" onClick={closeCart} className="btn-primary mt-6">
                    Start shopping
                  </Link>
                </div>
              ) : (
                <ul className="space-y-5">
                  <AnimatePresence initial={false}>
                    {items.map((line) => (
                      <motion.li
                        key={line.key}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, x: 40 }}
                        className="flex gap-4"
                      >
                        <Link
                          to={`/product/${line.slug}`}
                          onClick={closeCart}
                          className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-sand"
                        >
                          <img src={line.image} alt={line.name} className="h-full w-full object-cover" />
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-2">
                            <Link
                              to={`/product/${line.slug}`}
                              onClick={closeCart}
                              className="font-serif text-base leading-tight hover:text-clay-600"
                            >
                              {line.name}
                            </Link>
                            <button
                              onClick={() => removeItem(line.key)}
                              aria-label="Remove"
                              className="text-ink/40 hover:text-clay-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="mt-0.5 text-xs text-ink/50">
                            {line.color} · {line.size}
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center gap-1 rounded-full border border-ink/15">
                              <button
                                onClick={() => setQty(line.key, line.qty - 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-sand"
                                aria-label="Decrease"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="w-5 text-center text-sm font-medium">{line.qty}</span>
                              <button
                                onClick={() => setQty(line.key, line.qty + 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-sand"
                                aria-label="Increase"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                            <span className="text-sm font-semibold">{formatPrice(line.price * line.qty)}</span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-ink/10 px-6 py-5">
                <div className="flex items-center justify-between text-sm text-ink/70">
                  <span>Subtotal</span>
                  <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm text-ink/70">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <Link to="/checkout" onClick={closeCart} className="btn-primary mt-4 w-full">
                  Checkout · {formatPrice(subtotal + shipping)}
                </Link>
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="mt-2 block text-center text-sm text-ink/60 underline-offset-4 hover:text-ink hover:underline"
                >
                  View full bag
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
