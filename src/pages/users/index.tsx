import React, { useState, useEffect } from 'react';
import { useHeaderStore } from '../../store/useHeaderStore';
import { Search, ShieldAlert, UserPlus, Edit2, Trash2 } from 'lucide-react';

export const Users: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);
  const [orgFilter, setOrgFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');

  useEffect(() => {
    setTitle('用户管理', '维护系统用户、组织归属与角色权限', [
      { text: '开发者账户', color: 'indigo' },
      { text: '超级管理员', color: 'purple' }
    ]);
  }, [setTitle]);

  const usersData = [
    { id: 1, name: '王伟', account: 'wangwei_admin', phone: '13800138000', org: '北京协和医院', orgClass: 'bg-indigo-50 text-indigo-600 border-indigo-100', role: '系统管理员', roleClass: 'bg-emerald-50 text-emerald-600 border-emerald-100', createdAt: '2023-01-10' },
    { id: 2, name: '李静', account: 'lijing_crc', phone: '13800138001', org: '北京协和医院', orgClass: 'bg-indigo-50 text-indigo-600 border-indigo-100', role: 'CRC协调员', roleClass: 'bg-amber-50 text-amber-600 border-amber-100', createdAt: '2023-01-12' },
    { id: 3, name: '张强', account: 'zhangqiang_doc', phone: '13900139000', org: '上海五官科医院', orgClass: 'bg-sky-50 text-sky-600 border-sky-100', role: '主研医生', roleClass: 'bg-emerald-50 text-emerald-600 border-emerald-100', createdAt: '2023-02-01' },
    { id: 4, name: '周敏', account: 'zhoumin_nurse', phone: '13900139001', org: '上海五官科医院', orgClass: 'bg-sky-50 text-sky-600 border-sky-100', role: '研究护士', roleClass: 'bg-slate-50 text-slate-600 border-slate-100', createdAt: '2023-02-03' },
    { id: 5, name: '刘洋', account: 'liuyang_admin', phone: '13700137000', org: '上海眼病防治中心', orgClass: 'bg-emerald-50 text-emerald-600 border-emerald-100', role: '中心管理员', roleClass: 'bg-emerald-50 text-emerald-600 border-emerald-100', createdAt: '2023-03-01' },
    { id: 6, name: '赵磊', account: 'zhaolei_doc', phone: '13700137001', org: '上海眼病防治中心', orgClass: 'bg-emerald-50 text-emerald-600 border-emerald-100', role: '主要研究者', roleClass: 'bg-emerald-50 text-emerald-600 border-emerald-100', createdAt: '2023-03-05' }
  ];

  const filteredUsers = usersData.filter(user => {
    return (
      (orgFilter === '' || user.org.includes(orgFilter)) &&
      (nameFilter === '' || user.name.includes(nameFilter)) &&
      (phoneFilter === '' || user.phone.includes(phoneFilter))
    );
  });

  return (
    <div className="animate-fade-in space-y-6">
      {/* 搜索与筛选区域 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">所属组织</label>
              <select 
                value={orgFilter}
                onChange={(e) => setOrgFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="">全部组织</option>
                <option value="协和">北京协和医院</option>
                <option value="五官科">上海复旦大学附属五官科医院</option>
                <option value="眼病防治">上海眼病防治中心</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">姓名</label>
              <input 
                type="text" 
                placeholder="输入姓名关键字"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">手机号</label>
              <input 
                type="text" 
                placeholder="输入手机号"
                value={phoneFilter}
                onChange={(e) => setPhoneFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500" 
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setOrgFilter(''); setNameFilter(''); setPhoneFilter(''); }} 
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
            >
              重置
            </button>
            <button className="px-5 py-2 rounded-xl bg-brand-600 text-sm font-bold text-white hover:bg-brand-700 shadow-sm flex items-center gap-2">
              <Search className="w-4 h-4" /> 筛选
            </button>
          </div>
        </div>
      </div>

      {/* 快捷操作区域 */}
      <div className="flex justify-end">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-all bg-white">
            <ShieldAlert className="w-4 h-4" /> 密码规则配置
          </button>
          <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition-all">
            <UserPlus className="w-4 h-4" /> 新增用户
          </button>
        </div>
      </div>

      {/* 数据表格区域 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">姓名</th>
                <th className="px-6 py-4 font-semibold">账号</th>
                <th className="px-6 py-4 font-semibold">手机号</th>
                <th className="px-6 py-4 font-semibold">所属组织</th>
                <th className="px-6 py-4 font-semibold">角色</th>
                <th className="px-6 py-4 font-semibold">创建时间</th>
                <th className="px-6 py-4 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{user.name}</td>
                  <td className="px-6 py-4 text-slate-600">{user.account}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono">{user.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${user.orgClass}`}>
                      {user.org}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${user.roleClass}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-mono">{user.createdAt}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-brand-600 hover:text-brand-700 transition-colors p-1" title="编辑">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-slate-400 hover:text-red-600 transition-colors p-1" title="删除">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    没有找到符合条件的用户
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
