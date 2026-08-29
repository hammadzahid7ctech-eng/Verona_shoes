import { ChevronRight } from 'lucide-react';
import { Link } from '@/components/Link';

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-xs text-ink-500" aria-label="Breadcrumb">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {c.to && !last ? (
              <Link to={c.to} className="transition hover:text-ink-900">{c.label}</Link>
            ) : (
              <span className={last ? 'font-medium text-ink-900' : ''}>{c.label}</span>
            )}
            {!last && <ChevronRight size={13} className="text-ink-300" />}
          </span>
        );
      })}
    </nav>
  );
}
