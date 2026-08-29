import { useEffect, useState } from 'react';
import {
  ArrowRight, Truck, ShieldCheck, RefreshCw, Headphones, Sparkles,
} from 'lucide-react';
import { Link } from '@/components/Link';
import { useStore } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/Skeletons';
import { SectionHeader } from '@/components/SectionHeader';
import { PRODUCTS } from '@/lib/products';
import { CATEGORIES, COUPONS } from '@/lib/siteData';
import { formatPKR, effectivePrice } from '@/lib/format';
import type { Product } from '@/types';

function useFakeLoad(ms = 600) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return loading;
}

function Hero() {
  const hero = PRODUCTS.find((p) => p.id === 'p001')!;
  const hero2 = PRODUCTS.find((p) => p.id === 'p022')!;
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      {/* Background gradient + grain */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-950 to-black" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(212,175,55,0.18), transparent 45%), radial-gradient(circle at 80% 70%, rgba(212,175,55,0.10), transparent 50%)',
        }}
      />
      <div className="relative mx-auto grid max-w-8xl items-center gap-8 px-4 py-14 lg:grid-cols-2 lg:gap-4 lg:px-8 lg:py-20">
        <div className="animate-fadeUp">
          <span className="chip bg-white/10 text-gold-400 ring-1 ring-white/15">
            <Sparkles size={13} /> New Season Collection
          </span>
          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Step Into<br />
            <span className="text-gold-400">Your Style</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink-300">
            Premium footwear crafted for Pakistan. From boardroom Oxfords to street-ready sneakers — find your perfect pair.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="btn btn-gold px-7 py-3.5">
              Shop Collection <ArrowRight size={18} />
            </Link>
            <Link to="/sneakers" className="btn border border-white/20 px-7 py-3.5 text-white hover:bg-white/10">
              Explore Sneakers
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-8">
            {[
              { n: '56+', l: 'Premium Styles' },
              { n: '12K+', l: 'Happy Customers' },
              { n: '4.8★', l: 'Average Rating' },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display text-2xl font-bold text-white">{s.n}</p>
                <p className="text-xs text-ink-400">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Hero image collage */}
        <div className="relative hidden lg:block animate-scaleIn">
          <div className="relative mx-auto max-w-md">
            <div className="absolute -left-8 top-10 z-10 w-44 rotate-[-6deg] overflow-hidden rounded-2xl ring-4 ring-white/10 shadow-2xl transition-transform duration-500 hover:rotate-0">
              <img src={hero2.image} alt={hero2.name} className="aspect-square object-cover" />
            </div>
            <div className="overflow-hidden rounded-[2rem] ring-4 ring-white/10 shadow-2xl">
              <img src={hero.image} alt={hero.name} className="aspect-[4/5] w-full object-cover" />
            </div>
            <div className="absolute -right-6 bottom-8 z-10 w-40 rotate-[5deg] overflow-hidden rounded-2xl ring-4 ring-white/10 shadow-2xl transition-transform duration-500 hover:rotate-0">
              <img src={PRODUCTS[7].image} alt={PRODUCTS[7].name} className="aspect-square object-cover" />
            </div>
            {/* Floating price tag */}
            <div className="absolute -left-4 bottom-0 z-20 rounded-2xl bg-white px-4 py-3 text-ink-950 shadow-xl animate-fadeUp">
              <p className="text-[10px] uppercase tracking-wider text-ink-500">From</p>
              <p className="font-display text-xl font-bold">{formatPKR(4200)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryGrid() {
  const images: Record<string, string> = {
    men: PRODUCTS.find((p) => p.gender === 'men')!.image,
    women: PRODUCTS.find((p) => p.gender === 'women')!.image,
    kids: PRODUCTS.find((p) => p.gender === 'kids')!.image,
    sneakers: PRODUCTS.find((p) => p.category === 'sneakers')!.image,
    formal: PRODUCTS.find((p) => p.category === 'formal')!.image,
    sports: PRODUCTS.find((p) => p.category === 'sports')!.image,
  };
  return (
    <section className="mx-auto max-w-8xl px-4 py-16 lg:px-8">
      <SectionHeader
        eyebrow="Browse"
        title="Shop by Category"
        subtitle="Find exactly what you're looking for across our curated collections."
        link={{ label: 'View all', to: '/shop' }}
      />
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((c, i) => (
          <Link
            key={c.id}
            to={c.to}
            className="group relative aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-ink-200 animate-fadeUp"
          >
            <img
              src={images[c.id]}
              alt={c.label}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              style={{ animationDelay: `${i * 60}ms` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="font-display text-lg font-bold text-white">{c.label}</h3>
              <p className="hidden text-xs text-ink-200 sm:block">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const loading = useFakeLoad();
  const featured = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8);
  return (
    <section className="mx-auto max-w-8xl px-4 py-16 lg:px-8">
      <SectionHeader
        eyebrow="Bestsellers"
        title="Most Loved Pairs"
        subtitle="The shoes our customers can't stop wearing."
        link={{ label: 'Shop all', to: '/shop' }}
      />
      <div className="mt-10">
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PromoBanner() {
  return (
    <section className="mx-auto max-w-8xl px-4 py-8 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gold-400 to-gold-300 px-6 py-12 lg:px-16 lg:py-16">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute -bottom-12 -left-8 h-56 w-56 rounded-full bg-ink-950/10 blur-2xl" />
        <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-ink-900/70">Limited time offer</p>
            <h3 className="mt-2 font-display text-3xl font-bold text-ink-950 sm:text-4xl">
              Save up to 40% on Formal Collection
            </h3>
            <p className="mt-2 max-w-lg text-ink-900/80">
              Plus use code <strong className="rounded bg-ink-950 px-2 py-0.5 text-gold-400">VERONA10</strong> for an extra 10% off at checkout.
            </p>
          </div>
          <Link to="/formal" className="btn bg-ink-950 px-8 py-4 text-white hover:bg-ink-800">
            Shop Formal <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function NewArrivals() {
  const loading = useFakeLoad(700);
  const fresh = PRODUCTS.filter((p) => p.isNew).slice(0, 4);
  return (
    <section className="mx-auto max-w-8xl px-4 py-16 lg:px-8">
      <SectionHeader
        eyebrow="Just Dropped"
        title="New Arrivals"
        subtitle="The latest additions to the VÉRONA family."
        link={{ label: 'See more', to: '/shop' }}
      />
      <div className="mt-10">
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {fresh.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ValueProps() {
  const items = [
    { icon: Truck, title: 'Free Delivery', desc: 'On orders over ₨5,000 across Pakistan' },
    { icon: ShieldCheck, title: 'Secure Payments', desc: 'COD, Easypaisa, JazzCash & cards' },
    { icon: RefreshCw, title: '7-Day Returns', desc: 'Hassle-free exchange policy' },
    { icon: Headphones, title: 'Dedicated Support', desc: 'We are here 7 days a week' },
  ];
  return (
    <section className="border-y border-ink-200 bg-ink-50">
      <div className="mx-auto grid max-w-8xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {items.map((it) => (
          <div key={it.title} className="flex items-start gap-4 rounded-2xl bg-white p-5 ring-1 ring-ink-200/70">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-ink-950 text-gold-400">
              <it.icon size={22} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink-950">{it.title}</h3>
              <p className="mt-1 text-xs text-ink-600">{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    { name: 'Ayesha Khan', city: 'Lahore', text: 'The quality is exceptional. My heels lasted an entire wedding season without a scratch. VÉRONA is now my go-to.', product: 'Stiletto Pointed Heel' },
    { name: 'Bilal Ahmed', city: 'Karachi', text: 'Ordered the Oxford Brogues for my nikah. The craftsmanship is on par with international brands at half the price.', product: 'Oxford Brogue Classic' },
    { name: 'Mariam Saleem', city: 'Islamabad', text: 'Fast delivery and beautiful packaging. The block heel sandals are the most comfortable I have ever owned.', product: 'Block Heel Sandal' },
  ];
  return (
    <section className="mx-auto max-w-8xl px-4 py-16 lg:px-8">
      <SectionHeader eyebrow="Customer Love" title="What Our Customers Say" center />
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <figure
            key={i}
            className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 animate-fadeUp"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex text-gold-400">
              {Array.from({ length: 5 }).map((_, s) => (
                <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-700">"{r.text}"</blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-ink-100 pt-4">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-ink-950 font-display text-sm font-bold text-gold-400">
                {r.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-950">{r.name}</p>
                <p className="text-xs text-ink-500">{r.city} · Verified Buyer</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function CouponStrip() {
  return (
    <section className="mx-auto max-w-8xl px-4 pb-4 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {COUPONS.map((c) => (
          <div key={c.code} className="flex items-center justify-between rounded-2xl border-2 border-dashed border-gold-400 bg-gold-50 px-5 py-4">
            <div>
              <p className="font-display text-xl font-bold text-ink-950">{c.code}</p>
              <p className="text-sm text-ink-600">{c.label} {c.minOrder && `(min ₨${c.minOrder.toLocaleString('en-PK')})`}</p>
            </div>
            <Link to="/shop" className="btn btn-outline border-gold-400 text-gold-700 hover:bg-gold-400 hover:text-ink-950">
              Shop now
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoBanner />
      <NewArrivals />
      <CouponStrip />
      <Testimonials />
    </>
  );
}
