import React, { useState, useEffect } from 'react';
import { useHeaderStore } from '../../store/useHeaderStore';
import { Plus } from 'lucide-react';

export const Departments: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);
  const [deptName, setDeptName] = useState('');

  useEffect(() => {
    setTitle('科室管理', '定义项目关联的临床科室', [
      { text: '开发者账户', color: 'indigo' },
      { text: '超级管理员', color: 'purple' }
    ]);
  }, [setTitle]);

  const departments = [
    { name: '心内科', icon: 'ri-heart-pulse-line', colorClass: 'bg-red-50 text-red-600 border-red-100' },
    { name: '眼科', icon: 'ri-eye-line', colorClass: 'bg-amber-50 text-amber-600 border-amber-100' },
    { name: '检验科', icon: 'ri-microscope-line', colorClass: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { name: '药学部', icon: 'ri-capsule-line', colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { name: '内科', icon: 'ri-hospital-line', colorClass: 'bg-slate-50 text-slate-600 border-slate-200' },
    { name: '外科', icon: 'ri-hospital-line', colorClass: 'bg-slate-50 text-slate-600 border-slate-200' },
    { name: '神经内科', icon: 'ri-hospital-line', colorClass: 'bg-purple-50 text-purple-600 border-purple-100' },
    { name: '呼吸医学科', icon: 'ri-hospital-line', colorClass: 'bg-orange-50 text-orange-600 border-orange-100' },
    { name: '妇产科', icon: 'ri-hospital-line', colorClass: 'bg-pink-50 text-pink-600 border-pink-100' },
    { name: '急诊医学科', icon: 'ri-hospital-line', colorClass: 'bg-teal-50 text-teal-600 border-teal-100' }
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-start mb-6">
        <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-sm w-full max-w-2xl">
          <div className="relative">
            <button className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 flex items-center gap-2 hover:bg-slate-100 transition-colors">
              <span className="w-8 h-8 rounded-lg bg-white shadow-sm text-slate-600 flex items-center justify-center border border-slate-100">
                <i className="ri-hospital-line text-lg"></i>
              </span>
              <span className="text-xs font-bold">选择图标</span>
            </button>
          </div>
          <input 
            type="text" 
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
            placeholder="输入科室名称..."
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
          />
          <button className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2">
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
