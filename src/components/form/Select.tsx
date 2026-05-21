import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { classNames } from '@/lib/classNames';

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = {
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
};

export default function Select({
  value,
  onChange,
  options,
  placeholder = '请选择',
  disabled,
  className,
  triggerClassName
}: SelectProps) {
  const triggerId = useId();
  const listboxId = useMemo(() => `${triggerId}-listbox`, [triggerId]);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const selected = useMemo(
    () => (value ? options.find(o => o.value === value) : undefined),
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
    const selectedIndex = value ? enabledOptions.findIndex(o => o.value === value) : -1;
    const nextIndex = selectedIndex >= 0 ? selectedIndex : 0;
    setActiveIndex(nextIndex);
    requestAnimationFrame(() => {
      optionRefs.current[nextIndex]?.focus();
    });
  }, [enabledOptions, open, value]);

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
      if (next) {
        onChange?.(next.value);
        setOpen(false);
      }
      return;
    }
  };

  useEffect(() => {
    if (!open) return;
    optionRefs.current[activeIndex]?.focus();
  }, [activeIndex, open]);

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
          'w-full h-11 rounded-xl border border-slate-200 px-3 text-sm bg-white text-left flex items-center justify-between gap-3',
          'outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500',
          disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'hover:bg-slate-50',
          triggerClassName
        )}
      >
        <span className={classNames('truncate', selected ? 'text-slate-700' : 'text-slate-400')}>
          {selected ? selected.label : placeholder}
        </span>
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
              const selectedNow = o.value === value;
              const activeNow = i === activeIndex;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="option"
                  aria-selected={selectedNow}
                  ref={(el) => {
                    optionRefs.current[i] = el;
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => {
                    onChange?.(o.value);
                    setOpen(false);
                  }}
                  className={classNames(
                    'w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors',
                    activeNow ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50',
                    selectedNow && 'font-bold'
                  )}
                >
                  <span className="truncate">{o.label}</span>
                  {selectedNow && <Check className="w-4 h-4 text-brand-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
