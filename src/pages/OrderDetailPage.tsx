import {
  Package, ArrowRight, MapPin, Calendar, CreditCard, Truck, CheckCircle2,
  Printer, ChevronRight,
} from 'lucide-react';
import { Link } from '@/components/Link';
import { useStore } from '@/lib/store';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHeader } from '@/components/SectionHeader';
import { formatPKR, formatDate } from '@/lib/format';
import type { Order } from '@/types';

const STATUS_STEPS: Order['status'][] = ['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

export function OrderDetailPage({ orderId }: { orderId: string }) {
  const { getOrder } = useStore();
  const order = getOrder(orderId);

  if (!order) {
    return (
      <div>
        <PageHeader title="Order Not Found" />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center lg:px-8">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-ink-100">
            <Package size={40} className="text-ink-400" />
          </div>
          <h2 className="mt-6 font-display text-2xl font-bold text-ink-950">We couldn't find this order</h2>
          <p className="mt-2 text-ink-600">The order ID may be incorrect or the order no longer exists.</p>
          <Link to="/orders" className="btn btn-primary mt-8 px-8 py-3.5">View All Orders <ArrowRight size={18} /></Link>
        </div>
      </div>
    );
  }

  const currentIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <div>
      <PageHeader title={`Order ${order.id}`} subtitle={`Placed on ${formatDate(order.date)}`}>
        <div className="mb-4"><Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Orders', to: '/orders' }, { label: order.id }]} /></div>
      </PageHeader>

      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        {/* Status banner */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-ink-950 to-ink-800 p-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-400 text-ink-950">
                <CheckCircle2 size={26} />
              </span>
              <div>
                <p className="font-display text-xl font-bold">{order.status}</p>
                <p className="text-sm text-ink-300">Estimated delivery: {order.estimatedDelivery}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="btn border border-white/20 px-4 py-2.5 text-white hover:bg-white/10">
                <Printer size={16} /> Print
              </button>
              <Link to="/orders" className="btn bg-white px-4 py-2.5 text-ink-950 hover:bg-ink-100">
                All Orders
              </Link>
            </div>
          </div>

          {/* Progress steps */}
          <div className="mt-6 flex items-center">
            {STATUS_STEPS.map((s, i) => {
              const done = i <= currentIdx;
              return (
                <div key={s} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${done ? 'bg-gold-400 text-ink-950' : 'bg-white/10 text-ink-400'}`}>
                      {done ? <CheckCircle2 size={16} /> : i + 1}
                    </span>
                    <span className={`text-[10px] font-medium ${done ? 'text-white' : 'text-ink-400'}`}>{s}</span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`mx-1.5 h-0.5 flex-1 rounded-full ${i < currentIdx ? 'bg-gold-400' : 'bg-white/10'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Items */}
          <div className="rounded-2xl bg-white p-6 ring-1 ring-ink-200/70">
            <h2 className="font-display text-xl font-bold text-ink-950">Items in this order</h2>
            <div className="mt-4 space-y-4">
              {order.items.map((it) => (
                <Link
                  key={`${it.productId}-${it.size}-${it.color}`}
                  to={`/product?id=${it.productId}`}
                  className="flex items-center gap-4 rounded-xl p-2 transition hover:bg-ink-50"
                >
                  <img src={it.image} alt={it.name} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-ink-900">{it.name}</p>
                    <p className="text-xs text-ink-500">EU {it.size} · {it.color} · Qty {it.quantity}</p>
                    <p className="mt-0.5 text-xs text-gold-700">View product →</p>
                  </div>
                  <span className="text-sm font-bold text-ink-950">{formatPKR(it.price * it.quantity)}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar: delivery + payment + summary */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 ring-1 ring-ink-200/70">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink-950">
                <MapPin size={18} className="text-gold-600" /> Delivery Address
              </h3>
              <div className="mt-3 text-sm text-ink-700">
                <p className="font-semibold text-ink-900">{order.customer.name}</p>
                <p className="mt-1 leading-relaxed">{order.customer.address}</p>
                <p>{order.customer.city}, {order.customer.province} {order.customer.postalCode}</p>
                <p className="mt-2 text-ink-600">{order.customer.phone}</p>
                <p className="text-ink-600">{order.customer.email}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 ring-1 ring-ink-200/70">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink-950">
                <CreditCard size={18} className="text-gold-600" /> Payment
              </h3>
              <p className="mt-3 text-sm font-medium text-ink-900">{order.paymentMethod}</p>
            </div>

            <div className="rounded-2xl bg-white p-6 ring-1 ring-ink-200/70">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink-950">
                <Calendar size={18} className="text-gold-600" /> Order Summary
              </h3>
              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-ink-600"><span>Subtotal</span><span className="font-medium text-ink-900">{formatPKR(order.subtotal)}</span></div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-accent-700">
                    <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                    <span className="font-medium">−{formatPKR(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-ink-600">
                  <span>Delivery</span>
                  <span className="font-medium text-ink-900">{order.delivery === 0 ? <span className="text-accent-700">FREE</span> : formatPKR(order.delivery)}</span>
                </div>
                <div className="flex items-baseline justify-between border-t border-ink-100 pt-3">
                  <span className="font-semibold text-ink-900">Total</span>
                  <span className="font-display text-xl font-bold text-ink-950">{formatPKR(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-ink-50 p-6">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink-950">
                <Truck size={18} className="text-gold-600" /> Delivery Info
              </h3>
              <p className="mt-3 text-sm text-ink-700">Estimated delivery by <strong>{order.estimatedDelivery}</strong>.</p>
              <p className="mt-1 text-xs text-ink-500">Delivery within 3-5 business days across Pakistan.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/shop" className="btn btn-primary px-8 py-3.5">Continue Shopping <ChevronRight size={16} /></Link>
        </div>
      </div>
    </div>
  );
}
