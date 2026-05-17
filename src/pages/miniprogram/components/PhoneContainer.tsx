import React from 'react';
import { ArrowLeft } from 'lucide-react';

type PhoneContainerProps = {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  onBack?: () => void;
  headerRight?: React.ReactNode;
  showMiniProgramTopBar?: boolean;
  onClose?: () => void;
  onMore?: () => void;
};

export const PhoneContainer: React.FC<PhoneContainerProps> = ({
  children,
  title,
  showHeader,
  onBack,
  headerRight,
  showMiniProgramTopBar = true,
  onClose,
  onMore,
}) => {
  const navHeight = 64;
  const chromeEnabled = showMiniProgramTopBar;
  const titleRowEnabled = showHeader ?? Boolean(title || onBack || headerRight);
  const contentTop = chromeEnabled ? navHeight : 0;

  return (
    <div className="relative w-[360px] h-[700px] bg-slate-50 rounded-[30px] border-[12px] border-slate-800 overflow-hidden shadow-2xl shrink-0">
      {chromeEnabled && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-white" style={{ height: navHeight }}>
          {/* 下边框 1px */}
          <div className="absolute left-0 right-0 flex items-center px-3 border-b border-slate-100" style={{ height: navHeight }}>
            <div className="flex items-center min-w-0 flex-1">
              {onBack && (
                <button
                  type="button"
                  aria-label="返回"
                  className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors shrink-0"
                  onClick={onBack}
                >
                  <ArrowLeft className="text-slate-700" width={20} />
                </button>
              )}
            </div>

            {titleRowEnabled && title && (
              <div
                className="absolute text-[17px] font-bold text-slate-900 text-center truncate"
                style={{ left: onBack ? 44 : 12 }}
              >
                {title}
              </div>
            )}

            <div className="ml-auto flex items-center gap-2 shrink-0">
              {titleRowEnabled && headerRight}
              <div className="flex items-center h-[32px] rounded-full border border-slate-300/80 bg-white shadow-sm overflow-hidden">
                <button
                  type="button"
                  aria-label="更多"
                  className="h-full px-3 flex items-center justify-center hover:bg-slate-50 transition-colors"
                  onClick={onMore}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-[4px] h-[4px] rounded-full bg-slate-700"></span>
                    <span className="w-[4px] h-[4px] rounded-full bg-slate-700"></span>
                    <span className="w-[4px] h-[4px] rounded-full bg-slate-700"></span>
                  </span>
                </button>
                <div className="w-px h-5 bg-slate-300/80"></div>
                <button
                  type="button"
                  aria-label="关闭"
                  className="h-full px-3 flex items-center justify-center hover:bg-slate-50 transition-colors"
                  onClick={onClose}
                >
                  <span className="w-[18px] h-[18px] rounded-full border border-slate-600/80 flex items-center justify-center">
                    <span className="relative w-[10px] h-[10px] block rounded-full bg-slate-600">
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="h-full flex flex-col">
        <div className="shrink-0" style={{ height: contentTop }} />
        <div className="flex-1 min-h-0">{children}</div>
      </div>
    </div>
  );
};
