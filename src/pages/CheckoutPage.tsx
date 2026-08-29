import { useState } from 'react';
import {
  ArrowRight, ArrowLeft, Banknote, Smartphone, Building, CreditCard,
  Check, ShieldCheck, Loader2, Lock, Tag, X,
} from 'lucide-react';
import { Link } from '@/components/Link';
import { useStore } from '@/lib/store';
import { getProductById } from '@/lib/products';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHeader } from '@/components/SectionHeader';
import { ThankYouModal } from '@/pages/ThankYouModal';
import { COUPONS, FREE_DELIVERY_THRESHOLD, DELIVERY_FLAT, PAKISTAN_CITIES, PROVINCES, PAYMENT_METHODS } from '@/lib/siteData';
import { classNames, effectivePrice, formatPKR, uid, estimatedDeliveryDate } from '@/lib/format';
import type { Coupon, Order } from '@/types';

const ICONS: Record<string, typeof Banknote> = {
  banknote: Banknote,
  smartphone: Smartphone,
  building: Building,
  'credit-card': CreditCard,
};

interface FormState {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

const EMPTY: FormState = {
  name: '', phone: '', email: '', address: '', city: '', province: '', postalCode: '',
};

export function CheckoutPage() {
  const { cart, clearCart, addOrder, navigate, showToast } = useStore();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [payment, setPayment] = useState<string>('cod');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [placing, setPlacing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

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

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const found = COUPONS.find((c) => c.code === code);
    if (!found) { setCouponError('Invalid coupon code'); setAppliedCoupon(null); return; }
    if (found.minOrder && subtotal < found.minOrder) {
      setCouponError(`Minimum order ₨${found.minOrder.toLocaleString('en-PK')} required`);
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon(found);
    setCouponError('');
    setCouponInput('');
    showToast(`Coupon ${found.code} applied`, 'success');
  };

  const setField = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.trim().length < 3) e.name = 'Enter your full name';
    const phone = form.phone.replace(/\s/g, '');
    if (!phone) e.phone = 'Phone number is required';
    else if (!/^(\+92|0)?3\d{9}$/.test(phone)) e.phone = 'Enter a valid Pakistani mobile number';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.address.trim()) e.address = 'Address is required';
    else if (form.address.trim().length < 10) e.address = 'Enter a complete address';
    if (!form.city) e.city = 'Select your city';
    if (!form.province) e.province = 'Select your province';
    if (!form.postalCode.trim()) e.postalCode = 'Postal code is required';
    else if (!/^\d{4,5}$/.test(form.postalCode.trim())) e.postalCode = 'Enter a valid postal code';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = () => {
    if (cart.length === 0) { showToast('Your cart is empty', 'error'); return; }
    if (!validate()) { showToast('Please complete the form', 'error'); return; }
    setPlacing(true);
    window.setTimeout(() => {
      const order: Order = {
        id: uid('VRN'),
        date: new Date().toISOString(),
        status: 'Processing',
        items: lineItems.map((li) => ({
          productId: li.product.id,
          name: li.product.name,
          image: li.product.image,
          size: li.item.size,
          color: li.item.color,
          quantity: li.item.quantity,
          price: li.price,
        })),
        subtotal,
        discount,
        delivery,
        total,
        couponCode: appliedCoupon?.code,
        customer: { ...form },
        paymentMethod: PAYMENT_METHODS.find((p) => p.id === payment)?.label ?? 'Cash on Delivery',
        estimatedDelivery: estimatedDeliveryDate(4),
      };
      addOrder(order);
      clearCart();
      setPlacing(false);
      setConfirmedOrder(order);
      showToast('Order placed successfully!', 'success');
    }, 1400);
  };

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div>
        <PageHeader title="Checkout" />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center lg:px-8">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-ink-100">
            <Lock size={36} className="text-ink-400" />
          </div>
          <h2 className="mt-6 font-display text-2xl font-bold text-ink-950">Your cart is empty</h2>
          <p className="mt-2 text-ink-600">Add some shoes before heading to checkout.</p>
          <Link to="/shop" className="btn btn-primary mt-8 px-8 py-3.5">Start Shopping <ArrowRight size={18} /></Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Checkout" subtitle="Complete your order securely">
        <div className="mb-4"><Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} /></div>
      </PageHeader>

      <div className="mx-auto max-w-8xl px-4 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Left: form + payment */}
          <div className="space-y-8">
            {/* Delivery details */}
            <section className="rounded-2xl bg-white p-6 ring-1 ring-ink-200/70">
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-ink-950 text-sm font-bold text-gold-400">1</span>
                <h2 className="font-display text-xl font-bold text-ink-950">Delivery Details</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label">Full Name</label>
                  <input value={form.name} onChange={(e) => setField('name', e.target.value)} className={classNames('input', errors.name && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/10')} placeholder="e.g. Ahmed Raza" />
                  {errors.name && <p className="mt-1 text-xs text-danger-600">{errors.name}</p>}
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input value={form.phone} onChange={(e) => setField('phone', e.target.value)} className={classNames('input', errors.phone && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/10')} placeholder="03XX-XXXXXXX" />
                  {errors.phone && <p className="mt-1 text-xs text-danger-600">{errors.phone}</p>}
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input value={form.email} onChange={(e) => setField('email', e.target.value)} className={classNames('input', errors.email && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/10')} placeholder="you@example.com" />
                  {errors.email && <p className="mt-1 text-xs text-danger-600">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Street Address</label>
                  <input value={form.address} onChange={(e) => setField('address', e.target.value)} className={classNames('input', errors.address && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/10')} placeholder="House #, street, area" />
                  {errors.address && <p className="mt-1 text-xs text-danger-600">{errors.address}</p>}
                </div>
                <div>
                  <label className="label">City</label>
                  <select value={form.city} onChange={(e) => setField('city', e.target.value)} className={classNames('input', errors.city && 'border-danger-500')}>
                    <option value="">Select city</option>
                    {PAKISTAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.city && <p className="mt-1 text-xs text-danger-600">{errors.city}</p>}
                </div>
                <div>
                  <label className="label">Province</label>
                  <select value={form.province} onChange={(e) => setField('province', e.target.value)} className={classNames('input', errors.province && 'border-danger-500')}>
                    <option value="">Select province</option>
                    {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.province && <p className="mt-1 text-xs text-danger-600">{errors.province}</p>}
                </div>
                <div>
                  <label className="label">Postal Code</label>
                  <input value={form.postalCode} onChange={(e) => setField('postalCode', e.target.value)} className={classNames('input', errors.postalCode && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/10')} placeholder="e.g. 54000" />
                  {errors.postalCode && <p className="mt-1 text-xs text-danger-600">{errors.postalCode}</p>}
                </div>
              </div>
            </section>

            {/* Payment method */}
            <section className="rounded-2xl bg-white p-6 ring-1 ring-ink-200/70">
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-ink-950 text-sm font-bold text-gold-400">2</span>
                <h2 className="font-display text-xl font-bold text-ink-950">Payment Method</h2>
              </div>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((m) => {
                  const Icon = ICONS[m.icon] ?? Banknote;
                  const selected = payment === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setPayment(m.id)}
                      className={classNames(
                        'flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition',
                        selected ? 'border-ink-900 bg-ink-50' : 'border-ink-200 hover:border-ink-300',
                      )}
                    >
                      <div className={classNames('grid h-11 w-11 shrink-0 place-items-center rounded-xl transition', selected ? 'bg-ink-950 text-gold-400' : 'bg-ink-100 text-ink-600')}>
                        <Icon size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-ink-900">{m.label}</p>
                        <p className="text-xs text-ink-500">{m.desc}</p>
                      </div>
                      <span className={classNames('grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition', selected ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-300')}>
                        {selected && <Check size={14} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink-950">
              <ArrowLeft size={16} /> Back to cart
            </Link>
          </div>

          {/* Right: order summary */}
          <aside className="lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start">
            <div className="rounded-2xl bg-white p-6 ring-1 ring-ink-200/70 shadow-sm">
              <h3 className="font-display text-xl font-bold text-ink-950">Order Summary</h3>

              {/* Items mini list */}
              <div className="mt-4 max-h-52 space-y-3 overflow-y-auto pr-1">
                {lineItems.map(({ item, product }) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img src={product.image} alt={product.name} className="h-14 w-14 rounded-lg object-cover" />
                      <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-ink-900 text-[10px] font-bold text-white">{item.quantity}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-xs font-semibold text-ink-900">{product.name}</p>
                      <p className="text-[11px] text-ink-500">EU {item.size} · {item.color}</p>
                    </div>
                    <span className="text-xs font-semibold text-ink-900">{formatPKR(effectivePrice(product) * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="mt-5 border-t border-ink-100 pt-5">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-xl bg-accent-50 px-4 py-3 ring-1 ring-accent-500/30">
                    <span className="flex items-center gap-2 text-sm font-medium text-accent-700">
                      <Tag size={15} /> {appliedCoupon.code}
                    </span>
                    <button onClick={() => { setAppliedCoupon(null); showToast('Coupon removed', 'info'); }} className="text-accent-700 hover:text-accent-700/70">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value); setCouponError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                      placeholder="Coupon code"
                      className="input uppercase placeholder:normal-case py-2.5"
                    />
                    <button onClick={applyCoupon} className="btn btn-outline shrink-0 px-4 py-2.5">Apply</button>
                  </div>
                )}
                {couponError && <p className="mt-2 text-xs text-danger-600">{couponError}</p>}
              </div>

              {/* Totals */}
              <div className="mt-5 space-y-3 border-t border-ink-100 pt-5 text-sm">
                <div className="flex justify-between text-ink-600"><span>Subtotal</span><span className="font-medium text-ink-900">{formatPKR(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-accent-700"><span>Discount</span><span className="font-medium">−{formatPKR(discount)}</span></div>}
                <div className="flex justify-between text-ink-600"><span>Delivery</span><span className="font-medium text-ink-900">{delivery === 0 ? <span className="text-accent-700">FREE</span> : formatPKR(delivery)}</span></div>
              </div>
              <div className="mt-5 flex items-baseline justify-between border-t border-ink-100 pt-5">
                <span className="font-semibold text-ink-900">Total</span>
                <span className="font-display text-2xl font-bold text-ink-950">{formatPKR(total)}</span>
              </div>

              <button
                onClick={placeOrder}
                disabled={placing}
                className="btn btn-primary mt-6 w-full py-3.5"
              >
                {placing ? (<><Loader2 size={18} className="animate-spin" /> Placing Order…</>) : (<><Lock size={16} /> Place Order · {formatPKR(total)}</>)}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-500">
                <ShieldCheck size={14} className="text-accent-600" /> Your information is secure and encrypted
              </div>
            </div>
          </aside>
        </div>
      </div>

      {confirmedOrder && (
        <ThankYouModal
          order={confirmedOrder}
          onClose={() => { setConfirmedOrder(null); navigate('/shop'); }}
          onViewOrder={() => { setConfirmedOrder(null); navigate(`/order?id=${confirmedOrder.id}`); }}
        />
      )}
    </div>
  );
}
