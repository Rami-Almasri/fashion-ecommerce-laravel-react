import { Link } from 'react-router-dom';
import { Leaf, Heart, Recycle, Sparkles, ArrowRight } from 'lucide-react';
import Page from '../components/Page';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import Newsletter from '../components/Newsletter';

const VALUES = [
  { icon: Leaf, title: 'Organic by default', text: 'GOTS-certified cotton and low-impact dyes in every single piece — no exceptions, no greenwashing.' },
  { icon: Heart, title: 'Made to be loved', text: 'Durable construction and timeless cuts designed to be worn hard, washed often, and handed down.' },
  { icon: Recycle, title: 'Circular minded', text: 'Take-back program, recyclable packaging, and a repair service to keep clothes out of landfill.' },
  { icon: Sparkles, title: 'Tested by tinies', text: 'Every fabric is wear-tested by real families before it ever reaches your little one.' },
];

const STATS = [
  { value: '12k+', label: 'Happy families' },
  { value: '100%', label: 'Organic cotton' },
  { value: '0–12', label: 'Years, every stage' },
  { value: '4.9★', label: 'Average rating' },
];

export default function About() {
  return (
    <Page>
      {/* Hero */}
      <section className="container-px pt-10">
        <div className="relative overflow-hidden rounded-[2.5rem]">
          <img
            src="https://images.unsplash.com/photo-1604303768345-038b79a8c47a?auto=format&fit=crop&w=1600&q=80"
            alt="Children playing together"
            className="h-[42vh] w-full object-cover lg:h-[56vh]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-cream sm:p-14">
            <p className="label-eyebrow text-clay-200">Our story</p>
            <h1 className="mt-3 max-w-2xl text-balance text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl">
              Little clothes, made with a big heart
            </h1>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="container-px py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 className="text-3xl leading-tight text-ink sm:text-4xl">It started with one tiny jumper.</h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-5 text-lg leading-relaxed text-ink/70">
            <p>
              Petit Monde began in a sunlit Lisbon studio, when two new parents couldn't find clothes
              that were soft enough for newborn skin, sturdy enough for toddlers, and beautiful enough
              to photograph. So they made their own.
            </p>
            <p>
              Today we design every piece in-house, partner with family-run mills, and obsess over the
              details — flat seams, fold-over cuffs, buttons little hands can manage. Because childhood
              is short, and the clothes should be the least of anyone's worries.
            </p>
          </Reveal>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-6 rounded-[2rem] bg-sand p-10 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <p className="font-serif text-4xl text-clay-600 lg:text-5xl">{s.value}</p>
              <p className="mt-1 text-sm text-ink/55">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="container-px pb-8">
        <SectionHeading eyebrow="What we stand for" title="Our promise to you & the planet" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08}>
              <div className="flex h-full gap-5 rounded-3xl bg-white/70 p-7 shadow-soft">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-600">
                  <v.icon size={22} />
                </span>
                <div>
                  <h3 className="font-serif text-xl">{v.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink/65">{v.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <Link to="/shop" className="btn-primary">Shop the collection <ArrowRight size={17} /></Link>
        </Reveal>
      </section>

      <Newsletter />
    </Page>
  );
}
