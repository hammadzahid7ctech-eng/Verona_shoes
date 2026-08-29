import { Package, ArrowRight, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from '@/components/Link';
import { useStore } from '@/lib/store';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHeader } from '@/components/SectionHeader';
import { formatPKR, formatDate, formatNumber } from '@/lib/format';
import type { Order } from '@/types';

const STATUS_STEPS: Order['status'][] = ['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

function StatusTracker({ status }: { status: Order['status'] }) {
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="flex items-center">
      {STATUS_STEPS.map((s, i) => {
        const done = i <= currentIdx;
        return (
          <div key={s} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold transition ${
                  done ? 'bg-accent-600 text-white' : 'bg-ink-200 text-ink-400'
                }`}
              >
                {done ? <CheckCircle2 size={15} /> : i + 1}
              </span>
              <span className={`hidden text-[10px] font-medium sm:block ${done ? 'text-ink-900' : 'text-ink-400'}`}>
                {s}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`mx-1 h-0.5 flex-1 rounded-full ${i < currentIdx ? 'bg-accent-600' : 'bg-ink-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function OrdersPage() {
  const { orders } = useStore();

  if (orders.length === 0) {
    return (
      <div>
        <PageHeader title="My Orders" />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center lg:px-8">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-ink-100">
            <Package size={40} className="text-ink-400" />
          </div>
          <h2 className="mt-6 font-display text-2xl font-bold text-ink-950">No orders yet</h2>
          <p className="mt-2 text-ink-600">When you place an order, it will appear here with full tracking details.</p>
          <Link to="/shop" className="btn btn-primary mt-8 px-8 py-3.5">Start Shopping <ArrowRight size={18} /></Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="My Orders" subtitle={`${formatNumber(orders.length)} order${orders.length > 1 ? 's' : ''} placed`}>
        <div className="mb-4"><Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Orders' }]} /></div>
      </PageHeader>

      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <div className="space-y-5">
          {orders.map((order, i) => (
            <Link
              key={order.id}
              to={`/order?id=${order.id}`}
              className="block rounded-2xl bg-white p-5 ring-1 ring-ink-200/70 transition hover:shadow-md animate-fadeUp"
            >
              <div style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-ink-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-display text-lg font-bold text-ink-950">{order.id}</p>
                      <span className="chip bg-ink-100 text-ink-700">{order.status}</span>
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-500">
                      <Clock size={13} /> Placed on {formatDate(order.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl font-bold text-ink-950">{formatPKR(order.total)}</p>
                    <p className="text-xs text-ink-500">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Item thumbnails */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {order.items.slice(0, 4).map((it) => (
                      <img
                        key={`${it.productId}-${it.size}-${it.color}`}
                        src={it.image}
                        alt={it.name}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
                      />
                    ))}
                    {order.items.length > 4 && (
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-ink-100 text-xs font-semibold text-ink-600 ring-2 ring-white">
                        +{order.items.length - 4}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm text-ink-700">
                      {order.items.map((it) => it.name).join(', ')}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-500">Delivery to {order.customer.city} · {order.paymentMethod}</p>
                  </div>
                  <ChevronRight size={20} className="shrink-0 text-ink-400" />
                </div>

                {/* Status tracker */}
                <div className="mt-5">
                  <StatusTracker status={order.status} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
