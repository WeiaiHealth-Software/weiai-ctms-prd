import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHeaderStore } from '../../store/useHeaderStore';
import { Plus } from 'lucide-react';

const COLOR_OPTIONS = [
  { key: 'blue', label: '蓝色', className: 'bg-blue-50 text-blue-600 border-blue-100' },
  { key: 'amber', label: '黄色', className: 'bg-amber-50 text-amber-600 border-amber-100' },
  { key: 'orange', label: '橙色', className: 'bg-orange-50 text-orange-600 border-orange-100' },
  { key: 'emerald', label: '绿色', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { key: 'purple', label: '紫色', className: 'bg-purple-50 text-purple-600 border-purple-100' },
  { key: 'red', label: '红色', className: 'bg-red-50 text-red-600 border-red-100' },
  { key: 'slate', label: '灰色', className: 'bg-slate-50 text-slate-600 border-slate-200' }
] as const;

const ICON_OPTIONS = [
  { icon: 'ri-hospital-line', label: '医院' },
  { icon: 'ri-heart-pulse-line', label: '心脏' },
  { icon: 'ri-eye-line', label: '眼科' },
  { icon: 'ri-microscope-line', label: '检验' },
  { icon: 'ri-capsule-line', label: '药学' },
  { icon: 'ri-brain-line', label: '神经' },
  { icon: 'ri-lungs-line', label: '呼吸' },
  { icon: 'ri-women-line', label: '妇产' },
  { icon: 'ri-first-aid-kit-line', label: '急诊' }
];

export const Departments: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);
  const [deptName, setDeptName] = useState('');
  const [departments, setDepartments] = useState([
    { name: '心内科', icon: 'ri-heart-pulse-line', colorClass: 'bg-red-50 text-red-600 border-red-100' },
    { name: '眼科', icon: 'ri-eye-line', colorClass: 'bg-amber-50 text-amber-600 border-amber-100' },
    { name: '检验科', icon: 'ri-microscope-line', colorClass: 'bg-blue-50 text-blue-600 border-blue-100' },
    { name: '药学部', icon: 'ri-capsule-line', colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { name: '内科', icon: 'ri-hospital-line', colorClass: 'bg-slate-50 text-slate-600 border-slate-200' },
    { name: '外科', icon: 'ri-hospital-line', colorClass: 'bg-slate-50 text-slate-600 border-slate-200' },
    { name: '神经内科', icon: 'ri-brain-line', colorClass: 'bg-purple-50 text-purple-600 border-purple-100' },
    { name: '呼吸医学科', icon: 'ri-lungs-line', colorClass: 'bg-orange-50 text-orange-600 border-orange-100' },
    { name: '妇产科', icon: 'ri-women-line', colorClass: 'bg-amber-50 text-amber-600 border-amber-100' },
    { name: '急诊医学科', icon: 'ri-first-aid-kit-line', colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
  ]);
  
  const [createOpen, setCreateOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [iconOpen, setIconOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0]);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const colorRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLDivElement | null>(null);

  const selectedColorDot = useMemo(() => {
    const map: Record<string, string> = {
      blue: 'bg-blue-600',
      amber: 'bg-amber-500',
      orange: 'bg-orange-500',
      emerald: 'bg-emerald-600',
      purple: 'bg-purple-600',
      red: 'bg-red-600',
      slate: 'bg-slate-500'
    };
    return map[selectedColor.key] || 'bg-slate-500';
  }, [selectedColor.key]);

  useEffect(() => {
    if (!createOpen) return;
    setDeptName('');
    setSelectedColor(COLOR_OPTIONS[0]);
    setSelectedIcon(ICON_OPTIONS[0]);
    setColorOpen(false);
    setIconOpen(false);
  }, [createOpen]);

  useEffect(() => {
    if (!createOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (colorRef.current && !colorRef.current.contains(t)) setColorOpen(false);
      if (iconRef.current && !iconRef.current.contains(t)) setIconOpen(false);
      if (modalRef.current && !modalRef.current.contains(t)) setCreateOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCreateOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [createOpen]);

  useEffect(() => {
    setTitle('科室管理', '定义项目关联的临床科室', [
      { text: '开发者账户', color: 'indigo' },
      { text: '超级管理员', color: 'purple' }
    ]);
  }, [setTitle]);

  const handleAddDepartment = () => {
    if (!deptName.trim()) return;
    
    const newDept = {
      name: deptName.trim(),
      icon: selectedIcon.icon,
      colorClass: selectedColor.className
    };
    
    setDepartments(prev => [newDept, ...prev]);
    setCreateOpen(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl shadow-lg shadow-brand-500/30 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          新增科室
        </button>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-sm"></div>
          <div ref={modalRef} className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-visible">
            <div className="px-8 py-6 flex items-start justify-between">
              <div>
                <div className="text-xl font-black text-slate-900">新增科室</div>
                <div className="text-xs text-slate-500 mt-1">配置科室名称、颜色与图标，用于项目与组织结构关联</div>
              </div>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold text-slate-600"
              >
                关闭
              </button>
            </div>

            <div className="px-8 pb-6">
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative" ref={colorRef}>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">选择颜色</label>
                    <button
                      type="button"
                      onClick={() => {
                        setColorOpen(v => !v);
                        setIconOpen(false);
                      }}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-700 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${selectedColor.className}`}>
                          <span className={`w-4 h-4 rounded-md ${selectedColorDot}`}></span>
                        </span>
                        <span className="text-sm font-bold">{selectedColor.label}</span>
                      </div>
                      <span className="text-xs text-slate-400">▼</span>
                    </button>
                    {colorOpen && (
                      <div className="absolute top-full left-0 mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50">
                        {COLOR_OPTIONS.map(opt => {
                          const dotMap: Record<string, string> = {
                            blue: 'bg-blue-600',
                            amber: 'bg-amber-500',
                            orange: 'bg-orange-500',
                            emerald: 'bg-emerald-600',
                            purple: 'bg-purple-600',
                            red: 'bg-red-600',
                            slate: 'bg-slate-500'
                          };
                          const dot = dotMap[opt.key] || 'bg-slate-500';
                          const active = opt.key === selectedColor.key;
                          return (
                            <button
                              type="button"
                              key={opt.key}
                              onClick={() => {
                                setSelectedColor(opt as any);
                                setColorOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-2 py-2 rounded-xl hover:bg-slate-50 ${active ? 'bg-slate-50 ring-2 ring-brand-500/15' : ''}`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${opt.className}`}>
                                  <span className={`w-4 h-4 rounded-md ${dot}`}></span>
                                </span>
                                <span className="text-sm font-bold text-slate-700">{opt.label}</span>
                              </div>
                              {active && <span className="text-xs text-slate-400">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={iconRef}>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">选择图标</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIconOpen(v => !v);
                        setColorOpen(false);
                      }}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-700 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <span className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${selectedColor.className}`}>
                        <i className={`${selectedIcon.icon} text-lg`}></i>
                      </span>
                      <span className="text-xs text-slate-400">▼</span>
                    </button>
                    {iconOpen && (
                      <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 grid grid-cols-5 gap-2 max-h-56 overflow-y-auto">
                        {ICON_OPTIONS.map((opt, idx) => (
                          <button
                            type="button"
                            key={idx}
                            className={`flex items-center justify-center p-2 rounded-xl hover:bg-slate-50 transition-colors ${selectedIcon.icon === opt.icon ? 'bg-slate-50 ring-2 ring-brand-500/20' : ''}`}
                            onClick={() => {
                              setSelectedIcon(opt);
                              setIconOpen(false);
                            }}
                            title={opt.label}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${selectedColor.className}`}>
                              <i className={`${opt.icon} text-xl`}></i>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5"><span className='text-red-500 mr-2'>*</span>科室名称</label>
                  <input
                    value={deptName}
                    onChange={e => setDeptName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleAddDepartment();
                    }}
                    type="text"
                    placeholder="请输入科室名称"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500/15 focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-slate-100 bg-white flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="px-6 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleAddDepartment}
                disabled={!deptName.trim()}
                className="px-6 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-lg shadow-brand-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                确认保存
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {departments.map((dept, index) => (
          <div key={index} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className={`w-14 h-14 flex items-center justify-center rounded-2xl border ${dept.colorClass} group-hover:scale-110 transition-transform`}>
                <i className={`${dept.icon} text-2xl`}></i>
              </div>
              <h4 className="text-sm font-bold text-slate-800">{dept.name}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
