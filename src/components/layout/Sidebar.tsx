import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Shuffle, 
  Database,
  Palette,
  RefreshCw,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  ClipboardList,
  ChartNoAxesGantt
} from 'lucide-react';
import classNames from 'classnames';

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [iwrsOpen, setIwrsOpen] = useState(true);
  const [edcOpen, setEdcOpen] = useState(true);
  const [systemOpen, setSystemOpen] = useState(true);
  const location = useLocation();

  const isPathActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { path: '/index', icon: <LayoutDashboard size={20} />, label: 'Dashboard 仪表盘' },
  ];

  const iwrsItems = [
    { path: '/index/projects', label: '项目管理' },
    { path: '/index/dimensions', label: '维度管理' },
  ];

  const edcItems = [
    { path: '/index/edc/projects', label: '项目管理' },
    { path: '/index/edc/appointments', label: '预约复查管理' },
    { path: '/index/edc/templates', label: '表单样板间' },
  ];

  const systemItems = [
    { path: '/index/departments', label: '科室管理' },
    { path: '/index/centers', label: '中心管理' },
    { path: '/index/roles', label: '角色管理' },
    { path: '/index/users', label: '用户管理' },
    { path: '/index/system/logs', label: '日志管理' },
  ];

  const iwrsActive = iwrsItems.some(i => isPathActive(i.path));
  const edcActive = edcItems.some(i => isPathActive(i.path));
  const systemActive = systemItems.some(i => isPathActive(i.path));

  return (
    <aside className={classNames(
      "bg-white border-r border-slate-200 flex flex-col shadow-sm z-50 transition-all duration-300",
      collapsed ? "w-20" : "w-72"
    )}>
      <div className="relative h-20 flex items-center px-6 border-b border-slate-100 overflow-hidden whitespace-nowrap">
        <div className="w-8 h-8 min-w-[2rem] rounded-lg flex items-center justify-center mr-3 font-bold flex-shrink-0">
          <img src="weiai.svg" alt="Weiai" />
        </div>
        {!collapsed && (
          <div className="flex flex-col gap-2 origin-left">
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
            {!collapsed && <span className="ml-3 origin-left">{item.label}</span>}
          </NavLink>
        ))}

        <div className="space-y-1">
          <button
            onClick={() => setIwrsOpen(!iwrsOpen)}
            className={classNames(
              "w-full flex items-center px-4 py-3 rounded-xl transition-all group font-medium whitespace-nowrap overflow-hidden hover:bg-slate-50 hover:text-brand-600",
              iwrsActive ? "text-brand-600" : "text-slate-600"
            )}
          >
            <span
              className={classNames(
                "flex-shrink-0",
                iwrsActive ? "text-brand-600" : "text-slate-400 group-hover:text-brand-500"
              )}
            >
              <Shuffle size={20} />
            </span>
            {!collapsed && (
              <>
                <span className="ml-3 flex-1 text-left">IWRS 中央随机化</span>
                <span className={classNames("transition-transform duration-300", iwrsOpen ? "rotate-180" : "")}>
                  <ChevronDown size={16} />
                </span>
              </>
            )}
          </button>
          
          {iwrsOpen && !collapsed && (
            <div className="space-y-1">
              {iwrsItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => classNames(
                    "flex items-center py-3 pr-4 pl-12 rounded-xl transition-all group font-medium whitespace-nowrap overflow-hidden",
                    isActive ? "bg-brand-50 text-brand-600" : "text-slate-600 hover:bg-slate-50 hover:text-brand-600"
                  )}
                >
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <button
            onClick={() => setEdcOpen(!edcOpen)}
            className={classNames(
              "w-full flex items-center px-4 py-3 rounded-xl transition-all group font-medium whitespace-nowrap overflow-hidden hover:bg-slate-50 hover:text-brand-600",
              edcActive ? "text-brand-600" : "text-slate-600"
            )}
          >
            <span
              className={classNames(
                "flex-shrink-0",
                edcActive ? "text-brand-600" : "text-slate-400 group-hover:text-brand-500"
              )}
            >
              <ClipboardList size={20} />
            </span>
            {!collapsed && (
              <>
                <span className="ml-3 flex-1 text-left">EDC 电子数据采集</span>
                <span className={classNames("transition-transform duration-300", edcOpen ? "rotate-180" : "")}>
                  <ChevronDown size={16} />
                </span>
              </>
            )}
          </button>
          
          {edcOpen && !collapsed && (
            <div className="space-y-1">
              {edcItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => classNames(
                    "flex items-center py-3 pr-4 pl-12 rounded-xl transition-all group font-medium whitespace-nowrap overflow-hidden",
                    isActive ? "bg-brand-50 text-brand-600" : "text-slate-600 hover:bg-slate-50 hover:text-brand-600"
                  )}
                >
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <button
            onClick={() => setSystemOpen(!systemOpen)}
            className={classNames(
              "w-full flex items-center px-4 py-3 rounded-xl transition-all group font-medium whitespace-nowrap overflow-hidden hover:bg-slate-50 hover:text-brand-600",
              systemActive ? "text-brand-600" : "text-slate-600"
            )}
          >
            <span
              className={classNames(
                "flex-shrink-0",
                systemActive ? "text-brand-600" : "text-slate-400 group-hover:text-brand-500"
              )}
            >
              <ChartNoAxesGantt size={20} />
            </span>
            {!collapsed && (
              <>
                <span className="ml-3 flex-1 text-left">系统管理</span>
                <span className={classNames("transition-transform duration-300", systemOpen ? "rotate-180" : "")}>
                  <ChevronDown size={16} />
                </span>
              </>
            )}
          </button>

          {systemOpen && !collapsed && (
            <div className="space-y-1">
              {systemItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => classNames(
                    "flex items-center py-3 pr-4 pl-12 rounded-xl transition-all group font-medium whitespace-nowrap overflow-hidden",
                    isActive ? "bg-brand-50 text-brand-600" : "text-slate-600 hover:bg-slate-50 hover:text-brand-600"
                  )}
                >
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>

        <div className="my-2 border-b border-slate-200"></div>
        <NavLink
          to="/index/ui-spec"
          className={({ isActive }) => classNames(
            "flex items-center px-4 py-3 rounded-xl transition-all group font-medium whitespace-nowrap overflow-hidden",
            isActive ? "bg-brand-50 text-brand-600" : "text-slate-600 hover:bg-slate-50 hover:text-brand-600"
          )}
        >
          <span className={classNames("flex-shrink-0", location.pathname.includes("/index/ui-spec") ? "text-brand-600" : "text-slate-400 group-hover:text-brand-500")}>
            <Palette size={20} />
          </span>
          {!collapsed && <span className="ml-3 origin-left">系统 UI 组件规范</span>}
        </NavLink>
        <NavLink
          to="/miniprogram"
          className={({ isActive }) => classNames(
            "flex items-center px-4 py-3 rounded-xl transition-all group font-medium whitespace-nowrap overflow-hidden",
            isActive ? "bg-brand-50 text-brand-600" : "text-slate-600 hover:bg-slate-50 hover:text-brand-600"
          )}
        >
          <span className={classNames("flex-shrink-0", location.pathname.includes("/miniprogram") ? "text-brand-600" : "text-slate-400 group-hover:text-brand-500")}>
            <Database size={20} />
          </span>
          {!collapsed && <span className="ml-3 origin-left">临床试验管理系统小程序</span>}
        </NavLink>
      </nav>

      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between overflow-hidden">
        {!collapsed && (
          <div className="flex items-center justify-center gap-3 group cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-8 h-8 min-w-[2rem] rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-brand-600 group-hover:border-brand-200 transition-all shadow-sm">
              <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-700" />
            </div>
            <div className="whitespace-nowrap">
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
