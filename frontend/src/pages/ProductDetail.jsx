import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, Heart, Minus, Plus, Ruler, ShoppingBag, Truck, RefreshCw, Leaf, ChevronDown, X, Check,
} from 'lucide-react';
import Page from '../components/Page';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import SectionHeading from '../components/SectionHeading';
import { useProduct, useProducts } from '../hooks/useCatalog';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { cn, formatPrice, titleCase } from '../lib/utils';

const SWATCH = {
  Ecru: '#EFE7DA', Clay: '#B86E48', Sage: '#8AA26F', Sky: '#A9C4D4',
  Blush: '#E7B7AE', Navy: '#2E3A4B', Mustard: '#D8A24A', Charcoal: '#33312E',
  Ivory: '#F7F2E9', Rust: '#A65A3A',
};

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ink/10">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between py-4 text-left">
        <span className="font-medium text-ink">{title}</span>
        <ChevronDown size={18} className={cn('text-ink/50 transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm leading-relaxed text-ink/65">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { product, loading } = useProduct(slug);
  const { products } = useProducts();
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { push } = useToast();

  const [activeImg, setActiveImg] = useState(0);
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [guideOpen, setGuideOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setActiveImg(0);
    setQty(1);
    setError('');
    if (product) {
      setColor(product.colors?.[0]?.name || null);
      setSize(null);
    }
  }, [product?.id]);

  // Unique sizes for the selected colour.
  const sizesForColor = useMemo(() => {
    if (!product?.variants) return [];
    const seen = new Map();
    product.variants
      .filter((v) => !color || v.color === color)
      .forEach((v) => {
        if (!seen.has(v.size)) seen.set(v.size, v.stock);
      });
    return [...seen.entries()].map(([size, stock]) => ({ size, stock }));
  }, [product, color]);

  const selectedVariant = product?.variants?.find((v) => v.color === color && v.size === size);
  const onSale = product?.originalPrice && product.originalPrice > product.price;

  const related = useMemo(
    () => products.filter((p) => p.category === product?.category && p.id !== product?.id).slice(0, 4),
    [products, product]
  );

  if (loading) {
    return (
      <Page>
        <div className="container-px py-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="aspect-[4/5] animate-pulse rounded-3xl bg-sand" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 animate-pulse rounded-full bg-sand" />
              <div className="h-5 w-1/3 animate-pulse rounded-full bg-sand" />
              <div className="h-24 w-full animate-pulse rounded-2xl bg-sand" />
            </div>
          </div>
        </div>
      </Page>
    );
  }

  if (!product) {
    return (
      <Page>
        <div className="container-px py-32 text-center">
          <h1 className="font-serif text-3xl">Product not found</h1>
          <Link to="/shop" className="btn-primary mt-6">Back to shop</Link>
        </div>
      </Page>
    );
  }

  const liked = has(product.id);
  const lowStock = selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 3;
  const outOfStock = selectedVariant && selectedVariant.stock === 0;

  const handleAdd = () => {
    if (!size) {
      setError('Please select a size');
      return;
    }
    if (outOfStock) {
      setError('That size is out of stock');
      return;
    }
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image,
      color,
      size,
      qty,
    });
    push(`${product.name} added to bag`);
  };

  return (
    <Page>
      <div className="container-px py-8 lg:py-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row">
            {product.images?.length > 1 && (
              <div className="flex gap-3 sm:flex-col">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={cn(
                      'h-20 w-16 overflow-hidden rounded-xl bg-sand ring-1 transition sm:h-24 sm:w-20',
                      activeImg === i ? 'ring-2 ring-ink' : 'ring-ink/10 hover:ring-ink/30'
                    )}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="relative flex-1 overflow-hidden rounded-3xl bg-sand">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={product.images?.[activeImg] || product.image}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="aspect-[4/5] h-full w-full object-cover"
                />
              </AnimatePresence>
              {onSale && (
                <span className="absolute left-4 top-4 rounded-full bg-clay-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-cream">
                  Sale
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="lg:py-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink/40">
              {titleCase(product.type)} · {product.category} · {titleCase(product.season)}
            </p>
            <h1 className="mt-2 text-3xl text-ink lg:text-4xl">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3">
              <StarRating value={product.rating || 0} size={16} showValue />
              <span className="text-sm text-ink/50">· {product.reviews || 0} reviews</span>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <span className="text-2xl font-semibold text-ink">{formatPrice(product.price)}</span>
              {onSale && (
                <>
                  <span className="text-lg text-ink/40 line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="rounded-full bg-clay-100 px-2.5 py-1 text-xs font-bold text-clay-600">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            <p className="mt-6 leading-relaxed text-ink/70">{product.description}</p>

            {/* Colour */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">
                  Colour: <span className="font-normal text-ink/60">{color}</span>
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.colors?.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => { setColor(c.name); setSize(null); }}
                    title={c.name}
                    aria-label={c.name}
                    className={cn(
                      'relative flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-ink/10 transition',
                      color === c.name && 'ring-2 ring-ink ring-offset-2 ring-offset-cream'
                    )}
                    style={{ backgroundColor: c.hex || SWATCH[c.name] }}
                  >
                    {color === c.name && (
                      <Check size={15} className={['Charcoal', 'Navy', 'Rust', 'Clay'].includes(c.name) ? 'text-cream' : 'text-ink'} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mt-7">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">Size {error && <span className="ml-2 font-normal text-clay-600">— {error}</span>}</p>
                <button
                  onClick={() => setGuideOpen(true)}
                  className="inline-flex items-center gap-1.5 text-sm text-ink/60 underline-offset-2 hover:text-ink hover:underline"
                >
                  <Ruler size={15} /> Size guide
                </button>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                {sizesForColor.map(({ size: s, stock }) => {
                  const isOut = stock === 0;
                  return (
                    <button
                      key={s}
                      disabled={isOut}
                      onClick={() => { setSize(s); setError(''); }}
                      className={cn(
                        'relative rounded-xl border py-3 text-sm font-medium transition',
                        size === s
                          ? 'border-ink bg-ink text-cream'
                          : isOut
                          ? 'cursor-not-allowed border-ink/10 text-ink/30 line-through'
                          : 'border-ink/15 text-ink/80 hover:border-ink/50'
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              {lowStock && (
                <p className="mt-2.5 text-sm font-medium text-clay-600">
                  Only {selectedVariant.stock} left in {color} / {size} — almost gone!
                </p>
              )}
            </div>

            {/* Qty + actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="flex items-center justify-between rounded-full border border-ink/15 px-2 sm:w-36">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-sand" aria-label="Decrease">
                  <Minus size={16} />
                </button>
                <span className="font-medium">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(20, q + 1))} className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-sand" aria-label="Increase">
                  <Plus size={16} />
                </button>
              </div>
              <motion.button whileTap={{ scale: 0.98 }} onClick={handleAdd} className="btn-primary flex-1 py-3.5">
                <ShoppingBag size={18} /> {outOfStock ? 'Out of stock' : 'Add to bag'}
              </motion.button>
              <button
                onClick={() => { toggle(product.id); push(liked ? 'Removed from wishlist' : 'Saved to wishlist'); }}
                aria-label="Wishlist"
                className={cn(
                  'btn flex h-[3.25rem] w-[3.25rem] flex-shrink-0 items-center justify-center rounded-full border transition',
                  liked ? 'border-clay-300 bg-clay-50' : 'border-ink/15 hover:border-ink/40'
                )}
              >
                <Heart size={20} className={liked ? 'fill-clay-500 text-clay-500' : 'text-ink'} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl bg-sand/60 p-4 text-center">
              {[
                { icon: Truck, label: 'Free shipping', sub: 'Over $75' },
                { icon: RefreshCw, label: '30-day returns', sub: 'No fuss' },
                { icon: Leaf, label: 'Organic cotton', sub: 'GOTS certified' },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-1">
                  <b.icon size={20} className="text-clay-500" />
                  <p className="text-xs font-semibold text-ink">{b.label}</p>
                  <p className="text-[11px] text-ink/50">{b.sub}</p>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div className="mt-8">
              <Accordion title="Product details" defaultOpen>
                <ul className="space-y-2">
                  {product.details?.map((d) => (
                    <li key={d} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-clay-400" /> {d}
                    </li>
                  ))}
                </ul>
              </Accordion>
              <Accordion title="Shipping & returns">
                Free standard shipping on orders over $75. Most orders arrive within 3–5 working days.
                Not quite right? Return any unworn item within 30 days for a full refund.
              </Accordion>
              <Accordion title="Care instructions">
                Machine wash cold on a gentle cycle with like colours. Reshape and dry flat to keep the
                fit and feel for years of wear — and the next little one.
              </Accordion>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24">
            <SectionHeading eyebrow="You may also love" title="Complete the look" align="left" />
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Size guide modal */}
      <AnimatePresence>
        {guideOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setGuideOpen(false)}
              className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
              className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-cream p-6 shadow-card sm:p-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl">Size guide</h3>
                <button onClick={() => setGuideOpen(false)} aria-label="Close"><X size={22} className="text-ink/60 hover:text-ink" /></button>
              </div>
              <p className="mt-1 text-sm text-ink/55">Measurements in {product.sizeGuide?.unit || 'cm'}. When between sizes, size up.</p>
              <div className="mt-5 max-h-[55vh] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink/15 text-xs uppercase tracking-wider text-ink/50">
                      <th className="py-2.5 pr-2">Size</th>
                      <th className="py-2.5 pr-2">Age</th>
                      <th className="py-2.5 pr-2">Height</th>
                      <th className="py-2.5">Chest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.sizeGuide?.rows?.map((r) => (
                      <tr key={r.label} className="border-b border-ink/5">
                        <td className="py-2.5 pr-2 font-medium">{r.label}</td>
                        <td className="py-2.5 pr-2 text-ink/70">{r.age}</td>
                        <td className="py-2.5 pr-2 text-ink/70">{r.height}</td>
                        <td className="py-2.5 text-ink/70">{r.chest}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Page>
  );
}
