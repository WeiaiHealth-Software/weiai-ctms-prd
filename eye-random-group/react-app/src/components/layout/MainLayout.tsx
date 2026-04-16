import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const MainLayout: React.FC = () => {
  return (
    <div className="bg-slate-50 text-slate-800 h-screen flex overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 h-full flex flex-col overflow-hidden relative">
        <Header />
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative">
          <Outlet />
        </div>
      </main>
      
      {/* 浮动按钮：打开小程序模拟页面 */}
      <a href="#/miniprogram" target="_blank"
        className="fixed bottom-20 right-8 z-[100] w-14 h-14 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-lg shadow-brand-500/40 flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 group"
        title="打开小程序模拟">
        <span className="text-2xl">📱</span>
        <span className="absolute right-full mr-3 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          小程序模拟
        </span>
      </a>
    </div>
  );
};
