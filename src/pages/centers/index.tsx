import React, { useEffect } from 'react';
import { useHeaderStore } from '../../store/useHeaderStore';
import { Building2, Plus, Eye, Trash2 } from 'lucide-react';

export const Centers: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);

  useEffect(() => {
    setTitle('中心管理', '管理多中心临床试验的各个分中心信息', [
      { text: '开发者账户', color: 'indigo' },
      { text: '超级管理员', color: 'purple' },
      { text: '中心管理员', color: 'emerald' }
    ]);
  }, [setTitle]);

  const centers = [
    {
      id: 1,
      name: '上海眼病防治中心',
      iconClass: 'bg-blue-100 text-blue-600',
      description: '国内顶尖的眼科临床研究中心，专注于疑难眼病诊治。',
      adminName: '徐教授',
      adminAvatar: 'https://ui-avatars.com/api/?name=Dr.Wang&background=random',
      createDate: '2023-01-15'
    },
    {
      id: 2,
      name: '上海复旦大学附属五官科医院',
      iconClass: 'bg-emerald-100 text-emerald-600',
      description: '华东地区领先的眼耳鼻喉专科医院。',
      adminName: '李主任',
      adminAvatar: 'https://ui-avatars.com/api/?name=Dr.Li&background=random',
      createDate: '2023-03-22'
    }
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-end mb-4">
        <button className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-brand-500/30 flex items-center gap-2 transition-all font-bold">
          <Plus className="w-4 h-4" /> 新增中心
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
              <th className="px-6 py-4 font-bold">中心名称</th>
              <th className="px-6 py-4 font-bold">中心描述</th>
              <th className="px-6 py-4 font-bold">中心管理员</th>
              <th className="px-6 py-4 font-bold">创建时间</th>
              <th className="px-6 py-4 font-bold text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {centers.map((center) => (
              <tr key={center.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${center.iconClass}`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  {center.name}
                </td>
                <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{center.description}</td>
                <td className="px-6 py-4 text-slate-800 font-medium">
                  <div className="flex items-center gap-2 bg-slate-50 w-fit px-2 py-1 rounded-lg border border-slate-100">
                    <img src={center.adminAvatar} className="w-6 h-6 rounded-md" alt={center.adminName} />
                    <span className="text-xs font-bold">{center.adminName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-400 font-mono text-xs">{center.createDate}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors" title="查看详情">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="删除">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
