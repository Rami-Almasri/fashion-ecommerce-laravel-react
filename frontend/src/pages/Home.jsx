import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Quote, Star } from 'lucide-react';
import Page from '../components/Page';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import ProductCard from '../components/ProductCard';
import Newsletter from '../components/Newsletter';
import { useProducts } from '../hooks/useCatalog';
import { CATEGORIES } from '../data/products';

const MARQUEE = [
  'Organic cotton',
  'Made to last',
  'Free shipping over $75',
  'Designed in Lisbon',
  'Ages 0–12',
  '30-day returns',
  'Ethically made',
];

const TESTIMONIALS = [
  {
    name: 'Amira K.',
    text: 'The quality is unreal — washes beautifully and my daughter refuses to take the dress off. Worth every penny.',
    role: 'Mum of two',
  },
  {
    name: 'Sofia R.',
    text: 'Finally clothes that look gorgeous AND survive the playground. The onesies are the softest thing we own.',
    role: 'New parent',
  },
  {
    name: 'James P.',
    text: 'Beautiful packaging, fast delivery, and pieces that actually last through hand-me-downs. A new favourite.',
    role: 'Dad of three',
  },
];

export default function Home() {
  const { products } = useProducts();
  const newArrivals = products.filter((p) => p.badges?.includes('new')).slice(0, 4);
  const bestsellers = products.filter((p) => p.badges?.includes('bestseller')).slice(0, 8);
  const featured = (newArrivals.length ? newArrivals : products).slice(0, 4);

  return (
    <Page>
      {/* ===== HERO ===== */}
      <section className="container-px pt-6 lg:pt-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-sand">
          <div className="grid items-center gap-0 lg:grid-cols-2">
            <div className="relative z-10 px-7 py-14 sm:px-12 lg:py-20 xl:py-28 xl:pl-20">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="label-eyebrow"
              >
                Summer Collection · 2026
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08 }}
                className="mt-4 text-balance text-4xl leading-[1.05] text-ink sm:text-5xl xl:text-6xl"
              >
                A little world of{' '}
                <span className="italic text-clay-600">beautifully made</span> children's fashion
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.16 }}
                className="mt-6 max-w-md text-lg leading-relaxed text-ink/65"
              >
                Timeless pieces in organic fabrics, designed to be played in, loved hard, and handed
                down. For ages 0 to 12.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.24 }}
                className="mt-9 flex flex-wrap items-center gap-4"
              >
                <Link to="/shop" className="btn-primary group">
                  Shop the collection
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/shop/baby" className="btn-secondary">
                  Explore baby
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="mt-10 flex items-center gap-4"
              >
                <div className="flex -space-x-3">
                  {CATEGORIES.slice(0, 3).map((c) => (
                    <img
                      key={c.id}
                      src={c.image}
                      alt=""
                      className="h-10 w-10 rounded-full border-2 border-sand object-cover"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className="fill-mustard text-mustard" />
                    ))}
                  </div>
                  <p className="text-xs text-ink/60">Loved by 12,000+ families</p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-72 sm:h-96 lg:h-full lg:min-h-[34rem]"
            >
              <img
                src="https://images.unsplash.com/photo-1695263747144-a52aa3739d62?auto=format&fit=crop&w=1100&q=80"
                alt="Child in a bluebell jacket blowing bubbles"
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-5 left-5 rounded-2xl bg-cream/90 px-5 py-3 shadow-soft backdrop-blur sm:bottom-7 sm:left-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-clay-500">New in</p>
                <p className="font-serif text-base text-ink">Bluebell Puffer Jacket</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <section className="mt-6 overflow-hidden border-y border-ink/10 py-4">
        <div className="flex w-max animate-marquee gap-10">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="flex items-center gap-10 text-sm font-medium uppercase tracking-[0.2em] text-ink/55">
              {m} <span className="text-clay-400">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="container-px py-20 lg:py-28">
        <SectionHeading
          eyebrow="Shop by age"
          title="Find their perfect fit"
          subtitle="From first onesies to playground-proof essentials — curated edits for every little stage."
        />
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 0.08}>
              <Link to={`/shop/${cat.slug}`} className="group relative block overflow-hidden rounded-3xl">
                <div className="aspect-[3/4] overflow-hidden bg-sand">
                  <img
                    src={cat.image}
                    alt={cat.type}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-cream/75">{cat.blurb}</p>
                  <p className="mt-1 flex items-center gap-1.5 font-serif text-2xl text-cream">
                    {cat.type}
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== FEATURED / NEW ARRIVALS ===== */}
      <section className="container-px py-4 lg:py-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="label-eyebrow mb-2">Just landed</p>
            <h2 className="text-3xl text-ink sm:text-4xl">New arrivals</h2>
          </div>
          <Link to="/shop" className="hidden items-center gap-1.5 text-sm font-medium text-ink/70 hover:text-ink sm:flex link-underline">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* ===== EDITORIAL SPLIT ===== */}
      <section className="container-px py-20 lg:py-28">
        <div className="grid items-stretch gap-4 overflow-hidden rounded-[2.5rem] lg:grid-cols-2 lg:gap-0">
          <Reveal className="flex flex-col justify-center bg-clay-50 px-8 py-14 sm:px-14 lg:py-20">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-600">
              <Leaf size={22} />
            </span>
            <h2 className="mt-6 text-3xl leading-tight text-ink sm:text-4xl">
              Kinder on skin, kinder on the planet
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink/65">
              Every piece is cut from GOTS-certified organic cotton and low-impact dyes. No nasties,
              no shortcuts — just soft, durable clothes designed to be passed down, not thrown away.
            </p>
            <Link to="/about" className="btn-secondary mt-8 self-start">
              Our promise <ArrowRight size={16} />
            </Link>
          </Reveal>
          <Reveal delay={0.1} className="relative min-h-[20rem]">
            <img
              src="https://images.unsplash.com/photo-1608093602519-ccd31f515f83?auto=format&fit=crop&w=1100&q=80"
              alt="Baby in a soft knit cardigan"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* ===== BESTSELLERS ===== */}
      {bestsellers.length > 0 && (
        <section className="container-px pb-4">
          <SectionHeading
            eyebrow="Tried & loved"
            title="This season's bestsellers"
            subtitle="The pieces families keep coming back for — and buying in every colour."
          />
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {bestsellers.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/shop" className="btn-primary">
              Shop all products <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      )}

      {/* ===== TESTIMONIALS ===== */}
      <section className="container-px py-20 lg:py-28">
        <SectionHeading eyebrow="From our families" title="Little reviews, big love" />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <figure className="flex h-full flex-col rounded-3xl bg-white/70 p-8 shadow-soft">
                <Quote size={28} className="text-clay-300" />
                <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-ink/80">"{t.text}"</blockquote>
                <figcaption className="mt-6 border-t border-ink/10 pt-5">
                  <p className="font-serif text-lg text-ink">{t.name}</p>
                  <p className="text-sm text-ink/50">{t.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <Newsletter />
    </Page>
  );
}
