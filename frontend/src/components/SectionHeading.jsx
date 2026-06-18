import Reveal from './Reveal';
import { cn } from '../lib/utils';

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', className = '' }) {
  const centered = align === 'center';
  return (
    <Reveal className={cn(centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl', className)}>
      {eyebrow && <p className="label-eyebrow mb-3">{eyebrow}</p>}
      <h2 className="text-3xl leading-tight text-ink sm:text-4xl lg:text-[2.75rem]">{title}</h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-ink/60">{subtitle}</p>}
    </Reveal>
  );
}
