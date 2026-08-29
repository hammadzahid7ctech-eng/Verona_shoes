import { Heart, ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from '@/components/Link';
import { useStore } from '@/lib/store';
import { getProductById } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHeader } from '@/components/SectionHeader';
import { formatPKR, effectivePrice } from '@/lib/format';

export function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, showToast } = useStore();
  const products = wishlist.map((id) => getProductById(id)).filter((p): p is NonNullable<typeof p> => p !== null);

  if (products.length === 0) {
    return (
      <div>
        <PageHeader title="Your Wishlist" />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center lg:px-8">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-ink-100">
            <Heart size={40} className="text-ink-400" />
          </div>
          <h2 className="mt-6 font-display text-2xl font-bold text-ink-950">Your wishlist is empty</h2>
          <p className="mt-2 text-ink-600">Tap the heart icon on any product to save it here for later.</p>
          <Link to="/shop" className="btn btn-primary mt-8 px-8 py-3.5">Explore Shoes <ArrowRight size={18} /></Link>
        </div>
      </div>
    );
  }

  const moveAllToCart = () => {
    products.forEach((p) => {
      addToCart({
        productId: p.id,
        size: p.sizes[Math.floor(p.sizes.length / 2)],
        color: p.colors[0].name,
        quantity: 1,
      });
    });
    showToast(`${products.length} items moved to cart`, 'success');
  };

  return (
    <div>
      <PageHeader title="Your Wishlist" subtitle={`${products.length} saved item${products.length > 1 ? 's' : ''}`}>
        <div className="mb-4"><Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} /></div>
      </PageHeader>

      <div className="mx-auto max-w-8xl px-4 py-8 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-600">Items you love, all in one place.</p>
          <button onClick={moveAllToCart} className="btn btn-outline px-5 py-2.5">
            <ShoppingBag size={16} /> Move all to cart
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
