import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHeaderStore } from '../../store/useHeaderStore';
import { Edit2, Search, Trash2, UserPlus } from 'lucide-react';
import { ORG_OPTIONS } from '@/pages/users/constants';
import { useUsersStore } from '@/store/useUsersStore';

export const Users: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);
  const navigate = useNavigate();
  const [orgFilter, setOrgFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const users = useUsersStore(state => state.users);

  useEffect(() => {
    setTitle('用户管理', '维护系统用户、组织归属与角色权限', [
      { text: '开发者账户', color: 'indigo' },
      { text: '超级管理员', color: 'purple' }
    ]);
  }, [setTitle]);

  const filteredUsers = users.filter(user => {
    return (
      (orgFilter === '' || user.org.includes(orgFilter)) &&
      (nameFilter === '' || user.name.includes(nameFilter) || user.account.includes(nameFilter)) &&
      (phoneFilter === '' || user.phone.includes(phoneFilter))
    );
  });

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-4 lg:gap-0">
          <div className="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-3 lg:pr-6">
            <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <select
                  value={orgFilter}
                  onChange={(e) => setOrgFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="">全部组织</option>
                  {ORG_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="输入姓名、账号进行查询"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="输入手机号"
                  value={phoneFilter}
                  onChange={(e) => setPhoneFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 shrink-0">
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

          <div className="hidden lg:block self-stretch w-px bg-slate-200"></div>

          <div className="flex items-end justify-end lg:pl-6">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition-all"
              onClick={() => navigate('/index/users/create')}
            >
              <UserPlus className="w-4 h-4" /> 新增用户
            </button>
          </div>
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
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={[
                          'w-9 h-9 rounded-2xl border border-slate-200 flex items-center justify-center text-xs font-black',
                          user.avatarBgClass ?? 'bg-slate-50',
                          user.avatarTextClass ?? 'text-slate-400'
                        ].join(' ')}
                      >
                        {user.avatarText || 'A'}
                      </div>
                      <div className="font-bold text-slate-800">{user.name}</div>
                    </div>
                  </td>
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
