import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import StarRating from './StarRating';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { cn, formatPrice, titleCase } from '../lib/utils';

const badgeStyles = {
  new: 'bg-sage-500 text-cream',
  bestseller: 'bg-ink text-cream',
  sale: 'bg-clay-500 text-cream',
};

export default function ProductCard({ product, index = 0 }) {
  const { has, toggle } = useWishlist();
  const { push } = useToast();
  const [hover, setHover] = useState(false);
  const liked = has(product.id);

  const second = product.images?.[1];
  const onSale = product.originalPrice && product.originalPrice > product.price;
  const discount = onSale
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: (index % 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link
        to={`/product/${product.slug}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="block"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-sand">
          <img
            src={product.images?.[0] || product.image}
            alt={product.name}
            loading="lazy"
            className={cn(
              'h-full w-full object-cover transition-all duration-700 ease-out',
              hover && second ? 'opacity-0' : 'opacity-100 group-hover:scale-[1.04]'
            )}
          />
          {second && (
            <img
              src={second}
              alt=""
              aria-hidden
              loading="lazy"
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out',
                hover ? 'scale-[1.04] opacity-100' : 'opacity-0'
              )}
            />
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {onSale && (
              <span className="rounded-full bg-clay-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cream">
                −{discount}%
              </span>
            )}
            {product.badges?.filter((b) => b !== 'sale').slice(0, 1).map((b) => (
              <span
                key={b}
                className={cn(
                  'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider',
                  badgeStyles[b] || 'bg-ink text-cream'
                )}
              >
                {b}
              </span>
            ))}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(product.id);
              push(liked ? 'Removed from wishlist' : 'Saved to wishlist');
            }}
            aria-label="Toggle wishlist"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-ink shadow-soft backdrop-blur transition-transform duration-300 hover:scale-110"
          >
            <Heart
              size={16}
              className={cn('transition-colors', liked ? 'fill-clay-500 text-clay-500' : 'text-ink')}
            />
          </button>

          {/* Quick view hint */}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="rounded-full bg-cream/95 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.16em] text-ink shadow-soft backdrop-blur">
              View product
            </div>
          </div>
        </div>

        <div className="mt-4 px-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/40">
              {titleCase(product.type)} · {product.category}
            </p>
            <StarRating value={product.rating || 0} size={11} />
          </div>
          <h3 className="mt-1.5 font-serif text-lg leading-snug text-ink">{product.name}</h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[15px] font-semibold text-ink">{formatPrice(product.price)}</span>
            {onSale && (
              <span className="text-sm text-ink/40 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
