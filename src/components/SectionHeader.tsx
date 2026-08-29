import type { ReactNode } from 'react';
import { Link } from '@/components/Link';

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  link,
  center,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  link?: { label: string; to: string };
  center?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${center ? 'sm:flex-col sm:items-center text-center' : ''}`}>
      <div className={center ? 'mx-auto max-w-2xl text-center' : ''}>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">{eyebrow}</p>
        )}
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-2 text-ink-600">{subtitle}</p>}
      </div>
      {link && (
        <Link
          to={link.to}
          className="link-underline shrink-0 text-sm font-semibold text-ink-900"
        >
          {link.label} →
        </Link>
      )}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-ink-200 bg-gradient-to-b from-ink-50 to-white">
      <div className="mx-auto max-w-8xl px-4 py-10 lg:px-8 lg:py-14">
        {children}
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-lg text-ink-600">{subtitle}</p>}
      </div>
    </div>
  );
}
