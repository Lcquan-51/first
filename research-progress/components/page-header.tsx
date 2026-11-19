import type { ReactNode } from 'react';

export default function PageHeader({
  label,
  title,
  description,
  right,
}: {
  label: string;
  title: string;
  description?: string;
  right?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-sage-deep">{label}</p>
        <h1 className="mt-2.5 font-serif text-[26px] leading-snug tracking-wide text-ink md:text-[30px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-sub">{description}</p>
        ) : null}
      </div>
      {right}
    </header>
  );
}
