import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { classNames } from '@/lib/classNames';
import type { SelectOption } from './Select';

export type MultiSelectProps = {
  value: string[];
  onChange?: (value: string[]) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export default function MultiSelect({
  value,
  onChange,
  options,
  placeholder = '请选择',
  disabled,
  className
}: MultiSelectProps) {
  const triggerId = useId();
  const listboxId = useMemo(() => `${triggerId}-listbox`, [triggerId]);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedOptions = useMemo(
    () => options.filter(o => value.includes(o.value)),
    [options, value]
  );

  const enabledOptions = useMemo(() => options.filter(o => !o.disabled), [options]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (wrapperRef.current && !wrapperRef.current.contains(t)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setActiveIndex(0);
    requestAnimationFrame(() => {
      optionRefs.current[0]?.focus();
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    optionRefs.current[activeIndex]?.focus();
  }, [activeIndex, open]);

  const toggleValue = (v: string) => {
    const next = value.includes(v) ? value.filter(x => x !== v) : [...value, v];
    onChange?.(next);
  };

  const removeValue = (v: string) => {
    if (!value.includes(v)) return;
    onChange?.(value.filter(x => x !== v));
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(prev => !prev);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
    }
  };

  const onListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (enabledOptions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, enabledOptions.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
      return;
    }
    if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
      return;
    }
    if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(enabledOptions.length - 1);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const next = enabledOptions[activeIndex];
      if (next) toggleValue(next.value);
      return;
    }
  };

  const visibleTags = selectedOptions.slice(0, 3);
  const restCount = Math.max(0, selectedOptions.length - visibleTags.length);

  return (
    <div ref={wrapperRef} className={classNames('relative', className)}>
      <button
        type="button"
        id={triggerId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        disabled={disabled}
        onClick={() => !disabled && setOpen(prev => !prev)}
        onKeyDown={onTriggerKeyDown}
        className={classNames(
          'w-full min-h-11 rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white text-left flex items-center justify-between gap-3',
          'outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500',
          disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'hover:bg-slate-50'
        )}
      >
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {selectedOptions.length === 0 && <span className="text-slate-400 truncate">{placeholder}</span>}
          {visibleTags.map(s => (
            <span
              key={s.value}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border bg-brand-50 text-brand-600 border-brand-200 max-w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="truncate">{s.label}</span>
              {!disabled && (
                <button
                  type="button"
                  className="text-brand-500 hover:text-brand-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeValue(s.value);
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
          {restCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border bg-slate-50 text-slate-600 border-slate-200">
              +{restCount}
            </span>
          )}
        </div>
        <ChevronDown className={classNames('w-4 h-4 text-slate-400 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          role="listbox"
          id={listboxId}
          tabIndex={-1}
          onKeyDown={onListKeyDown}
          className="absolute z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden"
        >
          <div className="max-h-64 overflow-auto p-1">
            {enabledOptions.map((o, i) => {
              const checked = value.includes(o.value);
              const activeNow = i === activeIndex;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="option"
                  aria-selected={checked}
                  ref={(el) => {
                    optionRefs.current[i] = el;
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => toggleValue(o.value)}
                  className={classNames(
                    'w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors',
                    activeNow ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50',
                    checked && 'font-bold'
                  )}
                >
                  <span className="truncate">{o.label}</span>
                  {checked ? <Check className="w-4 h-4 text-brand-600" /> : <span className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
