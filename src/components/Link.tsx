import type { ReactNode } from 'react';
import { useStore } from '@/lib/store';

export function Link({
  to,
  children,
  className,
  onClick,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const { navigate } = useStore();
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

export function parseRoute(route: string): { path: string; params: Record<string, string> } {
  const clean = route.replace(/^\//, '');
  const [path, query] = clean.split('?');
  const params: Record<string, string> = {};
  if (query) {
    new URLSearchParams(query).forEach((v, k) => (params[k] = v));
  }
  return { path: `/${path || ''}`, params };
}
