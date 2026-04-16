import React, { useState, useEffect } from 'react';
import { useHeaderStore } from '../../store/useHeaderStore';
import { Plus, Trash2 } from 'lucide-react';

export const Dimensions: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setTitle('维度管理', '定义全局可用的随机化分层因素', [
      { text: '开发者账户', color: 'indigo' },
      { text: '超级管理员', color: 'purple' },
      { text: '中心管理员', color: 'emerald' }
    ]);
  }, [setTitle]);

  const dimensionsData = [
    { id: 1, type: 'system', title: '性别维度', description: '通用基础人口学特征', icon: 'ri-men-line', iconBg: 'bg-blue-50 text-blue-600', badge: '系统内置', badgeBg: 'bg-brand-600', options: ['男', '女'], references: 5, shared: true },
    { id: 2, type: 'system', title: '年龄分层', description: '青少年年龄标准分层', icon: 'ri-calendar-2-line', iconBg: 'bg-purple-50 text-purple-600', badge: '系统内置', badgeBg: 'bg-brand-600', options: ['4-7岁', '7-10岁', '10-13岁'], references: 5, shared: true },
    { id: 3, type: 'system', title: '屈光度', description: '近视程度分层', icon: 'ri-eye-line', iconBg: 'bg-orange-50 text-orange-600', badge: '系统内置', badgeBg: 'bg-brand-600', options: ['-1.25 ~ -1.00D', '-1.00 ~ 0.00D', '0.00 ~ +1.00D'], fontMono: true, references: 5, shared: true },
    { id: 4, type: 'custom', title: '眼压范围', description: '自定义眼压分层', icon: 'ri-flask-line', iconBg: 'bg-cyan-50 text-cyan-600', badge: '中心自定义', badgeBg: 'bg-cyan-500', options: ['10-15', '15-21', '>21'], references: 0, shared: false, status: 'reviewing', statusClass: 'bg-blue-50 text-blue-600 border-blue-100', statusText: '审核中' },
    { id: 5, type: 'custom', title: '用药史', description: '既往用药情况', icon: 'ri-capsule-line', iconBg: 'bg-cyan-50 text-cyan-600', badge: '中心自定义', badgeBg: 'bg-cyan-500', options: ['无', '阿托品', '其他'], references: 0, shared: false, status: 'rejected', statusClass: 'bg-red-50 text-red-600 border-red-100', statusText: '审核失败' },
    { id: 6, type: 'custom', title: '配镜类型', description: '当前配戴眼镜类型', icon: 'ri-book-line', iconBg: 'bg-cyan-50 text-cyan-600', badge: '中心自定义', badgeBg: 'bg-cyan-500', options: ['框架眼镜', '角膜塑形镜'], references: 2, shared: false, status: 'approved', statusClass: 'bg-emerald-50 text-emerald-600 border-emerald-100', statusText: '审核通过' }
  ];

  const filteredDimensions = dimensionsData.filter(dim => filter === 'all' || dim.type === filter);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex bg-slate-100/50 p-1 rounded-xl border border-slate-200/60 w-full sm:w-auto">
          {[
            { value: 'all', label: '全部' },
            { value: 'system', label: '系统维度' },
            { value: 'custom', label: '自定义维度' },
          ].map(f => (
            <button
              key={f.value}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f.value ? 'bg-white text-brand-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all active:scale-95 w-full sm:w-auto justify-center">
          <Plus className="w-4 h-4" /> 新增维度
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDimensions.map(dim => (
          <div key={dim.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 px-3 py-1 text-white text-xs font-bold shadow rounded-bl-xl ${dim.badgeBg}`}>
              {dim.badge}
            </div>

            <div className="flex justify-between items-start mb-4 mt-2">
              <section className="flex items-center gap-3">
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${dim.iconBg}`}>
                  <i className={`${dim.icon} text-xl`}></i>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                    {dim.title}
                    {dim.status && (
                      <span className={`px-1.5 h-5 flex justify-center items-center rounded text-[10px] font-bold border ${dim.statusClass}`}>
                        {dim.statusText}
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-400">{dim.description}</p>
                </div>
              </section>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4 min-h-[64px]">
              <div className="flex flex-wrap gap-2">
                {dim.options.map((opt, i) => (
                  <span key={i} className={`px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg shadow-sm ${dim.fontMono ? 'font-mono' : ''}`}>
                    {opt}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <section className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${dim.references > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                <span className="text-xs font-medium text-slate-500">被 <span className="text-slate-700 font-bold">{dim.references}</span> 个项目引用</span>
              </section>
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer mr-2">
                  <input type="checkbox" className="sr-only peer" defaultChecked={dim.shared} disabled={dim.type === 'system'} />
                  <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand-600 peer-disabled:opacity-50"></div>
                  <span className="ml-2 text-xs font-medium text-slate-500">共享</span>
                </label>
                <div className="w-px h-4 bg-slate-200 mx-1"></div>
                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
