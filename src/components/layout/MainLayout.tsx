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
    </div>
  );
};
