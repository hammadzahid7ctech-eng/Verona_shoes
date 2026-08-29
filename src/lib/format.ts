export const PKR = '₨';

export function formatPKR(amount: number): string {
  return `${PKR}${Math.round(amount).toLocaleString('en-PK')}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-PK');
}

export function calcDiscount(price: number, salePrice?: number): number {
  if (!salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

export function effectivePrice(p: { price: number; salePrice?: number }): number {
  return p.salePrice && p.salePrice < p.price ? p.salePrice : p.price;
}

export function classNames(...c: (string | false | null | undefined)[]): string {
  return c.filter(Boolean).join(' ');
}

export function uid(prefix = ''): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`.toUpperCase();
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function estimatedDeliveryDate(days = 4): string {
  return addDays(new Date(), days).toLocaleDateString('en-PK', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}
