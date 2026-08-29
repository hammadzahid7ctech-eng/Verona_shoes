import { useState } from 'react';
import {
  CheckCircle2, ArrowRight, ShoppingBag, Package, Calendar, MapPin,
} from 'lucide-react';
import { Link } from '@/components/Link';
import { useStore } from '@/lib/store';
import { formatPKR } from '@/lib/format';
import type { Order } from '@/types';

export function ThankYouModal({
  order,
  onClose,
  onViewOrder,
}: {
  order: Order;
  onClose: () => void;
  onViewOrder: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-scaleIn">
        {/* Header with confetti bg */}
        <div className="relative overflow-hidden bg-gradient-to-br from-ink-950 to-ink-900 px-6 py-10 text-center text-white">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, rgba(212,175,55,0.3), transparent 40%), radial-gradient(circle at 80% 80%, rgba(212,175,55,0.2), transparent 45%)',
            }}
          />
          <div className="relative">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gold-400 text-ink-950 animate-scaleIn">
              <CheckCircle2 size={42} />
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold">Order Confirmed!</h2>
            <p className="mt-2 text-ink-300">Thank you for your purchase. Your shoes are on their way.</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <div className="rounded-2xl bg-ink-50 p-5">
            <div className="flex items-center justify-between border-b border-ink-200 pb-4">
              <div>
                <p className="text-xs text-ink-500">Order ID</p>
                <p className="font-display text-lg font-bold text-ink-950">{order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-ink-500">Order Total</p>
                <p className="font-display text-lg font-bold text-ink-950">{formatPKR(order.total)}</p>
              </div>
            </div>
            <div className="grid gap-3 pt-4 text-sm sm:grid-cols-2">
              <div className="flex items-start gap-2.5">
                <Calendar size={18} className="mt-0.5 shrink-0 text-gold-600" />
                <div>
                  <p className="text-xs text-ink-500">Estimated Delivery</p>
                  <p className="font-medium text-ink-900">{order.estimatedDelivery}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gold-600" />
                <div>
                  <p className="text-xs text-ink-500">Delivery To</p>
                  <p className="font-medium text-ink-900">{order.customer.city}, {order.customer.province}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Package size={18} className="mt-0.5 shrink-0 text-gold-600" />
                <div>
                  <p className="text-xs text-ink-500">Items</p>
                  <p className="font-medium text-ink-900">{order.items.length} product{order.items.length > 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-gold-600" />
                <div>
                  <p className="text-xs text-ink-500">Payment</p>
                  <p className="font-medium text-ink-900">{order.paymentMethod}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button onClick={onViewOrder} className="btn btn-primary flex-1 py-3.5">
              View Order <ArrowRight size={16} />
            </button>
            <Link to="/shop" onClick={onClose} className="btn btn-outline flex-1 py-3.5">
              <ShoppingBag size={16} /> Continue Shopping
            </Link>
          </div>
          <p className="mt-4 text-center text-xs text-ink-500">
            A confirmation has been sent to {order.customer.email}
          </p>
        </div>
      </div>
    </div>
  );
}
