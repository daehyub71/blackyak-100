import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export interface HeroCredit {
  author?: string;
  source?: string;
  href?: string;
}

export interface HeroProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  imageAlt: string;
  credit?: HeroCredit;
  children?: ReactNode;
  className?: string;
}

export function Hero({
  title,
  subtitle,
  imageUrl,
  imageAlt,
  credit,
  children,
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        'relative isolate w-full overflow-hidden bg-[var(--color-bg-sunken)] text-[var(--color-bg-base)]',
        className,
      )}
    >
      <div className="absolute inset-0 -z-10">
        <img
          src={imageUrl}
          alt={imageAlt}
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
      </div>

      <div className="mx-auto flex max-w-[var(--layout-max)] flex-col gap-6 px-4 py-24 sm:py-32">
        <h1 className="font-serif text-[length:var(--text-display-xl)] leading-[var(--text-display-xl--line-height)] font-semibold tracking-tight text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="max-w-2xl text-[length:var(--text-body-lg)] leading-[var(--text-body-lg--line-height)] text-white/85">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-2 flex flex-wrap gap-3">{children}</div>}
      </div>

      {credit && (credit.author || credit.source) && (
        <div className="absolute bottom-3 right-4 text-[length:var(--text-label)] leading-[var(--text-label--line-height)] text-white/70">
          {credit.author && <span>📷 {credit.author}</span>}
          {credit.author && credit.source && <span aria-hidden> · </span>}
          {credit.source && (
            <span>
              {credit.href ? (
                <a href={credit.href} target="_blank" rel="noopener noreferrer" className="underline">
                  {credit.source}
                </a>
              ) : (
                credit.source
              )}
            </span>
          )}
        </div>
      )}
    </section>
  );
}
