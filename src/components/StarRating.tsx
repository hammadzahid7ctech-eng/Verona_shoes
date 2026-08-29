import { Star } from 'lucide-react';
import { classNames } from '@/lib/format';

export function StarRating({
  rating,
  size = 14,
  className,
  showValue = false,
  count,
}: {
  rating: number;
  size?: number;
  className?: string;
  showValue?: boolean;
  count?: number;
}) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  const rounded = rating - full >= 0.75 ? full + 1 : full;
  return (
    <div className={classNames('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < rounded;
          const half = i === rounded && hasHalf;
          return (
            <Star
              key={i}
              width={size}
              height={size}
              className={classNames(
                filled || half ? 'text-gold-400' : 'text-ink-300',
                half && 'relative overflow-hidden',
              )}
              fill={filled ? 'currentColor' : 'none'}
              strokeWidth={1.5}
            />
          );
        })}
      </div>
      {showValue && <span className="text-xs font-medium text-ink-700">{rating.toFixed(1)}</span>}
      {typeof count === 'number' && (
        <span className="text-xs text-ink-500">({count.toLocaleString('en-PK')})</span>
      )}
    </div>
  );
}
