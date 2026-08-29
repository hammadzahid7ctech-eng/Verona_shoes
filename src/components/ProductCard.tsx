import { Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { Link } from '@/components/Link';
import { useStore } from '@/lib/store';
import { classNames, effectivePrice, formatPKR, calcDiscount } from '@/lib/format';
import { StarRating } from '@/components/StarRating';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { toggleWishlist, isWishlisted, addToCart, showToast } = useStore();
  const price = effectivePrice(product);
  const discount = calcDiscount(product.price, product.salePrice);
  const wished = isWishlisted(product.id);

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      size: product.sizes[Math.floor(product.sizes.length / 2)],
      color: product.colors[0].name,
      quantity: 1,
    });
    showToast(`${product.name} added to cart`, 'success');
  };

  return (
    <Link
      to={`/product?id=${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200/70 transition-all duration-300 hover:shadow-xl hover:ring-ink-300 animate-fadeUp"
    >
      <div
        className="relative aspect-square overflow-hidden bg-ink-100"
        style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge && (
            <span
              className={classNames(
                'chip backdrop-blur',
                product.badge === 'Sale' && 'bg-danger-500 text-white',
                product.badge === 'New' && 'bg-accent-600 text-white',
                product.badge === 'Bestseller' && 'bg-gold-400 text-ink-950',
              )}
            >
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="chip bg-ink-950/80 text-white backdrop-blur">-{discount}%</span>
          )}
        </div>
        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
          className={classNames(
            'absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition',
            wished ? 'bg-danger-500 text-white' : 'bg-white/90 text-ink-700 hover:bg-white',
          )}
          aria-label="Toggle wishlist"
        >
          <Heart size={16} fill={wished ? 'currentColor' : 'none'} />
        </button>
        {/* Quick add (desktop hover) */}
        <button
          onClick={quickAdd}
          className="absolute inset-x-3 bottom-3 hidden translate-y-3 items-center justify-center gap-2 rounded-full bg-ink-950 py-2.5 text-xs font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:flex"
        >
          <ShoppingBag size={14} /> Quick Add
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">{product.brand}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-ink-900 group-hover:text-ink-950">
          {product.name}
        </h3>
        <div className="mt-2">
          <StarRating rating={product.rating} count={product.reviewCount} />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-base font-bold text-ink-950">{formatPKR(price)}</span>
          {product.salePrice && product.salePrice < product.price && (
            <span className="text-xs text-ink-400 line-through">{formatPKR(product.price)}</span>
          )}
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          {product.colors.slice(0, 4).map((c) => (
            <span
              key={c.name}
              className="h-3 w-3 rounded-full ring-1 ring-ink-300"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[10px] text-ink-500">+{product.colors.length - 4}</span>
          )}
        </div>
        {/* Quick add (mobile) */}
        <button
          onClick={quickAdd}
          className="mt-3 flex items-center justify-center gap-2 rounded-full bg-ink-100 py-2.5 text-xs font-semibold text-ink-900 transition hover:bg-ink-900 hover:text-white sm:hidden"
        >
          <ShoppingBag size={14} /> Add to Cart
        </button>
      </div>
    </Link>
  );
}
