import React from 'react';
import classNames from 'classnames';

export interface ProjectCardProps {
  code: string;
  status: '进行中' | '已结束';
  title: string;
  date: string;
  description: string;
  currentCount: number;
  totalCount: number;
  themeColor: 'brand' | 'indigo';
  isFission?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  code,
  status,
  title,
  date,
  description,
  currentCount,
  totalCount,
  themeColor,
  isFission = false,
  onClick,
  onDelete
}) => {
  const percent = Math.min(100, Math.round((currentCount / totalCount) * 100));

  return (
    <div
      onClick={onClick}
      className="min-w-[320px] bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden"
    >
      {/* 裂变项目特殊背景光晕装饰 */}
      {isFission && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200 blur-3xl opacity-50 pointer-events-none rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
      )}

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <span className={classNames(
            "px-2.5 py-1 text-xs font-bold rounded-md border tracking-wider",
            themeColor === 'brand' 
              ? "bg-brand-50 text-brand-600 border-brand-100" 
              : "bg-indigo-50 text-indigo-600 border-indigo-100"
          )}>
            {code}
          </span>
          {isFission && (
            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded flex items-center border border-indigo-200">
              <span className="mr-1">⎇</span> 裂变
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {status === '进行中' ? (
            <>
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="flex justify-center items-center gap-2 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded border border-emerald-200">
                {status}
              </span>
            </>
          ) : (
            <>
              <span className="flex h-3 w-3 relative">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-300"></span>
              </span>
              <span className="flex justify-center items-center gap-2 px-2 py-1 bg-slate-50 text-slate-500 text-xs font-bold rounded border border-slate-200">
                {status}
              </span>
            </>
          )}
        </div>
      </div>

      <h3 className={classNames(
        "text-xl font-bold text-slate-800 mb-2 transition-colors relative z-10",
        themeColor === 'brand' ? "group-hover:text-brand-600" : "group-hover:text-indigo-600"
      )}>
        {title}
      </h3>
      
      <p className="text-slate-400 text-sm mb-2 line-clamp-2 relative z-10">{date}</p>
      
      <p className="text-slate-500 text-sm mb-6 line-clamp-2 relative z-10">
        {description}
      </p>

      {/* 进度条区域 */}
      <div className="mb-6 relative z-10">
        <div className="flex justify-between text-xs mb-1.5 font-medium">
          <span className="text-slate-500">参与人数</span>
          <span className={themeColor === 'brand' ? 'text-brand-600' : 'text-indigo-600'}>
            {currentCount} <span className="text-slate-400">/ {totalCount}</span>
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className={classNames("h-2.5 rounded-full transition-all duration-1000", themeColor === 'brand' ? 'bg-brand-500' : 'bg-indigo-500')} 
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>

      {/* 底部 Action */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 relative z-10">
        <div className="flex -space-x-2 overflow-hidden">
          <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://ui-avatars.com/api/?name=User1&background=random" alt="" />
          <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://ui-avatars.com/api/?name=User2&background=random" alt="" />
          <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://ui-avatars.com/api/?name=User3&background=random" alt="" />
          <div className="h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-xs text-slate-500 font-bold">
            +{currentCount > 3 ? currentCount - 3 : 0}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className={classNames("p-2 rounded-lg transition-colors", 
              themeColor === 'brand' 
                ? "text-brand-500 hover:text-brand-700 hover:bg-brand-50" 
                : "text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <span className="font-bold">→</span>
          </button>
          <div className="w-px h-4 bg-slate-200 mx-1"></div>
          <button 
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
          >
            <span className="font-bold">🗑</span>
          </button>
        </div>
      </div>
    </div>
  );
};
