import { useEffect, useState } from 'react';
import {
  Search, ShoppingBag, Heart, Menu, X, User, ChevronDown, Truck,
} from 'lucide-react';
import { Link } from '@/components/Link';
import { useStore as useShopStore } from '@/lib/store';
import { NAV_LINKS, BRAND } from '@/lib/siteData';
import { classNames } from '@/lib/format';
import { PRODUCTS } from '@/lib/products';
import { effectivePrice } from '@/lib/format';

function useScrollTop() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return scrolled;
}

export function Navbar() {
  const store = useShopStore();
  const { route } = store;
  const scrolled = useScrollTop();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [route]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const results = query.trim().length > 0
    ? PRODUCTS.filter((p) =>
        (p.name + ' ' + p.brand + ' ' + p.category + ' ' + p.gender + ' ' + p.tags.join(' '))
          .toLowerCase()
          .includes(query.toLowerCase()),
      ).slice(0, 6)
    : [];

  const isActive = (to: string) => (to === '/' ? route === '/' : route.startsWith(to));

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-ink-950 text-white text-xs">
        <div className="mx-auto flex max-w-8xl items-center justify-center gap-2 px-4 py-2 text-center">
          <Truck size={14} className="text-gold-400" />
          <span>Free delivery on orders over ₨5,000 — Use code <strong className="text-gold-400">VERONA10</strong> for 10% off</span>
        </div>
      </div>

      <header
        className={classNames(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white',
        )}
      >
        <div className="mx-auto flex max-w-8xl items-center justify-between gap-4 px-4 py-3 lg:px-8" style={{ height: 'var(--header-h)' }}>
          {/* Mobile menu button */}
          <button
            className="lg:hidden text-ink-900 p-1.5 -ml-1.5"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink-950 text-gold-400 font-display font-bold text-lg">V</span>
            <span className="font-display text-xl font-bold tracking-tight text-ink-950">VÉRONA</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={classNames(
                  'relative px-3.5 py-2 text-sm font-medium transition-colors rounded-full',
                  isActive(l.to) ? 'text-ink-950' : 'text-ink-600 hover:text-ink-950',
                )}
              >
                {l.label}
                {isActive(l.to) && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gold-400" />}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full text-ink-700 transition hover:bg-ink-100"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link
              to="/wishlist"
              className="relative grid h-10 w-10 place-items-center rounded-full text-ink-700 transition hover:bg-ink-100"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {store.wishlist.length > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-danger-500 px-1 text-[10px] font-bold text-white">
                  {store.wishlist.length}
                </span>
              )}
            </Link>
            <Link
              to="/orders"
              className="hidden sm:grid h-10 w-10 place-items-center rounded-full text-ink-700 transition hover:bg-ink-100"
              aria-label="Orders"
            >
              <User size={20} />
            </Link>
            <Link
              to="/cart"
              className="relative grid h-10 w-10 place-items-center rounded-full text-ink-700 transition hover:bg-ink-100"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {store.cartCount > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-ink-950">
                  {store.cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search dropdown */}
        {searchOpen && (
          <div className="absolute inset-x-0 top-full border-t border-ink-200 bg-white shadow-lg animate-fadeIn">
            <div className="mx-auto max-w-8xl px-4 py-4 lg:px-8">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search shoes, brands, categories…"
                  className="w-full rounded-full border border-ink-300 bg-ink-50 py-3.5 pl-12 pr-4 text-sm focus:border-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ink-900/10"
                />
              </div>
              {results.length > 0 && (
                <div className="mt-3 grid gap-1">
                  {results.map((p) => (
                    <Link
                      key={p.id}
                      to={`/product?id=${p.id}`}
                      onClick={() => { setSearchOpen(false); setQuery(''); }}
                      className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-ink-50"
                    >
                      <img src={p.image} alt={p.name} className="h-12 w-12 rounded-lg object-cover" loading="lazy" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink-900">{p.name}</p>
                        <p className="text-xs text-ink-500 capitalize">{p.gender} · {p.category}</p>
                      </div>
                      <span className="text-sm font-semibold text-ink-900">{effectivePrice(p).toLocaleString('en-PK')}</span>
                    </Link>
                  ))}
                </div>
              )}
              {query.trim() && results.length === 0 && (
                <p className="mt-3 py-6 text-center text-sm text-ink-500">No shoes found for "{query}"</p>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm animate-fadeIn" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[82%] max-w-sm bg-white shadow-2xl animate-slideInRight overflow-y-auto">
            <div className="flex items-center justify-between border-b border-ink-200 px-5 py-4">
              <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-950 text-gold-400 font-display font-bold">V</span>
                <span className="font-display text-lg font-bold text-ink-950">VÉRONA</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-ink-100" aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <nav className="px-3 py-4">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className={classNames(
                    'flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition',
                    isActive(l.to) ? 'bg-ink-100 text-ink-950' : 'text-ink-700 hover:bg-ink-50',
                  )}
                >
                  {l.label}
                  <ChevronDown size={16} className="-rotate-90 text-ink-400" />
                </Link>
              ))}
              <div className="my-3 h-px bg-ink-200" />
              <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium text-ink-700 hover:bg-ink-50">
                <Heart size={20} /> Wishlist
                {store.wishlist.length > 0 && <span className="ml-auto text-sm text-ink-500">{store.wishlist.length}</span>}
              </Link>
              <Link to="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium text-ink-700 hover:bg-ink-50">
                <User size={20} /> My Orders
              </Link>
            </nav>
            <div className="px-5 pb-8 pt-2">
              <div className="rounded-2xl bg-ink-950 p-5 text-white">
                <p className="font-display text-lg">Need help?</p>
                <p className="mt-1 text-sm text-ink-300">{BRAND.phone}</p>
                <p className="text-sm text-ink-300">{BRAND.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
