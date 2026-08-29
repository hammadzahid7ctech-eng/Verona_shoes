import { useEffect, useMemo, useState } from 'react';
import {
  Heart, ShoppingBag, Minus, Plus, Star, Truck, RefreshCw, ShieldCheck,
  Check, ChevronRight, Share2,
} from 'lucide-react';
import { Link } from '@/components/Link';
import { useStore } from '@/lib/store';
import { getProductById, PRODUCTS } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { StarRating } from '@/components/StarRating';
import {
  classNames, effectivePrice, formatPKR, calcDiscount, formatDate, estimatedDeliveryDate,
} from '@/lib/format';
import type { Review } from '@/types';

export function ProductDetailPage({ productId }: { productId: string }) {
  const { addToCart, toggleWishlist, isWishlisted, showToast, navigate } = useStore();
  const product = getProductById(productId);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<number | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'description' | 'specs' | 'reviews'>('description');

  useEffect(() => {
    setLoading(true);
    setActiveImage(0);
    setSize(null);
    setColor(null);
    setQty(1);
    setTab('description');
    const t = window.setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [productId]);

  const related = useMemo(() => {
    if (!product) return [];
    return PRODUCTS.filter(
      (p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender),
    ).slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-ink-950">Product not found</h1>
        <p className="mt-3 text-ink-600">The shoe you're looking for may have sold out or moved.</p>
        <Link to="/shop" className="btn btn-primary mt-8">Back to Shop</Link>
      </div>
    );
  }

  const price = effectivePrice(product);
  const discount = calcDiscount(product.price, product.salePrice);
  const wished = isWishlisted(product.id);

  const handleAddToCart = () => {
    if (!size) { showToast('Please select a size', 'error'); return; }
    if (!color) { showToast('Please select a color', 'error'); return; }
    addToCart({ productId: product.id, size, color, quantity: qty });
    showToast(`${product.name} added to cart`, 'success');
  };

  const buyNow = () => {
    if (!size) { showToast('Please select a size', 'error'); return; }
    if (!color) { showToast('Please select a color', 'error'); return; }
    addToCart({ productId: product.id, size, color, quantity: qty });
    navigate('/cart');
  };

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = product.reviews.filter((r) => Math.round(r.rating) === star).length;
    const pct = product.reviews.length ? (count / product.reviews.length) * 100 : 0;
    return { star, count, pct };
  });

  return (
    <div className="mx-auto max-w-8xl px-4 py-6 lg:px-8 lg:py-10">
      <div className="mb-6"><Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, { label: product.name }]} /></div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start">
          {loading ? (
            <div className="skeleton aspect-square rounded-3xl" />
          ) : (
            <>
              <div className="relative overflow-hidden rounded-3xl bg-ink-100 ring-1 ring-ink-200">
                <img
                  key={activeImage}
                  src={product.gallery[activeImage]}
                  alt={product.name}
                  className="aspect-square w-full object-cover animate-fadeIn"
                />
                {discount > 0 && (
                  <span className="absolute left-4 top-4 chip bg-danger-500 text-white">-{discount}% OFF</span>
                )}
              </div>
              {product.gallery.length > 1 && (
                <div className="mt-4 flex gap-3">
                  {product.gallery.map((g, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={classNames(
                        'overflow-hidden rounded-xl ring-2 transition',
                        activeImage === i ? 'ring-ink-900' : 'ring-transparent hover:ring-ink-300',
                      )}
                    >
                      <img src={g} alt={`${product.name} ${i + 1}`} className="h-20 w-20 object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Info */}
        <div>
          {loading ? (
            <div className="space-y-4">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-8 w-full rounded" />
              <div className="skeleton h-5 w-1/2 rounded" />
              <div className="skeleton h-24 w-full rounded" />
              <div className="skeleton h-12 w-full rounded" />
            </div>
          ) : (
            <div className="animate-fadeUp">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">{product.brand}</p>
              <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">{product.name}</h1>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <StarRating rating={product.rating} size={16} showValue />
                <span className="text-sm text-ink-500">·</span>
                <button onClick={() => setTab('reviews')} className="text-sm text-ink-600 underline-offset-2 hover:underline">
                  {product.reviewCount} reviews
                </button>
                <span className="text-sm text-ink-500">·</span>
                <span className="text-xs text-ink-500">SKU: {product.sku}</span>
              </div>

              <div className="mt-5 flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-ink-950">{formatPKR(price)}</span>
                {product.salePrice && product.salePrice < product.price && (
                  <span className="text-lg text-ink-400 line-through">{formatPKR(product.price)}</span>
                )}
                {discount > 0 && (
                  <span className="chip bg-danger-100 text-danger-700">Save {formatPKR(product.price - price)}</span>
                )}
              </div>
              <p className="mt-1 text-xs text-ink-500">Inclusive of all taxes</p>

              <p className="mt-5 text-sm leading-relaxed text-ink-700">{product.description}</p>

              {/* Color */}
              <div className="mt-7">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-ink-900">Color {color && <span className="font-normal text-ink-600">— {color}</span>}</h4>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c.name)}
                      title={c.name}
                      className={classNames(
                        'flex items-center gap-2 rounded-full border-2 py-1.5 pl-1.5 pr-3.5 text-xs font-medium transition',
                        color === c.name ? 'border-ink-900 bg-ink-50' : 'border-ink-200 hover:border-ink-400',
                      )}
                    >
                      <span className="h-6 w-6 rounded-full ring-1 ring-ink-300" style={{ backgroundColor: c.hex }} />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-ink-900">Size {size && <span className="font-normal text-ink-600">— EU {size}</span>}</h4>
                  <span className="text-xs text-ink-500">Size chart</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={classNames(
                        'h-11 min-w-11 rounded-xl border px-3 text-sm font-semibold transition',
                        size === s ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-300 text-ink-700 hover:border-ink-500',
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity + stock */}
              <div className="mt-6 flex items-center gap-5">
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-ink-900">Quantity</h4>
                  <div className="inline-flex items-center rounded-xl border border-ink-300">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center text-ink-700 hover:text-ink-950" aria-label="Decrease">
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                    <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="grid h-11 w-11 place-items-center text-ink-700 hover:text-ink-950" aria-label="Increase">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {product.stock > 10 ? (
                    <span className="flex items-center gap-1.5 text-accent-700"><Check size={16} /> In stock</span>
                  ) : product.stock > 0 ? (
                    <span className="flex items-center gap-1.5 text-gold-700"><Check size={16} /> Only {product.stock} left</span>
                  ) : (
                    <span className="text-danger-600">Out of stock</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={handleAddToCart} className="btn btn-primary flex-1 py-3.5">
                  <ShoppingBag size={18} /> Add to Cart
                </button>
                <button onClick={buyNow} className="btn btn-gold flex-1 py-3.5">
                  Buy Now
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={classNames(
                    'grid h-[50px] w-[50px] shrink-0 place-items-center rounded-full border transition',
                    wished ? 'border-danger-500 bg-danger-500 text-white' : 'border-ink-300 text-ink-700 hover:border-ink-900',
                  )}
                  aria-label="Wishlist"
                >
                  <Heart size={20} fill={wished ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Share */}
              <div className="mt-4 flex items-center gap-2 text-sm text-ink-500">
                <Share2 size={16} /> Share this product
              </div>

              {/* Assurances */}
              <div className="mt-8 grid gap-3 rounded-2xl bg-ink-50 p-5 sm:grid-cols-3">
                {[
                  { icon: Truck, label: 'Free delivery over ₨5,000', sub: estimatedDeliveryDate(4) },
                  { icon: RefreshCw, label: '7-day easy returns', sub: 'Exchange or refund' },
                  { icon: ShieldCheck, label: '100% authentic', sub: 'Genuine VÉRONA product' },
                ].map((a) => (
                  <div key={a.label} className="flex items-start gap-3">
                    <a.icon size={20} className="mt-0.5 shrink-0 text-ink-900" />
                    <div>
                      <p className="text-xs font-semibold text-ink-900">{a.label}</p>
                      <p className="text-xs text-ink-500">{a.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div className="mt-10">
                <div className="flex gap-1 border-b border-ink-200">
                  {(['description', 'specs', 'reviews'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={classNames(
                        'relative px-4 py-3 text-sm font-medium capitalize transition',
                        tab === t ? 'text-ink-950' : 'text-ink-500 hover:text-ink-800',
                      )}
                    >
                      {t === 'specs' ? 'Specifications' : t === 'reviews' ? `Reviews (${product.reviewCount})` : 'Description'}
                      {tab === t && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-ink-950" />}
                    </button>
                  ))}
                </div>

                <div className="py-6">
                  {tab === 'description' && (
                    <div className="animate-fadeIn space-y-4 text-sm leading-relaxed text-ink-700">
                      <p>{product.description}</p>
                      <p>
                        The {product.name} is part of VÉRONA's {product.category} collection for {product.gender}, designed and crafted to deliver lasting comfort and refined style. Every pair is quality-checked in our Lahore atelier before it reaches your doorstep.
                      </p>
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {product.tags.map((t) => (
                          <li key={t} className="flex items-center gap-2 text-ink-600">
                            <ChevronRight size={15} className="text-gold-600" /> {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {tab === 'specs' && (
                    <table className="animate-fadeIn w-full text-sm">
                      <tbody>
                        {product.specs.map((s) => (
                          <tr key={s.label} className="border-b border-ink-100">
                            <td className="py-3 pr-4 font-medium text-ink-900 w-1/3">{s.label}</td>
                            <td className="py-3 text-ink-600">{s.value}</td>
                          </tr>
                        ))}
                        <tr className="border-b border-ink-100">
                          <td className="py-3 pr-4 font-medium text-ink-900">SKU</td>
                          <td className="py-3 text-ink-600">{product.sku}</td>
                        </tr>
                        <tr className="border-b border-ink-100">
                          <td className="py-3 pr-4 font-medium text-ink-900">Category</td>
                          <td className="py-3 text-ink-600 capitalize">{product.gender} · {product.category}</td>
                        </tr>
                      </tbody>
                    </table>
                  )}

                  {tab === 'reviews' && (
                    <div className="animate-fadeIn">
                      {/* Summary */}
                      <div className="grid gap-6 rounded-2xl bg-ink-50 p-5 sm:grid-cols-[200px_1fr]">
                        <div className="text-center sm:border-r sm:border-ink-200">
                          <p className="font-display text-5xl font-bold text-ink-950">{product.rating.toFixed(1)}</p>
                          <StarRating rating={product.rating} size={16} className="mt-2 justify-center" />
                          <p className="mt-2 text-xs text-ink-500">{product.reviewCount} reviews</p>
                        </div>
                        <div className="space-y-1.5">
                          {ratingBreakdown.map((r) => (
                            <div key={r.star} className="flex items-center gap-3 text-xs">
                              <span className="flex w-10 items-center gap-1 text-ink-700">{r.star} <Star size={11} className="text-gold-400" fill="currentColor" /></span>
                              <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-200">
                                <div className="h-full rounded-full bg-gold-400" style={{ width: `${r.pct}%` }} />
                              </div>
                              <span className="w-8 text-right text-ink-500">{r.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Reviews list */}
                      <div className="mt-6 space-y-5">
                        {product.reviews.map((r: Review) => (
                          <div key={r.id} className="rounded-2xl border border-ink-100 p-5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="grid h-10 w-10 place-items-center rounded-full bg-ink-950 font-display text-sm font-bold text-gold-400">
                                  {r.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-ink-900">{r.name}</p>
                                  <p className="text-xs text-ink-500">{formatDate(r.date)}</p>
                                </div>
                              </div>
                              <StarRating rating={r.rating} size={13} />
                            </div>
                            <h5 className="mt-3 text-sm font-semibold text-ink-900">{r.title}</h5>
                            <p className="mt-1 text-sm leading-relaxed text-ink-600">{r.body}</p>
                            <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent-700">
                              <Check size={13} /> Verified Purchase
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      <section className="mt-20">
        <h2 className="font-display text-2xl font-bold text-ink-950 sm:text-3xl">You may also like</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {related.map((p, i) => (<ProductCard key={p.id} product={p} index={i} />))}
        </div>
      </section>
    </div>
  );
}
