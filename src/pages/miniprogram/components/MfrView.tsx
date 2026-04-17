import React, { useState } from 'react';
import { LayoutDashboard, User, ArrowLeft, LogOut } from 'lucide-react';
import classNames from 'classnames';
import { DB } from '../store';
import { PhoneContainer } from './PhoneContainer';
import { LoginView } from './LoginView';

export const MfrView: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tab, setTab] = useState<'home' | 'profile'>('home');
  const [screen, setScreen] = useState<'home' | 'detail'>('home');

  const handleLogout = () => {
    setIsLoggedIn(false);
    setTab('home');
    setScreen('home');
  };

  const renderHome = () => (
    <div className="flex flex-col h-full bg-slate-50 animate-fade-in">
      <div className="bg-white text-black px-4 pt-10 pb-6 shadow-sm flex justify-between items-center relative z-10">
        <div>
          <div className="text-md opacity-80">Hi,</div>
          <div className="flex items-center gap-1 text-lg">
            <span className="font-bold">{DB.users.mfr.name}</span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold ml-2">Sponsor</span>
          </div>
        </div>
        <div className="relative cursor-pointer flex gap-3 items-center">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-50 text-red-500 transition-colors" onClick={handleLogout} title="退出登录">
            <LogOut className="w-5 h-5" />
          </div>
          <div className="relative cursor-pointer" onClick={() => setScreen('detail')}>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
              <User className="text-slate-600 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-5 text-white shadow-md shadow-purple-200">
          <div className="text-purple-100 text-sm mb-1">当前进行中项目</div>
          <div className="text-xl font-bold mb-4">{DB.project.name}</div>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-3xl font-black">{DB.project.enrolled} <span className="text-sm font-normal opacity-80">/ {DB.project.totalTarget}</span></div>
              <div className="text-xs opacity-80 mt-1">总入组进度</div>
            </div>
            <a onClick={() => setScreen('detail')} className="text-xs text-purple-100 cursor-pointer hover:text-white bg-purple-700/30 px-3 py-1.5 rounded-full backdrop-blur-sm">数据概览 &gt;</a>
          </div>
        </div>

        <h3 className="font-bold text-slate-700 mb-3">
          组别入组情况 (盲态)
        </h3>
        
        <div className="space-y-3">
          {DB.groups.map(g => (
            <div key={g.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-400"></div>
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold text-slate-800 text-base">{g.name}</div>
                <div className="text-xs text-slate-500 font-mono">ID: {g.id}</div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.round((g.enrolled / g.target) * 100)}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>进度: {g.enrolled} / {g.target}</span>
                <span>{Math.round((g.enrolled / g.target) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDetail = () => (
    <div className="flex flex-col h-full bg-slate-50 animate-fade-in">
      <div className="bg-white pt-10 px-3 pb-4 flex items-center shadow-sm z-10 flex-none relative">
        <div className="absolute left-3 cursor-pointer p-2 -ml-2" onClick={() => setScreen('home')}>
          <ArrowLeft className="text-slate-500" width={20} />
        </div>
        <h2 className="font-bold text-lg w-full text-center">数据概览</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex items-center justify-center text-slate-400">
        <div className="text-center">
          <p>由于双盲要求，厂家端仅可查看宏观统计数据</p>
          <p className="mt-2 text-xs">更多图表功能请登录PC端查看</p>
        </div>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <PhoneContainer>
        <LoginView role="mfr" onLogin={() => setIsLoggedIn(true)} />
      </PhoneContainer>
    );
  }

  return (
    <PhoneContainer>
      <div className="flex flex-col h-full relative">
        
        <div className="flex-1 overflow-hidden relative mt-6">
          {screen === 'home' && renderHome()}
          {screen === 'detail' && renderDetail()}
        </div>

        {screen === 'home' && (
          <div className="bg-white border-t p-3 flex justify-around text-xs text-slate-500 shrink-0">
            <div className={classNames("flex flex-col items-center cursor-pointer", tab === 'home' ? "text-purple-600" : "")} onClick={() => setTab('home')}>
              <LayoutDashboard className="w-6 h-6 mb-1" />
              工作台
            </div>
            <div className={classNames("flex flex-col items-center cursor-pointer", tab === 'profile' ? "text-purple-600" : "")} onClick={() => setTab('profile')}>
              <User className="w-6 h-6 mb-1" />
              我的
            </div>
          </div>
        )}
      </div>
    </PhoneContainer>
  );
};
