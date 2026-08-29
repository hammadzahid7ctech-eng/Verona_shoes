import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { classNames } from '@/lib/format';

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const STYLES = {
  success: 'bg-white ring-accent-500/30 text-ink-900 [&_.icon]:text-accent-600',
  error: 'bg-white ring-danger-500/30 text-ink-900 [&_.icon]:text-danger-600',
  info: 'bg-white ring-ink-300 text-ink-900 [&_.icon]:text-ink-700',
};

export function Toaster() {
  const { toasts, dismissToast } = useStore();
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex w-[min(92vw,360px)] flex-col gap-3">
      {toasts.map((t) => {
        const Icon = ICONS[t.type];
        return (
          <div
            key={t.id}
            className={classNames(
              'flex items-start gap-3 rounded-2xl px-4 py-3 shadow-lg ring-1 animate-toastIn',
              STYLES[t.type],
            )}
          >
            <Icon className="icon mt-0.5 shrink-0" size={20} />
            <p className="flex-1 text-sm font-medium leading-snug">{t.message}</p>
            <button
              onClick={() => dismissToast(t.id)}
              className="text-ink-400 transition hover:text-ink-700"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
