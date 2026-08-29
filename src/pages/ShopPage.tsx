import { useMemo, useState, useEffect } from 'react';
import { SlidersHorizontal, X, Check, ChevronDown } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/Skeletons';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHeader } from '@/components/SectionHeader';
import { PRODUCTS } from '@/lib/products';
import { classNames, effectivePrice, formatPKR } from '@/lib/format';
import type { Product, Gender, Category } from '@/types';

type SortKey = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'discount';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-low', label: 'Price: Low to High' },
  { key: 'price-high', label: 'Price: High to Low' },
  { key: 'rating', label: 'Top Rated' },
  { key: 'newest', label: 'Newest' },
  { key: 'discount', label: 'Biggest Discount' },
];

const ALL_SIZES = Array.from(new Set(PRODUCTS.flatMap((p) => p.sizes))).sort((a, b) => a - b);
const ALL_COLORS = Array.from(
  new Map(PRODUCTS.flatMap((p) => p.colors).map((c) => [c.name, c])).values(),
);
const PRICE_BUCKETS = [
  { id: 'under5', label: 'Under ₨5,000', min: 0, max: 5000 },
  { id: '5to10', label: '₨5,000 — ₨10,000', min: 5000, max: 10000 },
  { id: '10to15', label: '₨10,000 — ₨15,000', min: 10000, max: 15000 },
  { id: 'over15', label: '₨15,000 & above', min: 15000, max: Infinity },
];

export interface ShopPageProps {
  scope?: 'all' | 'gender' | 'category';
  scopeValue?: string;
  title: string;
  subtitle?: string;
  image?: string;
}

