import React, { useMemo } from 'react';
import { classNames } from '@/lib/classNames';

export type TabsItem = {
  key: string;
  label: React.ReactNode;
  disabled?: boolean;
};

export type TabsProps = {
  items: TabsItem[];
  value: string;
  onChange: (key: string) => void;
  variant?: 'primary' | 'secondary';
  className?: string;
};

export default function Tabs({ items, value, onChange, variant = 'primary', className }: TabsProps) {
  const enabledKeys = useMemo(() => items.filter(i => !i.disabled).map(i => i.key), [items]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (variant !== 'primary' && variant !== 'secondary') return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') return;
    if (enabledKeys.length === 0) return;

    e.preventDefault();
    const currentIndex = Math.max(0, enabledKeys.indexOf(value));
    const nextIndex = (() => {
      if (e.key === 'Home') return 0;
      if (e.key === 'End') return enabledKeys.length - 1;
      if (e.key === 'ArrowLeft') return (currentIndex - 1 + enabledKeys.length) % enabledKeys.length;
      return (currentIndex + 1) % enabledKeys.length;
    })();

    const nextKey = enabledKeys[nextIndex];
    if (nextKey && nextKey !== value) onChange(nextKey);
  };

  return (
    <div
      className={classNames('flex items-center gap-2', className)}
      role="tablist"
      aria-orientation="horizontal"
      onKeyDown={onKeyDown}
    >
      {items.map((t) => {
        const active = t.key === value;
        const disabled = !!t.disabled;

        if (variant === 'secondary') {
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={active}
              aria-disabled={disabled}
              disabled={disabled}
              onClick={() => !disabled && onChange(t.key)}
              className={classNames(
                'px-3 py-2 text-sm font-bold rounded-lg transition-colors',
                active ? 'text-brand-700' : 'text-slate-600 hover:text-brand-600',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span className="relative inline-flex items-center">
                {t.label}
                <span
                  className={classNames(
                    'absolute left-0 -bottom-2 h-0.5 w-full rounded-full transition-all',
                    active ? 'bg-brand-600 opacity-100' : 'bg-transparent opacity-0'
                  )}
                />
              </span>
            </button>
          );
        }

        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={active}
            aria-disabled={disabled}
            disabled={disabled}
            onClick={() => !disabled && onChange(t.key)}
            className={classNames(
              'px-4 py-2 rounded-xl text-sm font-bold transition-colors',
              active ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

