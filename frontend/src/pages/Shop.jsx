import { useMemo, useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SlidersHorizontal, X, Check, ChevronDown } from 'lucide-react';
import Page from '../components/Page';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useCatalog';
import { PRODUCT_TYPES, CATEGORIES } from '../data/products';
import { cn, titleCase } from '../lib/utils';

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top rated' },
];

const SEASON_OPTS = ['summer', 'winter'];

const COLOR_SWATCH = {
  Ecru: '#EFE7DA', Clay: '#B86E48', Sage: '#8AA26F', Sky: '#A9C4D4',
  Blush: '#E7B7AE', Navy: '#2E3A4B', Mustard: '#D8A24A', Charcoal: '#33312E',
  Ivory: '#F7F2E9', Rust: '#A65A3A',
};

function FilterGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ink/10 py-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-sm font-semibold uppercase tracking-wider text-ink"
      >
        {title}
        <ChevronDown size={16} className={cn('transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Shop() {
  const { category } = useParams();
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [activeCategory, setActiveCategory] = useState(category || 'all');
  const [types, setTypes] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [colors, setColors] = useState([]);
  const [maxPrice, setMaxPrice] = useState(120);
  const [sort, setSort] = useState('featured');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setActiveCategory(category || 'all');
  }, [category]);

  const availableColors = useMemo(() => {
    const set = new Set();
    products.forEach((p) => p.colors?.forEach((c) => set.add(c.name)));
    return [...set];
  }, [products]);

  const toggle = (setter, value) =>
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category?.toLowerCase() === activeCategory.toLowerCase());
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (types.length) list = list.filter((p) => types.includes(p.type));
    if (seasons.length) list = list.filter((p) => seasons.includes(p.season));
    if (colors.length) list = list.filter((p) => p.colors?.some((c) => colors.includes(c.name)));
    list = list.filter((p) => p.price <= maxPrice);

    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case 'newest':
        list.sort((a, b) => (b.badges?.includes('new') ? 1 : 0) - (a.badges?.includes('new') ? 1 : 0));
        break;
      default: break;
    }
    return list;
  }, [products, activeCategory, query, types, seasons, colors, maxPrice, sort]);

  const activeFilterCount = types.length + seasons.length + colors.length + (maxPrice < 120 ? 1 : 0);

  const clearAll = () => {
    setTypes([]); setSeasons([]); setColors([]); setMaxPrice(120);
    if (query) setSearchParams({});
  };

  const heading =
    activeCategory !== 'all'
      ? CATEGORIES.find((c) => c.slug === activeCategory)?.type || titleCase(activeCategory)
      : query
      ? `Results for "${query}"`
      : 'Shop all';

  const FilterPanel = (
    <>
      <FilterGroup title="Category">
        <div className="flex flex-col gap-2.5">
          {['all', ...CATEGORIES.map((c) => c.slug)].map((slug) => {
            const label = slug === 'all' ? 'All products' : CATEGORIES.find((c) => c.slug === slug)?.type;
            const active = activeCategory === slug;
            return (
              <button
                key={slug}
                onClick={() => setActiveCategory(slug)}
                className={cn(
                  'flex items-center gap-2 text-left text-sm transition',
                  active ? 'font-semibold text-clay-600' : 'text-ink/70 hover:text-ink'
                )}
              >
                <span className={cn('h-1.5 w-1.5 rounded-full', active ? 'bg-clay-500' : 'bg-ink/20')} />
                {label}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Type">
        <div className="flex flex-wrap gap-2">
          {PRODUCT_TYPES.map((t) => {
            const active = types.includes(t);
            return (
              <button
                key={t}
                onClick={() => toggle(setTypes, t)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition',
                  active
                    ? 'border-ink bg-ink text-cream'
                    : 'border-ink/15 text-ink/70 hover:border-ink/40'
                )}
              >
                {t}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Season">
        <div className="flex gap-2">
          {SEASON_OPTS.map((s) => {
            const active = seasons.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggle(setSeasons, s)}
                className={cn(
                  'flex-1 rounded-full border px-3 py-2 text-xs font-medium capitalize transition',
                  active ? 'border-sage-500 bg-sage-500 text-cream' : 'border-ink/15 text-ink/70 hover:border-ink/40'
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Colour">
        <div className="flex flex-wrap gap-2.5">
          {availableColors.map((name) => {
            const active = colors.includes(name);
            return (
              <button
                key={name}
                onClick={() => toggle(setColors, name)}
                title={name}
                aria-label={name}
                className={cn(
                  'relative flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-ink/10 transition',
                  active && 'ring-2 ring-ink ring-offset-2 ring-offset-cream'
                )}
                style={{ backgroundColor: COLOR_SWATCH[name] || '#ccc' }}
              >
                {active && (
                  <Check size={14} className={name === 'Charcoal' || name === 'Navy' ? 'text-cream' : 'text-ink'} />
                )}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title={`Max price · $${maxPrice}`}>
        <input
          type="range"
          min="20"
          max="120"
          step="2"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-clay-500"
        />
        <div className="mt-1 flex justify-between text-xs text-ink/50">
          <span>$20</span>
          <span>$120+</span>
        </div>
      </FilterGroup>
    </>
  );

  return (
    <Page>
      {/* Header banner */}
      <div className="bg-sand">
        <div className="container-px py-12 lg:py-16">
          <nav className="mb-3 text-xs text-ink/50">
            <Link to="/" className="hover:text-ink">Home</Link> / <span className="text-ink/80">{heading}</span>
          </nav>
          <h1 className="text-4xl text-ink lg:text-5xl">{heading}</h1>
          <p className="mt-3 max-w-xl text-ink/60">
            {activeCategory !== 'all'
              ? CATEGORIES.find((c) => c.slug === activeCategory)?.blurb && `Made for ${CATEGORIES.find((c) => c.slug === activeCategory)?.blurb}. `
              : ''}
            Thoughtfully designed pieces in organic fabrics, built for real childhoods.
          </p>
        </div>
      </div>

      <div className="container-px py-10">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 border-b border-ink/10 pb-5">
          <p className="text-sm text-ink/60">
            <span className="font-semibold text-ink">{filtered.length}</span> {filtered.length === 1 ? 'piece' : 'pieces'}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-medium lg:hidden"
            >
              <SlidersHorizontal size={15} /> Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] text-cream">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="cursor-pointer appearance-none rounded-full border border-ink/15 bg-cream py-2 pl-4 pr-9 text-sm font-medium outline-none focus:border-ink/40"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/50" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 pt-8 lg:grid-cols-[260px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl">Filters</h2>
                {activeFilterCount > 0 && (
                  <button onClick={clearAll} className="text-xs text-clay-600 underline-offset-2 hover:underline">
                    Clear all
                  </button>
                )}
              </div>
              <div className="mt-2">{FilterPanel}</div>
            </div>
          </aside>

          {/* Grid */}
          <div>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl bg-sand py-24 text-center">
                <p className="font-serif text-2xl">Nothing matches just yet</p>
                <p className="mt-2 max-w-sm text-ink/55">Try removing a filter or two — there's a whole little world to explore.</p>
                <button onClick={clearAll} className="btn-primary mt-6">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 xl:gap-x-6">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-ink/45 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-cream p-6 lg:hidden"
            >
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-serif text-2xl">Filters</h2>
                <button onClick={() => setDrawerOpen(false)} aria-label="Close"><X size={24} /></button>
              </div>
              {FilterPanel}
              <div className="sticky bottom-0 mt-4 flex gap-3 bg-cream pt-4">
                <button onClick={clearAll} className="btn-secondary flex-1">Clear</button>
                <button onClick={() => setDrawerOpen(false)} className="btn-primary flex-1">
                  Show {filtered.length}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Page>
  );
}
