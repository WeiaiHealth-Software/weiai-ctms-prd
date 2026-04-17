import React, { useState, useEffect } from 'react';
import { useHeaderStore } from '../../store/useHeaderStore';
import { Plus, RefreshCw, ShieldAlert, Smartphone } from 'lucide-react';

const PERMISSION_MODULES = [
  {
    id: 'project',
    name: '项目管理',
    permissions: [
      { id: 'project_view', label: '查看' },
      { id: 'project_create', label: '新增' },
      { id: 'project_edit', label: '编辑' },
      { id: 'project_delete', label: '删除' },
      { id: 'project_import', label: '导入' },
      { id: 'project_export', label: '导出' }
    ]
  },
  {
    id: 'dimension',
    name: '维度管理',
    permissions: [
      { id: 'dim_view', label: '查看' },
      { id: 'dim_create', label: '新增' },
      { id: 'dim_edit', label: '编辑' },
      { id: 'dim_delete', label: '删除' }
    ]
  },
  {
    id: 'department',
    name: '科室管理',
    permissions: [
      { id: 'dept_view', label: '查看' },
      { id: 'dept_create', label: '新增' },
      { id: 'dept_delete', label: '删除' }
    ]
  },
  {
    id: 'center',
    name: '中心管理',
    permissions: [
      { id: 'center_view', label: '查看' },
      { id: 'center_create', label: '新增' },
      { id: 'center_edit', label: '编辑' },
      { id: 'center_delete', label: '删除' }
    ]
  },
  {
    id: 'user',
    name: '用户管理',
    permissions: [
      { id: 'user_view', label: '查看' },
      { id: 'user_create', label: '新增' },
      { id: 'user_edit', label: '编辑' },
      { id: 'user_reset', label: '重置密码' }
    ]
  },
  {
    id: 'role',
    name: '角色管理',
    permissions: [
      { id: 'role_view', label: '查看' },
      { id: 'role_create', label: '新增' },
      { id: 'role_edit', label: '编辑' },
      { id: 'role_assign', label: '分配权限' }
    ]
  }
];

export const Roles: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);
  const [activeRole, setActiveRole] = useState('superadmin');
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setTitle('角色权限控制', '管理系统角色与功能权限', [
      { text: '开发者账户', color: 'indigo' },
      { text: '超级管理员', color: 'purple' }
    ]);
  }, [setTitle]);

  const roles = [
    { id: 'superadmin', name: '超级管理员', desc: '拥有系统所有功能的操作权限', hasShield: true },
    { id: 'dev', name: '开发者', desc: '系统维护与开发人员', hasShield: true },
    { id: 'centeradmin', name: '中心管理员', desc: '负责管理分中心事务与人员' },
    { id: 'pi', name: '主要研究者 (PI)', desc: '负责项目临床研究执行与管理' },
    { id: 'crc', name: 'CRC 协调员', desc: '协助研究者进行非医学性事务' },
    { id: 'mfr', name: '厂家', desc: '配置厂家角色的账号不能登录 Web ...', hasPhone: true }
  ];

  const currentRole = roles.find(r => r.id === activeRole) || roles[0];

  const renderSuperAdminState = () => (
    <div className="flex-1 flex items-center justify-center bg-slate-50/30 p-8">
      <div className="w-full max-w-4xl border border-slate-200 border-dashed rounded-2xl bg-slate-50/50 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-6 border border-amber-100 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-slate-800 tracking-wide mb-2">最高权限账户</h3>
        <p className="text-sm text-slate-500">当前角色拥有系统的所有操作权限，无需单独配置。</p>
      </div>
    </div>
  );

  const renderPermissionMatrix = () => (
    <div className="flex-1 overflow-y-auto p-8 bg-white">
      <div className="max-w-5xl space-y-8">
        {PERMISSION_MODULES.map(module => (
          <div key={module.id}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-brand-500 rounded-full"></div>
              <h4 className="font-bold text-slate-800 text-base tracking-wide">{module.name}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pl-3">
              {module.permissions.map(perm => (
                <label 
                  key={perm.id} 
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                    isEditMode ? 'hover:border-brand-200 hover:bg-brand-50/30' : 'opacity-80'
                  } ${
                    activeRole === 'centeradmin' && ['project_view', 'project_create', 'center_view', 'center_edit', 'user_view', 'user_create'].includes(perm.id)
                      ? 'border-slate-200 bg-slate-50' 
                      : 'border-slate-100 bg-white'
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="peer appearance-none w-4 h-4 border border-slate-300 rounded checked:bg-brand-500 checked:border-brand-500 transition-all cursor-pointer disabled:cursor-not-allowed"
                      checked={activeRole === 'centeradmin' && ['project_view', 'project_create', 'center_view', 'center_edit', 'user_view', 'user_create'].includes(perm.id)}
                      readOnly={!isEditMode}
                      disabled={!isEditMode}
                    />
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-slate-600">{perm.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in h-[calc(100vh-140px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-1 overflow-hidden">
        {/* Left: Role List */}
        <div className="w-[300px] border-r border-slate-100 bg-slate-50/30 flex flex-col flex-shrink-0">
          <div className="p-5">
            <button className="w-full flex justify-center bg-brand-600 hover:bg-brand-700 text-white px-5 py-3 rounded-xl shadow-lg shadow-brand-500/30 items-center gap-2 transition-all font-bold active:scale-[0.98]">
              <Plus className="w-4 h-4" /> 创建角色
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
            {roles.map(role => (
              <div 
                key={role.id}
                onClick={() => {
                  setActiveRole(role.id);
                  setIsEditMode(false);
                }}
                className={`group flex items-start gap-3 p-4 rounded-2xl cursor-pointer transition-all relative overflow-hidden ${
                  activeRole === role.id 
                    ? 'bg-brand-50 shadow-sm border border-brand-100' 
                    : 'hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200'
                }`}
              >
                {activeRole === role.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 rounded-l-2xl"></div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-bold text-base truncate ${activeRole === role.id ? 'text-brand-800' : 'text-slate-700'}`}>
                      {role.name}
                    </h4>
                    {role.hasShield && (
                      <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    )}
                    {role.hasPhone && (
                      <Smartphone className="w-4 h-4 text-brand-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed line-clamp-2 ${activeRole === role.id ? 'text-brand-600/80' : 'text-slate-400'}`}>
                    {role.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right: Permissions */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white z-10 flex-shrink-0">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-wide">
                {currentRole.name}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {currentRole.desc}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors font-bold px-3 py-2 rounded-lg hover:bg-slate-50">
                <RefreshCw className="w-4 h-4" />
                <span>切换为{currentRole.name}</span>
              </button>
              
              {!currentRole.hasShield && (
                <button 
                  onClick={() => setIsEditMode(!isEditMode)} 
                  className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                    isEditMode 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/30' 
                      : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-500/30'
                  }`}
                >
                  {isEditMode ? '保存配置' : '编辑权限配置'}
                </button>
              )}
            </div>
          </div>
          
          {currentRole.hasShield ? renderSuperAdminState() : renderPermissionMatrix()}
        </div>
      </div>
    </div>
  );
};
