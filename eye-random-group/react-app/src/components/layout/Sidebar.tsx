import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Shuffle, 
  Folders, 
  SlidersHorizontal, 
  Building2, 
  Hospital, 
  ShieldCheck, 
  Users, 
  Database,
  RefreshCw,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import classNames from 'classnames';

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [iwrsOpen, setIwrsOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { path: '/index', icon: <LayoutDashboard size={20} />, label: 'Dashboard 仪表盘' },
  ];

  const iwrsItems = [
    { path: '/index/projects', icon: <Folders size={20} />, label: '项目管理' },
    { path: '/index/dimensions', icon: <SlidersHorizontal size={20} />, label: '维度管理' },
  ];

  const otherItems = [
    { path: '/index/departments', icon: <Hospital size={20} />, label: '科室管理' },
    { path: '/index/centers', icon: <Building2 size={20} />, label: '中心管理' },
    { path: '/index/roles', icon: <ShieldCheck size={20} />, label: '角色管理' },
    { path: '/index/users', icon: <Users size={20} />, label: '用户管理' },
  ];

  return (
    <aside className={classNames(
      "bg-white border-r border-slate-200 flex flex-col shadow-sm z-50 transition-all duration-300",
      collapsed ? "w-20" : "w-72"
    )}>
      <div className="relative h-20 flex items-center px-6 border-b border-slate-100 overflow-hidden whitespace-nowrap">
        <div className="w-8 h-8 min-w-[2rem] rounded-lg flex items-center justify-center mr-3 bg-brand-600 text-white font-bold flex-shrink-0">
          {/* 这里可以放 Logo SVG，暂时用文字代替 */}
          W
        </div>
        {!collapsed && (
          <div className="flex flex-col gap-2 origin-left animate-fade-in">
            <h1 className="font-bold text-lg tracking-wide text-slate-800">惟翎 · 科研管理系统</h1>
          </div>
        )}
      </div>

      <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto overflow-x-hidden no-scrollbar">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) => classNames(
              "flex items-center px-4 py-3 rounded-xl transition-all group font-medium whitespace-nowrap overflow-hidden",
              isActive ? "bg-brand-50 text-brand-600" : "text-slate-600 hover:bg-slate-50 hover:text-brand-600"
            )}
          >
            <span className={classNames("flex-shrink-0", location.pathname === item.path ? "text-brand-600" : "text-slate-400 group-hover:text-brand-500")}>
              {item.icon}
            </span>
            {!collapsed && <span className="ml-3 origin-left animate-fade-in">{item.label}</span>}
          </NavLink>
        ))}

        <div className="space-y-1">
          <button
            onClick={() => setIwrsOpen(!iwrsOpen)}
            className="w-full flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-xl transition-all group font-medium whitespace-nowrap overflow-hidden"
          >
            <span className="text-slate-400 group-hover:text-brand-500 flex-shrink-0">
              <Shuffle size={20} />
            </span>
            {!collapsed && (
              <>
                <span className="ml-3 flex-1 text-left animate-fade-in">IWRS 中央随机化</span>
                <span className={classNames("transition-transform duration-300", iwrsOpen ? "rotate-180" : "")}>
                  <ChevronDown size={16} />
                </span>
              </>
            )}
          </button>
          
          {iwrsOpen && !collapsed && (
            <div className="pl-4 space-y-1 animate-fade-in">
              {iwrsItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => classNames(
                    "flex items-center px-4 py-3 rounded-xl transition-all group font-medium whitespace-nowrap overflow-hidden",
                    isActive ? "bg-brand-50 text-brand-600" : "text-slate-600 hover:bg-slate-50 hover:text-brand-600"
                  )}
                >
                  <span className={classNames("flex-shrink-0", location.pathname.includes(item.path) ? "text-brand-600" : "text-slate-400 group-hover:text-brand-500")}>
                    {item.icon}
                  </span>
                  <span className="ml-3">{item.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {otherItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => classNames(
              "flex items-center px-4 py-3 rounded-xl transition-all group font-medium whitespace-nowrap overflow-hidden",
              isActive ? "bg-brand-50 text-brand-600" : "text-slate-600 hover:bg-slate-50 hover:text-brand-600"
            )}
          >
            <span className={classNames("flex-shrink-0", location.pathname.includes(item.path) ? "text-brand-600" : "text-slate-400 group-hover:text-brand-500")}>
              {item.icon}
            </span>
            {!collapsed && <span className="ml-3 origin-left animate-fade-in">{item.label}</span>}
          </NavLink>
        ))}

        <div className="my-2 border-b border-slate-200"></div>
        <NavLink
          to="/edc"
          className="flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-xl transition-all group font-medium whitespace-nowrap overflow-hidden"
        >
          <span className="text-slate-400 group-hover:text-brand-500 flex-shrink-0">
            <Database size={20} />
          </span>
          {!collapsed && <span className="ml-3 origin-left animate-fade-in">惟爱医疗软件架构</span>}
        </NavLink>
      </nav>

      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between overflow-hidden">
        {!collapsed && (
          <div className="flex items-center justify-center gap-3 group cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-8 h-8 min-w-[2rem] rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-brand-600 group-hover:border-brand-200 transition-all shadow-sm">
              <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-700" />
            </div>
            <div className="whitespace-nowrap animate-fade-in">
              <p className="text-xs font-bold text-slate-600 font-mono">v1.0.0</p>
              <p className="text-[10px] text-slate-400 font-mono">react-migrated</p>
            </div>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="text-slate-400 hover:text-brand-600 transition-colors p-1.5 rounded-md hover:bg-slate-100 flex-shrink-0 ml-auto"
          title={collapsed ? "展开侧边栏" : "收起侧边栏"}
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>
    </aside>
  );
};
