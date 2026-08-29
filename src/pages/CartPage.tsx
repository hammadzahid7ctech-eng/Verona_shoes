import { useState } from 'react';
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, X, Truck, Check,
} from 'lucide-react';
import { Link } from '@/components/Link';
import { useStore } from '@/lib/store';
import { getProductById } from '@/lib/products';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHeader } from '@/components/SectionHeader';
import { COUPONS, FREE_DELIVERY_THRESHOLD, DELIVERY_FLAT } from '@/lib/siteData';
import {
  classNames, effectivePrice, formatPKR,
} from '@/lib/format';
import type { Coupon } from '@/types';

export function CartPage() {
  const { cart, updateQuantity, removeFromCart, navigate, showToast } = useStore();
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

  const lineItems = cart
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      return { item, product, price: effectivePrice(product), lineTotal: effectivePrice(product) * item.quantity };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const subtotal = lineItems.reduce((s, li) => s + li.lineTotal, 0);
  const discount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? Math.round((subtotal * appliedCoupon.value) / 100)
      : Math.min(appliedCoupon.value, subtotal)
    : 0;
  const afterDiscount = subtotal - discount;
  const delivery = afterDiscount >= FREE_DELIVERY_THRESHOLD || afterDiscount === 0 ? 0 : DELIVERY_FLAT;
  const total = afterDiscount + delivery;
  const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - afterDiscount);

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const found = COUPONS.find((c) => c.code === code);
    if (!found) {
      setCouponError('Invalid coupon code');
      setAppliedCoupon(null);
      return;
    }
    if (found.minOrder && subtotal < found.minOrder) {
      setCouponError(`Minimum order ₨${found.minOrder.toLocaleString('en-PK')} required`);
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon(found);
    setCouponError('');
    setCouponInput('');
    showToast(`Coupon ${found.code} applied — ${found.label}`, 'success');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  if (cart.length === 0) {
    return (
      <div>
        <PageHeader title="Your Cart" />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center lg:px-8">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-ink-100">
            <ShoppingBag size={40} className="text-ink-400" />
          </div>
          <h2 className="mt-6 font-display text-2xl font-bold text-ink-950">Your cart is empty</h2>
          <p className="mt-2 text-ink-600">Looks like you haven't added any shoes yet. Let's fix that.</p>
          <Link to="/shop" className="btn btn-primary mt-8 px-8 py-3.5">
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Your Cart" subtitle={`${cart.length} item${cart.length > 1 ? 's' : ''} in your bag`}>
        <div className="mb-4"><Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} /></div>
      </PageHeader>

      <div className="mx-auto max-w-8xl px-4 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Items */}
          <div>
            {/* Free delivery progress */}
            <div className="mb-5 rounded-2xl bg-ink-50 p-4">
              {remainingForFree > 0 ? (
                <p className="text-sm text-ink-700">
                  <Truck size={16} className="mr-1.5 inline text-gold-600" />
                  Add <strong>{formatPKR(remainingForFree)}</strong> more to get <strong>FREE delivery</strong>
                </p>
              ) : (
                <p className="flex items-center gap-1.5 text-sm font-medium text-accent-700">
                  <Check size={16} /> You've unlocked FREE delivery!
                </p>
              )}
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-200">
                <div
                  className="h-full rounded-full bg-gold-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (afterDiscount / FREE_DELIVERY_THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              {lineItems.map(({ item, product, price, lineTotal }) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex gap-4 rounded-2xl bg-white p-3 ring-1 ring-ink-200/70 sm:p-4 animate-fadeUp"
                >
                  <Link to={`/product?id=${product.id}`} className="shrink-0">
                    <img src={product.image} alt={product.name} className="h-24 w-24 rounded-xl object-cover sm:h-28 sm:w-28" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">{product.brand}</p>
                        <Link to={`/product?id=${product.id}`}>
                          <h3 className="line-clamp-1 text-sm font-semibold text-ink-900 hover:text-ink-950">{product.name}</h3>
                        </Link>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500">
                          <span>Size: EU {item.size}</span>
                          <span>Color: {item.color}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => { removeFromCart(item.productId, item.size, item.color); showToast('Item removed', 'info'); }}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-400 transition hover:bg-danger-50 hover:text-danger-600"
                        aria-label="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-end justify-between pt-2">
                      <div className="inline-flex items-center rounded-lg border border-ink-300">
                        <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)} className="grid h-9 w-9 place-items-center text-ink-700 hover:text-ink-950" aria-label="Decrease">
                          <Minus size={14} />
                        </button>
                        <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)} className="grid h-9 w-9 place-items-center text-ink-700 hover:text-ink-950" aria-label="Increase">
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-ink-950">{formatPKR(lineTotal)}</p>
                        <p className="text-xs text-ink-500">{formatPKR(price)} each</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/shop" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink-950">
              ← Continue shopping
            </Link>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start">
            <div className="rounded-2xl bg-white p-6 ring-1 ring-ink-200/70 shadow-sm">
              <h3 className="font-display text-xl font-bold text-ink-950">Order Summary</h3>

              {/* Coupon */}
              <div className="mt-5">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-xl bg-accent-50 px-4 py-3 ring-1 ring-accent-500/30">
                    <span className="flex items-center gap-2 text-sm font-medium text-accent-700">
                      <Tag size={15} /> {appliedCoupon.code} — {appliedCoupon.label}
                    </span>
                    <button onClick={removeCoupon} className="text-accent-700 hover:text-accent-700/70" aria-label="Remove coupon">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value); setCouponError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                        placeholder="Coupon code"
                        className="input uppercase placeholder:normal-case"
                      />
                      <button onClick={applyCoupon} className="btn btn-outline shrink-0 px-5">Apply</button>
                    </div>
                    {couponError && <p className="mt-2 text-xs text-danger-600">{couponError}</p>}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {COUPONS.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => { setCouponInput(c.code); }}
                          className="chip border border-dashed border-gold-400 bg-gold-50 text-gold-700 hover:bg-gold-100"
                        >
                          <Tag size={11} /> {c.code}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Totals */}
              <div className="mt-5 space-y-3 border-t border-ink-100 pt-5 text-sm">
                <div className="flex justify-between text-ink-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-ink-900">{formatPKR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-accent-700">
                    <span>Discount</span>
                    <span className="font-medium">−{formatPKR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-ink-600">
                  <span>Delivery</span>
                  <span className="font-medium text-ink-900">
                    {delivery === 0 ? <span className="text-accent-700">FREE</span> : formatPKR(delivery)}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-baseline justify-between border-t border-ink-100 pt-5">
                <span className="font-semibold text-ink-900">Total</span>
                <span className="font-display text-2xl font-bold text-ink-950">{formatPKR(total)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-primary mt-6 w-full py-3.5"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink-500">
                <Truck size={14} /> Estimated delivery: 3-5 business days
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
