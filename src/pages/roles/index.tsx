import React, { useState, useEffect } from 'react';
import { useHeaderStore } from '../../store/useHeaderStore';
import { Plus, RefreshCw, Settings, Trash2 } from 'lucide-react';

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
    { id: 'superadmin', name: '超级管理员', count: 2, active: true },
    { id: 'centeradmin', name: '中心管理员', count: 5, active: false },
    { id: 'pi', name: '主要研究者 (PI)', count: 12, active: false },
    { id: 'crc', name: 'CRC 协调员', count: 48, active: false },
    { id: 'cra', name: 'CRA 监查员', count: 15, active: false }
  ];

  return (
    <div className="animate-fade-in h-[calc(100vh-140px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-1 overflow-hidden">
        {/* Left: Role List */}
        <div className="w-72 border-r border-slate-100 bg-slate-50/50 flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <button className="w-full flex justify-center bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-brand-500/30 items-center gap-2 transition-all font-bold">
              <Plus className="w-4 h-4" /> 创建角色
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {roles.map(role => (
              <div 
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                  activeRole === role.id 
                    ? 'bg-brand-50 border border-brand-100 shadow-sm' 
                    : 'hover:bg-white hover:border hover:border-slate-200 border border-transparent'
                }`}
              >
                <div>
                  <h4 className={`font-bold text-sm ${activeRole === role.id ? 'text-brand-700' : 'text-slate-700'}`}>
                    {role.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{role.count} 名用户</p>
                </div>
                {activeRole === role.id && (
                  <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Right: Permissions */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-sm sticky top-0 z-10">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {roles.find(r => r.id === activeRole)?.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {activeRole === 'superadmin' ? '拥有系统所有功能的操作权限' : '自定义配置的角色权限'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors font-medium">
                <RefreshCw className="w-4 h-4" />
                <span>切换为该角色</span>
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1"></div>
              {activeRole !== 'superadmin' && (
                <button className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={() => setIsEditMode(!isEditMode)} 
                className={`px-5 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                  isEditMode 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/30' 
                    : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-500/30'
                }`}
              >
                {isEditMode ? '保存配置' : <><Settings className="w-4 h-4" /> 编辑权限配置</>}
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
            <div className="max-w-3xl space-y-8">
              {/* 权限模块 1 */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-sm">项目管理模块</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500" checked={true} readOnly={!isEditMode} />
                    <span className="text-xs text-slate-500">全选</span>
                  </label>
                </div>
                <div className="p-5 grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                    <input type="checkbox" className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500" checked={true} readOnly={!isEditMode} />
                    <div>
                      <p className="text-sm font-bold text-slate-700">查看项目列表</p>
                      <p className="text-xs text-slate-400 mt-0.5">允许访问项目管理首页</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                    <input type="checkbox" className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500" checked={true} readOnly={!isEditMode} />
                    <div>
                      <p className="text-sm font-bold text-slate-700">新建项目</p>
                      <p className="text-xs text-slate-400 mt-0.5">允许创建全新的研究项目</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                    <input type="checkbox" className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500" checked={true} readOnly={!isEditMode} />
                    <div>
                      <p className="text-sm font-bold text-slate-700">编辑项目设置</p>
                      <p className="text-xs text-slate-400 mt-0.5">修改现有项目的配置信息</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                    <input type="checkbox" className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500" checked={activeRole === 'superadmin'} readOnly={!isEditMode} />
                    <div>
                      <p className="text-sm font-bold text-slate-700">删除项目</p>
                      <p className="text-xs text-slate-400 mt-0.5">永久删除项目及关联数据</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* 权限模块 2 */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-sm">受试者管理</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500" checked={activeRole !== 'centeradmin'} readOnly={!isEditMode} />
                    <span className="text-xs text-slate-500">全选</span>
                  </label>
                </div>
                <div className="p-5 grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                    <input type="checkbox" className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500" checked={true} readOnly={!isEditMode} />
                    <div>
                      <p className="text-sm font-bold text-slate-700">录入受试者</p>
                      <p className="text-xs text-slate-400 mt-0.5">新建受试者档案并随机化</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                    <input type="checkbox" className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500" checked={activeRole === 'superadmin' || activeRole === 'pi'} readOnly={!isEditMode} />
                    <div>
                      <p className="text-sm font-bold text-slate-700">破盲操作</p>
                      <p className="text-xs text-slate-400 mt-0.5">紧急情况下的破盲权限</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
