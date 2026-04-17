import React, { useState } from 'react';
import { LayoutGrid, User, ArrowLeft, LogOut } from 'lucide-react';
import classNames from 'classnames';
import { DB, utils } from '../store';
import { PhoneContainer } from './PhoneContainer';
import { LoginView } from './LoginView';

export const DoctorView: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tab, setTab] = useState<'home' | 'profile'>('home');
  const [screen, setScreen] = useState<'home' | 'projects' | 'detail'>('home');

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
            <span className="font-bold">{DB.users.doc.name}</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold ml-2">Doctor</span>
          </div>
        </div>
        <div className="relative cursor-pointer flex gap-3 items-center">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-50 text-red-500 transition-colors" onClick={handleLogout} title="退出登录">
            <LogOut className="w-5 h-5" />
          </div>
          <div className="relative cursor-pointer" onClick={() => setScreen('projects')}>
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="text-gray-600 w-5 h-5" />
            </div>
            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-md shadow-blue-200">
          <div className="text-blue-100 text-sm mb-1">当前进行中项目</div>
          <div className="text-xl font-bold mb-4">{DB.project.name}</div>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-3xl font-black">{DB.project.enrolled} <span className="text-sm font-normal opacity-80">/ {DB.project.totalTarget}</span></div>
              <div className="text-xs opacity-80 mt-1">总入组进度</div>
            </div>
            <a onClick={() => setScreen('detail')} className="text-xs text-blue-100 cursor-pointer hover:text-white bg-blue-700/30 px-3 py-1.5 rounded-full backdrop-blur-sm">查看详情 &gt;</a>
          </div>
        </div>

        <h3 className="font-bold text-slate-700 mb-3 flex justify-between items-center">
          今日待办
          <span className="text-xs font-normal text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">3</span>
        </h3>
        
        <div className="space-y-3">
          {DB.appointments.slice(0, 3).map(a => (
            <div key={a.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
              <div className="flex justify-between items-start mb-2">
                <div className="font-bold text-slate-800 text-base">{a.name}</div>
                <div dangerouslySetInnerHTML={{ __html: utils.getStatusBadge(a.status) }}></div>
              </div>
              <div className="text-xs text-slate-500 space-y-1 mb-3">
                <p>预约时间：{a.time}</p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg" onClick={() => setScreen('detail')}>查看档案</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="flex flex-col h-full bg-slate-50 animate-fade-in">
      <div className="bg-white pt-10 px-3 pb-4 flex items-center shadow-sm z-10 flex-none relative">
        <div className="absolute left-3 cursor-pointer p-2 -ml-2" onClick={() => setScreen('home')}>
          <ArrowLeft className="text-slate-500" width={20} />
        </div>
        <h2 className="font-bold text-lg w-full text-center">我的项目</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-slate-800 text-base mb-1">{DB.project.name}</h3>
              <p className="text-xs text-slate-400">{DB.project.code}</p>
            </div>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold">进行中</span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 mt-4">
            <div>进度: {DB.project.enrolled} / {DB.project.totalTarget}</div>
            <button onClick={() => setScreen('detail')} className="text-blue-600 text-xs font-bold px-3 py-1 bg-blue-50 rounded-lg">查看详情</button>
          </div>
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
        <h2 className="font-bold text-lg w-full text-center">项目详情</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 text-base mb-1">{DB.project.name}</h3>
          <p className="text-xs text-slate-400 mb-4">{DB.project.code}</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 p-2 rounded-lg text-center">
              <div className="text-xs text-slate-500">总目标</div>
              <div className="text-lg font-bold text-slate-800">{DB.project.totalTarget}</div>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg text-center">
              <div className="text-xs text-slate-500">已入组</div>
              <div className="text-lg font-bold text-blue-600">{DB.project.enrolled}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="p-2 pl-3">姓名/状态</th>
                <th className="p-2">组别</th>
                <th className="p-2 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {DB.appointments.slice(0, 6).map(a => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="p-2 pl-3">
                    <div className="font-bold text-slate-800">{a.name}</div>
                    <div className="mt-0.5" dangerouslySetInnerHTML={{ __html: utils.getStatusBadge(a.status) }}></div>
                  </td>
                  <td className="p-2">
                    {a.group ? <span className="text-blue-600 font-bold">{DB.groups.find(g => g.id === a.group)?.name}</span> : <span className="text-slate-400">-</span>}
                  </td>
                  <td className="p-2 text-center">
                    <button className="text-blue-500 hover:text-blue-700 font-medium">查看</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <PhoneContainer>
        <LoginView role="doc" onLogin={() => setIsLoggedIn(true)} />
      </PhoneContainer>
    );
  }

  return (
    <PhoneContainer>
      <div className="flex flex-col h-full relative">
        
        <div className="flex-1 overflow-hidden relative mt-6">
          {screen === 'home' && renderHome()}
          {screen === 'projects' && renderProjects()}
          {screen === 'detail' && renderDetail()}
        </div>

        {screen === 'home' && (
          <div className="bg-white border-t p-3 flex justify-around text-xs text-slate-500 shrink-0">
            <div className={classNames("flex flex-col items-center cursor-pointer", tab === 'home' ? "text-blue-600" : "")} onClick={() => setTab('home')}>
              <LayoutGrid className="w-6 h-6 mb-1" />
              工作台
            </div>
            <div className={classNames("flex flex-col items-center cursor-pointer", tab === 'profile' ? "text-blue-600" : "")} onClick={() => setTab('profile')}>
              <User className="w-6 h-6 mb-1" />
              我的
            </div>
          </div>
        )}
      </div>
    </PhoneContainer>
  );
};
