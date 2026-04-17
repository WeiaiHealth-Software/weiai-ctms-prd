import React, { useState, useEffect, useRef } from 'react';
import { useHeaderStore } from '../../store/useHeaderStore';
import { Plus } from 'lucide-react';

const ICON_OPTIONS = [
  { icon: 'ri-hospital-line', label: '默认', colorClass: 'bg-slate-50 text-slate-600 border-slate-200' },
  { icon: 'ri-heart-pulse-line', label: '心内', colorClass: 'bg-red-50 text-red-600 border-red-100' },
  { icon: 'ri-eye-line', label: '眼科', colorClass: 'bg-amber-50 text-amber-600 border-amber-100' },
  { icon: 'ri-microscope-line', label: '检验', colorClass: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  { icon: 'ri-capsule-line', label: '药学', colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { icon: 'ri-brain-line', label: '神内', colorClass: 'bg-purple-50 text-purple-600 border-purple-100' },
  { icon: 'ri-lungs-line', label: '呼吸', colorClass: 'bg-orange-50 text-orange-600 border-orange-100' },
  { icon: 'ri-women-line', label: '妇产', colorClass: 'bg-pink-50 text-pink-600 border-pink-100' },
  { icon: 'ri-first-aid-kit-line', label: '急诊', colorClass: 'bg-teal-50 text-teal-600 border-teal-100' }
];

export const Departments: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);
  const [deptName, setDeptName] = useState('');
  const [departments, setDepartments] = useState([
    { name: '心内科', icon: 'ri-heart-pulse-line', colorClass: 'bg-red-50 text-red-600 border-red-100' },
    { name: '眼科', icon: 'ri-eye-line', colorClass: 'bg-amber-50 text-amber-600 border-amber-100' },
    { name: '检验科', icon: 'ri-microscope-line', colorClass: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { name: '药学部', icon: 'ri-capsule-line', colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { name: '内科', icon: 'ri-hospital-line', colorClass: 'bg-slate-50 text-slate-600 border-slate-200' },
    { name: '外科', icon: 'ri-hospital-line', colorClass: 'bg-slate-50 text-slate-600 border-slate-200' },
    { name: '神经内科', icon: 'ri-brain-line', colorClass: 'bg-purple-50 text-purple-600 border-purple-100' },
    { name: '呼吸医学科', icon: 'ri-lungs-line', colorClass: 'bg-orange-50 text-orange-600 border-orange-100' },
    { name: '妇产科', icon: 'ri-women-line', colorClass: 'bg-pink-50 text-pink-600 border-pink-100' },
    { name: '急诊医学科', icon: 'ri-first-aid-kit-line', colorClass: 'bg-teal-50 text-teal-600 border-teal-100' }
  ]);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      colorClass: selectedIcon.colorClass
    };
    
    setDepartments(prev => [newDept, ...prev]);
    setDeptName('');
    setSelectedIcon(ICON_OPTIONS[0]);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-start mb-6">
        <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-sm w-full max-w-2xl">
          <div className="relative" ref={dropdownRef}>
            <button 
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 flex items-center gap-2 hover:bg-slate-100 transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className={`w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center border ${selectedIcon.colorClass.split(' ')[2]} ${selectedIcon.colorClass.split(' ')[1]}`}>
                <i className={`${selectedIcon.icon} text-lg`}></i>
              </span>
              <span className="text-xs font-bold">选择图标</span>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 animate-fade-in-down grid grid-cols-4 gap-2">
                {ICON_OPTIONS.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-50 transition-colors ${selectedIcon.icon === opt.icon ? 'bg-slate-50 ring-2 ring-brand-500/20' : ''}`}
                    onClick={() => {
                      setSelectedIcon(opt);
                      setIsDropdownOpen(false);
                    }}
                    title={opt.label}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${opt.colorClass}`}>
                      <i className={`${opt.icon} text-xl`}></i>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <input 
            type="text" 
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
            placeholder="输入科室名称..."
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddDepartment();
            }}
          />
          <button 
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2"
            onClick={handleAddDepartment}
            disabled={!deptName.trim()}
          >
            <Plus className="w-4 h-4" /> 添加
          </button>
        </div>
      </div>

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
