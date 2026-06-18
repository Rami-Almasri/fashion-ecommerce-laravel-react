import { Star } from 'lucide-react';
import { cn } from '../lib/utils';

export default function StarRating({ value = 0, size = 14, className = '', showValue = false }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full;
        const isHalf = i === full && half;
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-clay-200" fill="currentColor" />
            {(filled || isHalf) && (
              <span
                className="absolute inset-0 overflow-hidden text-mustard"
                style={{ width: isHalf ? size / 2 : size }}
              >
                <Star size={size} className="text-clay-400" fill="currentColor" />
              </span>
            )}
          </span>
        );
      })}
      {showValue && <span className="ml-1.5 text-xs font-medium text-ink/60">{value.toFixed(1)}</span>}
    </span>
  );
}
