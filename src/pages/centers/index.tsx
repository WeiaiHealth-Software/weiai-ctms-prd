import React, { useEffect } from 'react';
import { useHeaderStore } from '../../store/useHeaderStore';
import { Building2, Hospital, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CENTERS } from '../../mock/centers';

export const Centers: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);

  useEffect(() => {
    setTitle('中心管理', '管理多中心临床试验的各个分中心信息', [
      { text: '开发者账户', color: 'indigo' },
      { text: '超级管理员', color: 'purple' },
      { text: '中心管理员', color: 'emerald' }
    ]);
  }, [setTitle]);

  const centers = CENTERS.map((c, idx) => ({
    ...c,
    iconClass: idx % 2 === 0 ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
  }));

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-end mb-4">
        <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl shadow-lg shadow-brand-500/30 flex items-center gap-2 transition-all font-bold">
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
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center`}>
                    <Hospital className="w-5 h-5" />
                  </div>
                  {center.name}
                </td>
                <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{center.description}</td>
                <td className="px-6 py-4 text-slate-800 font-medium">
                  <div className="flex items-center gap-2 bg-slate-50 w-fit px-2 py-1 rounded-lg border border-slate-100">
                    <span className="text-xs font-bold">{center.adminName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-400 font-mono text-xs">{center.createdAt}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/index/centers/${center.id}`} className="cursor-pointer rounded-md px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800">
                      查看详情
                    </Link>
                    <button className="p-2 text-red-600 rounded-lg transition-colors" title="删除">
                      删除
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
