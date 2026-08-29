import {
  Award, Heart, Leaf, Users, ArrowRight, Target, Eye,
} from 'lucide-react';
import { Link } from '@/components/Link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHeader } from '@/components/SectionHeader';
import { PRODUCTS } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';

const VALUES = [
  { icon: Award, title: 'Craftsmanship', desc: 'Every pair is hand-finished by skilled artisans in our Lahore atelier, using techniques refined over generations.' },
  { icon: Heart, title: 'Customer First', desc: 'From sizing help to hassle-free returns, we treat every customer the way we would want to be treated.' },
  { icon: Leaf, title: 'Responsible Sourcing', desc: 'We work with tanneries and suppliers who meet strict environmental and ethical standards.' },
  { icon: Users, title: 'Made in Pakistan', desc: 'Proudly designed and manufactured locally, creating jobs and supporting the Pakistani footwear industry.' },
];

const STATS = [
  { n: '12,000+', l: 'Happy Customers' },
  { n: '56+', l: 'Premium Styles' },
  { n: '24', l: 'Cities Served' },
  { n: '4.8★', l: 'Average Rating' },
];

export function AboutPage() {
  const featured = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <div>
      <PageHeader title="Our Story" subtitle="Crafted in Pakistan, worn with pride across the nation.">
        <div className="mb-4"><Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About' }]} /></div>
      </PageHeader>

      {/* Hero story */}
      <section className="mx-auto max-w-8xl px-4 py-14 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="animate-fadeUp">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">Since 2018</p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
              Step Into Your Style
            </h2>
            <div className="mt-5 space-y-4 text-ink-700 leading-relaxed">
              <p>
                VÉRONA Footwear was born from a simple belief: that Pakistanis deserve world-class shoes without paying world-class prices. What started as a small workshop in Liberty Market, Lahore has grown into a beloved brand serving customers across 24 cities.
              </p>
              <p>
                We blend timeless design with modern comfort. From hand-burnished Oxfords for the boardroom to breathable knit sneakers for the street, every pair is designed in-house and crafted with materials we would be proud to wear ourselves.
              </p>
              <p>
                Our name — VÉRONA — is inspired by the Italian city of art and romance. It reflects our commitment to beauty, craftsmanship, and the idea that a great pair of shoes can change how you carry yourself through the day.
              </p>
            </div>
            <Link to="/shop" className="btn btn-primary mt-7 px-7 py-3.5">Explore Our Collection <ArrowRight size={18} /></Link>
          </div>
          <div className="relative animate-scaleIn">
            <div className="overflow-hidden rounded-[2rem] shadow-xl ring-1 ring-ink-200">
              <img
                src="https://images.pexels.com/photos/33812005/pexels-photo-33812005.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="VÉRONA atelier"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-5 shadow-xl ring-1 ring-ink-200 sm:block">
              <p className="font-display text-3xl font-bold text-ink-950">7+</p>
              <p className="text-xs text-ink-600">Years of craftsmanship</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ink-950 text-white">
        <div className="mx-auto grid max-w-8xl grid-cols-2 gap-6 px-4 py-12 lg:grid-cols-4 lg:px-8">
          {STATS.map((s) => (
            <div key={s.l} className="text-center">
              <p className="font-display text-4xl font-bold text-gold-400 sm:text-5xl">{s.n}</p>
              <p className="mt-2 text-sm text-ink-300">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="mx-auto max-w-8xl px-4 py-16 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-ink-50 p-8">
            <Target size={32} className="text-gold-600" />
            <h3 className="mt-4 font-display text-2xl font-bold text-ink-950">Our Mission</h3>
            <p className="mt-3 text-ink-700 leading-relaxed">
              To make premium, beautifully crafted footwear accessible to every Pakistani — delivering comfort, style, and confidence in every step, at a fair price.
            </p>
          </div>
          <div className="rounded-3xl bg-ink-50 p-8">
            <Eye size={32} className="text-gold-600" />
            <h3 className="mt-4 font-display text-2xl font-bold text-ink-950">Our Vision</h3>
            <p className="mt-3 text-ink-700 leading-relaxed">
              To become Pakistan's most loved footwear brand — known for quality, integrity, and innovation — while championing local craftsmanship on a national stage.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-8xl px-4 py-16 lg:px-8">
        <div className="text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">What we stand for</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">Our Values</h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <div
              key={v.title}
              className="rounded-2xl bg-white p-6 ring-1 ring-ink-200/70 transition hover:shadow-lg animate-fadeUp"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-ink-950 text-gold-400">
                <v.icon size={22} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ink-950">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-8xl px-4 pb-16 lg:px-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold text-ink-950 sm:text-3xl">Bestsellers from our atelier</h2>
          <Link to="/shop" className="link-underline text-sm font-semibold text-ink-900">View all →</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>
    </div>
  );
}
