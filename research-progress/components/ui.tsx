'use client';

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cx(
        'rounded-2xl border border-line bg-card shadow-soft',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardHead({
  title,
  hint,
  icon,
  action,
}: {
  title: string;
  hint?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line/70 px-6 py-4">
      <div className="flex items-start gap-3">
        {icon ? <span className="mt-0.5 text-sage-deep">{icon}</span> : null}
        <div>
          <h2 className="text-[15px] font-medium tracking-wide text-ink">{title}</h2>
          {hint ? <p className="mt-1 text-xs leading-relaxed text-sub">{hint}</p> : null}
        </div>
      </div>
      {action}
    </div>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'quiet' | 'danger';
  size?: 'sm' | 'md';
};

export function Button({
  variant = 'ghost',
  size = 'sm',
  className,
  ...props
}: ButtonProps) {
  const variants: Record<string, string> = {
    primary: 'bg-sage-deep text-white hover:bg-[#5c7260] disabled:bg-sage/60',
    ghost: 'border border-line text-sub hover:border-sand hover:text-ink bg-transparent',
    quiet: 'text-sub hover:text-ink hover:bg-sage-soft/60',
    danger: 'border border-transparent text-clay hover:bg-clay-soft',
  };
  return (
    <button
      {...props}
      className={cx(
        'inline-flex items-center justify-center gap-1.5 rounded-xl font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm',
        variants[variant],
        className,
      )}
    />
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cx(
        'w-full rounded-xl border border-line bg-white/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-sub/60 transition-colors focus:border-sage focus:bg-white',
        props.className,
      )}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cx(
        'w-full resize-none rounded-xl border border-line bg-white/60 px-3.5 py-2.5 text-sm leading-relaxed text-ink placeholder:text-sub/60 transition-colors focus:border-sage focus:bg-white',
        props.className,
      )}
    />
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1.5 block text-xs font-medium tracking-wide text-sub">
      {children}
    </span>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-xs text-sub/80">
      {children}
    </p>
  );
}

export function Toast({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <div className="pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink/90 px-5 py-2.5 text-xs text-white shadow-lg">
      {text}
    </div>
  );
}