export function ShopPage({ scope = 'all', scopeValue, title, subtitle, image }: ShopPageProps) {
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>('featured');
  const [search, setSearch] = useState('');
  const [sizes, setSizes] = useState<number[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [priceBuckets, setPriceBuckets] = useState<string[]>([]);
  const [onlySale, setOnlySale] = useState(false);
  const [onlyNew, setOnlyNew] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    setLoading(true);
    setVisibleCount(12);
    const t = window.setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [scope, scopeValue, title]);

  const scopeFiltered = useMemo(() => {
    let list = PRODUCTS;
    if (scope === 'gender') list = list.filter((p) => p.gender === (scopeValue as Gender));
    if (scope === 'category') list = list.filter((p) => p.category === (scopeValue as Category));
    return list;
  }, [scope, scopeValue]);

  const filtered = useMemo(() => {
    let list = scopeFiltered;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        (p.name + p.brand + p.category + p.gender + p.tags.join(' ')).toLowerCase().includes(q),
      );
    }
    if (sizes.length) list = list.filter((p) => p.sizes.some((s) => sizes.includes(s)));
    if (colors.length) list = list.filter((p) => p.colors.some((c) => colors.includes(c.name)));
    if (priceBuckets.length) {
      list = list.filter((p) => {
        const price = effectivePrice(p);
        return priceBuckets.some((b) => {
          const bucket = PRICE_BUCKETS.find((pb) => pb.id === b)!;
          return price >= bucket.min && price < bucket.max;
        });
      });
    }
    if (onlySale) list = list.filter((p) => p.salePrice && p.salePrice < p.price);
    if (onlyNew) list = list.filter((p) => p.isNew);
    if (minRating > 0) list = list.filter((p) => p.rating >= minRating);

    switch (sort) {
      case 'price-low': list = [...list].sort((a, b) => effectivePrice(a) - effectivePrice(b)); break;
      case 'price-high': list = [...list].sort((a, b) => effectivePrice(b) - effectivePrice(a)); break;
      case 'rating': list = [...list].sort((a, b) => b.rating - a.rating); break;
      case 'newest': list = [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew)); break;
      case 'discount':
        list = [...list].sort(
          (a, b) => ((b.price - (b.salePrice ?? b.price)) / b.price) - ((a.price - (a.salePrice ?? a.price)) / a.price),
        );
        break;
      default:
        list = [...list].sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
    }
    return list;
  }, [scopeFiltered, search, sizes, colors, priceBuckets, onlySale, onlyNew, minRating, sort]);

  const visible = filtered.slice(0, visibleCount);
  const activeFilterCount =
    sizes.length + colors.length + priceBuckets.length + (onlySale ? 1 : 0) + (onlyNew ? 1 : 0) + (minRating > 0 ? 1 : 0);

  const toggleSize = (s: number) => setSizes((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);
  const toggleColor = (c: string) => setColors((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c]);
  const toggleBucket = (b: string) => setPriceBuckets((p) => p.includes(b) ? p.filter((x) => x !== b) : [...p, b]);
  const clearAll = () => { setSizes([]); setColors([]); setPriceBuckets([]); setOnlySale(false); setOnlyNew(false); setMinRating(0); setSearch(''); };

  const crumbs = [{ label: 'Home', to: '/' }, { label: title }];

  const FilterPanel = () => (
    <div className="space-y-7">
      {/* Price */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-ink-900">Price Range</h4>
        <div className="space-y-2">
          {PRICE_BUCKETS.map((b) => (
            <label key={b.id} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700">
              <button
                onClick={() => toggleBucket(b.id)}
                className={classNames(
                  'grid h-5 w-5 place-items-center rounded border transition',
                  priceBuckets.includes(b.id) ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-300 bg-white',
                )}
              >
                {priceBuckets.includes(b.id) && <Check size={13} />}
              </button>
              {b.label}
            </label>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-ink-900">Shoe Size</h4>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleSize(s)}
              className={classNames(
                'h-9 min-w-9 rounded-lg border px-2 text-xs font-medium transition',
                sizes.includes(s) ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-300 text-ink-700 hover:border-ink-500',
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-ink-900">Color</h4>
        <div className="space-y-2">
          {ALL_COLORS.map((c) => (
            <label key={c.name} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700">
              <button
                onClick={() => toggleColor(c.name)}
                className={classNames(
                  'grid h-5 w-5 place-items-center rounded-full border-2 transition',
                  colors.includes(c.name) ? 'border-ink-900' : 'border-ink-200',
                )}
              >
                {colors.includes(c.name) && <Check size={11} className="text-ink-900" />}
                <span className="sr-only">{c.name}</span>
              </button>
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full ring-1 ring-ink-300" style={{ backgroundColor: c.hex }} />
                {c.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-ink-900">Minimum Rating</h4>
        <div className="space-y-2">
          {[4.5, 4, 3.5].map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700">
              <button
                onClick={() => setMinRating(minRating === r ? 0 : r)}
                className={classNames(
                  'grid h-5 w-5 place-items-center rounded border transition',
                  minRating === r ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-300 bg-white',
                )}
              >
                {minRating === r && <Check size={13} />}
              </button>
              {r}★ & above
            </label>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-2 border-t border-ink-200 pt-4">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700">
          <button
            onClick={() => setOnlySale((v) => !v)}
            className={classNames(
              'grid h-5 w-5 place-items-center rounded border transition',
              onlySale ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-300 bg-white',
            )}
          >
            {onlySale && <Check size={13} />}
          </button>
          On Sale only
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700">
          <button
            onClick={() => setOnlyNew((v) => !v)}
            className={classNames(
              'grid h-5 w-5 place-items-center rounded border transition',
              onlyNew ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-300 bg-white',
            )}
          >
            {onlyNew && <Check size={13} />}
          </button>
          New Arrivals only
        </label>
      </div>

      {activeFilterCount > 0 && (
        <button onClick={clearAll} className="w-full rounded-full border border-ink-300 py-2.5 text-sm font-medium text-ink-700 transition hover:border-ink-900 hover:text-ink-900">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle}>
        {image && (
          <div className="relative mb-6 h-48 overflow-hidden rounded-3xl sm:h-64">
            <img src={image} alt={title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
          </div>
        )}
        <div className="mb-4"><Breadcrumbs items={crumbs} /></div>
      </PageHeader>

      <div className="mx-auto max-w-8xl px-4 py-8 lg:px-8">
        {/* Search + sort bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search in ${title}…`}
              className="input max-w-xs"
            />
            <span className="hidden text-sm text-ink-500 sm:inline">{filtered.length} products</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 rounded-full border border-ink-300 px-4 py-2.5 text-sm font-medium text-ink-700 lg:hidden"
            >
              <SlidersHorizontal size={16} /> Filters
              {activeFilterCount > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-ink-900 text-xs text-white">{activeFilterCount}</span>}
            </button>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="appearance-none rounded-full border border-ink-300 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-ink-700 focus:border-ink-900 focus:outline-none"
              >
                {SORTS.map((s) => (<option key={s.key} value={s.key}>{s.label}</option>))}
              </select>
              <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-500" />
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Desktop filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-[calc(var(--header-h)+90px)]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-ink-950">Filters</h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearAll} className="text-xs font-medium text-gold-700 hover:underline">Clear all</button>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Products */}
          <div>
            {loading ? (
              <ProductGridSkeleton count={8} />
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl bg-ink-50 py-20 text-center">
                <p className="font-display text-2xl font-bold text-ink-900">No shoes found</p>
                <p className="mt-2 text-ink-600">Try adjusting your filters or search.</p>
                {activeFilterCount > 0 && (
                  <button onClick={clearAll} className="btn btn-primary mt-6">Clear filters</button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                  {visible.map((p, i) => (<ProductCard key={p.id} product={p} index={i} />))}
                </div>
                {visibleCount < filtered.length && (
                  <div className="mt-10 text-center">
                    <button onClick={() => setVisibleCount((c) => c + 8)} className="btn btn-outline px-8 py-3.5">
                      Load more ({filtered.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-white p-5 animate-slideInRight">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-ink-950">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-ink-100">
                <X size={20} />
              </button>
            </div>
            <FilterPanel />
            <button onClick={() => setShowFilters(false)} className="btn btn-primary mt-6 w-full">
              Show {filtered.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
