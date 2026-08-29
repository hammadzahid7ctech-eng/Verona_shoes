import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Link } from '@/components/Link';
import { BRAND, NAV_LINKS, CATEGORIES } from '@/lib/siteData';

export function Footer() {
  return (
    <footer className="mt-20 bg-ink-950 text-ink-300">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-8xl flex-col items-center gap-6 px-4 py-12 text-center lg:flex-row lg:justify-between lg:px-8 lg:text-left">
          <div>
            <h3 className="font-display text-2xl font-bold text-white">Join the VÉRONA family</h3>
            <p className="mt-1 text-sm text-ink-400">Get early access to new drops and members-only offers.</p>
          </div>
          <form
            className="flex w-full max-w-md items-center gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white placeholder-ink-500 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20"
            />
            <button type="submit" className="btn btn-gold shrink-0">
              Subscribe <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto grid max-w-8xl gap-10 px-4 py-14 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-ink-950 font-display font-bold text-lg">V</span>
            <span className="font-display text-xl font-bold text-white">VÉRONA Footwear</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-400">
            {BRAND.tagline}. Crafted in Pakistan with premium materials and timeless design — for every step of your journey.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#/"
                onClick={(e) => e.preventDefault()}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-ink-300 transition hover:border-gold-400 hover:text-gold-400"
                aria-label="Social link"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Shop</h4>
          <ul className="space-y-3 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link to={c.to} className="text-ink-400 transition hover:text-gold-400">{c.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Company</h4>
          <ul className="space-y-3 text-sm">
            {NAV_LINKS.filter((l) => ['About', 'Contact', 'Shop'].includes(l.label)).map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-ink-400 transition hover:text-gold-400">{l.label}</Link>
              </li>
            ))}
            <li><Link to="/wishlist" className="text-ink-400 transition hover:text-gold-400">Wishlist</Link></li>
            <li><Link to="/orders" className="text-ink-400 transition hover:text-gold-400">My Orders</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold-400" />
              <span className="text-ink-400">{BRAND.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="shrink-0 text-gold-400" />
              <span className="text-ink-400">{BRAND.phone}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="shrink-0 text-gold-400" />
              <span className="text-ink-400">{BRAND.email}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-8xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-ink-500 sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} VÉRONA Footwear. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Cash on Delivery</span>
            <span>·</span>
            <span>Easypaisa</span>
            <span>·</span>
            <span>JazzCash</span>
            <span>·</span>
            <span>Bank Transfer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
