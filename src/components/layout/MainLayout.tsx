import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const MainLayout: React.FC = () => {
  return (
    <div className="bg-slate-50 text-slate-800 h-screen flex overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 h-full flex flex-col relative">
        <Header />
        <div
          id="main-content-container"
          className="flex-1 min-h-0 overflow-x-hidden overflow-y-auto relative flex flex-col items-stretch"
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};
