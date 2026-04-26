import React, { useState, useEffect } from 'react';
import { LayoutList, User, ArrowLeft, Building2, FolderKanban, LogOut as LogOutIcon, ChevronRight, MapPin } from 'lucide-react';
import classNames from 'classnames';
import { DB } from '../store';
import { PhoneContainer } from './PhoneContainer';
import { LoginView } from './LoginView';
import WorkbenchCrc from './WorkbenchCrc';
import { ProjectList } from './ProjectList';
import ProjectDetail from './ProjectDetail';

export const CrcView: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tab, setTab] = useState<'home' | 'projects' | 'profile'>('home');
  const [screen, setScreen] = useState<'home' | 'detail' | 'my-centers' | 'my-projects' | 'notifications'>('home');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [, setDbVersion] = useState(0);

  useEffect(() => {
    const handleDocAction = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { type, patient, doctor } = customEvent.detail;
      
      if (type === 'new_appointment') {
        const newNotif = {
          id: Date.now(),
          title: '新预约申请',
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          content: `${doctor || '医生'}提交了患者 ${patient.name} 的预约申请，请及时处理。`
        };
        
        setNotifications(prev => [newNotif, ...prev]);
      }
    };

    DB.events.addEventListener('doc_action', handleDocAction);
    return () => DB.events.removeEventListener('doc_action', handleDocAction);
  }, []);

  useEffect(() => {
    const handleDbUpdated = () => setDbVersion(v => v + 1);
    DB.events.addEventListener('db_updated', handleDbUpdated);
    return () => DB.events.removeEventListener('db_updated', handleDbUpdated);
  }, []);

  const renderNotifications = () => (
    <div className="flex flex-col h-full bg-[#f8f9fa] relative z-10">
      <div className="bg-white pt-10 px-3 pb-3 flex items-center shadow-sm z-20 flex-none relative">
        <div className="absolute left-3 cursor-pointer p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors" onClick={() => setScreen('home')}>
          <ArrowLeft className="text-slate-600" width={22} />
        </div>
        <h2 className="font-bold text-[17px] w-full text-center text-slate-800 tracking-wide">消息通知</h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pb-24">
        {notifications.length === 0 ? (
          <div className="text-center text-slate-400 text-sm mt-20">暂无消息</div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800 text-[15px]">{n.title}</h3>
                <span className="text-[11px] text-slate-400">{n.time}</span>
              </div>
              <p className="text-[13px] text-slate-600 leading-relaxed">{n.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );


  const renderProfile = () => (
    <div className="flex flex-col h-full bg-[#f8f9fa] relative z-10">
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-12 space-y-4">
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-[24px] font-black shrink-0">
            {DB.users.crc.name[0]}
          </div>
          <div>
            <h2 className="text-[22px] font-black text-slate-800 tracking-wide mb-1">{DB.users.crc.name}</h2>
            <div className="text-[13px] text-slate-500">CRC 协调员</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setScreen('my-centers')}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                <Building2 size={18} />
              </div>
              <span className="font-bold text-slate-800 text-[15px]">我的中心</span>
            </div>
            <ChevronRight className="text-slate-400" size={18} />
          </div>
          <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setScreen('my-projects')}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                <FolderKanban size={18} />
              </div>
              <span className="font-bold text-slate-800 text-[15px]">我的项目</span>
            </div>
            <ChevronRight className="text-slate-400" size={18} />
          </div>
        </div>

        <button 
          className="w-full bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-center gap-2 text-rose-500 hover:bg-rose-50 transition-colors mt-6"
          onClick={() => setIsLoggedIn(false)}
        >
          <LogOutIcon size={18} />
          <span className="font-bold text-[15px]">退出登录</span>
        </button>
      </div>
    </div>
  );

  const renderMyCenters = () => (
    <div className="flex flex-col h-full bg-[#f8f9fa] relative z-10">
      <div className="bg-white pt-10 px-3 pb-3 flex items-center shadow-sm z-20 flex-none relative">
        <div className="absolute left-3 cursor-pointer p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors" onClick={() => setScreen('home')}>
          <ArrowLeft className="text-slate-600" width={22} />
        </div>
        <h2 className="font-bold text-[17px] w-full text-center text-slate-800 tracking-wide">我的中心</h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pb-24">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-slate-800 text-[16px]">北京协和医院眼科中心</h3>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[11px] font-bold">已认证</span>
          </div>
          <div className="flex items-center text-[12px] text-slate-500 mb-6 gap-1">
            <MapPin size={12} className="text-slate-400" /> 北京市东城区帅府园1号
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-slate-50">
            <div className="text-[13px] text-slate-500">当前角色: <span className="font-bold text-slate-800">CRC</span></div>
            <a className="text-[13px] text-blue-600 font-bold cursor-pointer">查看详情</a>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-slate-800 text-[16px]">上海同仁医院</h3>
            <span className="px-2 py-0.5 bg-orange-50 text-orange-500 rounded text-[11px] font-bold">审核中</span>
          </div>
          <div className="flex items-center text-[12px] text-slate-500 mb-6 gap-1">
            <MapPin size={12} className="text-slate-400" /> 上海市长宁区仙霞路1111号
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-slate-50">
            <div className="text-[13px] text-slate-500">当前角色: <span className="font-bold text-slate-800">CRC</span></div>
            <a className="text-[13px] text-blue-600 font-bold cursor-pointer">查看详情</a>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMyProjects = () => (
    <div className="flex flex-col h-full bg-[#f8f9fa] relative z-10">
      <div className="bg-white pt-10 px-3 pb-0 flex flex-col shadow-sm z-20 flex-none relative">
        <div className="flex items-center mb-4">
          <div className="absolute left-3 cursor-pointer p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors" onClick={() => setScreen('home')}>
            <ArrowLeft className="text-slate-600" width={22} />
          </div>
          <h2 className="font-bold text-[17px] w-full text-center text-slate-800 tracking-wide">我的项目</h2>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl mx-2 mb-3">
          <div className="flex-1 text-center py-1.5 bg-blue-600 text-white rounded-lg text-[13px] font-bold shadow-sm">全部</div>
          <div className="flex-1 text-center py-1.5 text-slate-500 rounded-lg text-[13px] font-medium">进行中</div>
          <div className="flex-1 text-center py-1.5 text-slate-500 rounded-lg text-[13px] font-medium">已结束</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pb-24">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-slate-800 text-[15px] leading-tight flex-1 pr-2">青少年近视防控临床研究</h3>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[11px] font-bold shrink-0">进行中</span>
          </div>
          <div className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded inline-block mb-5 font-mono">
            MYOPIA-2024-001
          </div>
          
          <div className="mb-5">
            <div className="flex justify-between text-[12px] text-slate-500 mb-1.5">
              <span>项目进度</span>
              <span className="font-bold text-slate-700">30%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-50">
            <div className="text-[12px] text-slate-500">担任角色: <span className="font-bold text-slate-800">CRC</span></div>
            <a className="text-[12px] text-blue-600 font-bold cursor-pointer">查看详情</a>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 opacity-75">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-slate-800 text-[15px] leading-tight flex-1 pr-2">干眼症药物三期临床试验</h3>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[11px] font-bold shrink-0">已结束</span>
          </div>
          <div className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded inline-block mb-5 font-mono">
            DRYEYE-2023-099
          </div>
          
          <div className="mb-5">
            <div className="flex justify-between text-[12px] text-slate-500 mb-1.5">
              <span>项目进度</span>
              <span className="font-bold text-slate-700">100%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-50">
            <div className="text-[12px] text-slate-500">担任角色: <span className="font-bold text-slate-800">CRC</span></div>
            <a className="text-[12px] text-blue-600 font-bold cursor-pointer">查看详情</a>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-slate-800 text-[15px] leading-tight flex-1 pr-2">视网膜病变筛查研究</h3>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[11px] font-bold shrink-0">进行中</span>
          </div>
          <div className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded inline-block mb-5 font-mono">
            RETINA-2024-012
          </div>
          
          <div className="mb-5">
            <div className="flex justify-between text-[12px] text-slate-500 mb-1.5">
              <span>项目进度</span>
              <span className="font-bold text-slate-700">12%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '12%' }}></div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-50">
            <div className="text-[12px] text-slate-500">担任角色: <span className="font-bold text-slate-800">CRC</span></div>
            <a className="text-[12px] text-blue-600 font-bold cursor-pointer">查看详情</a>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <PhoneContainer>
        <LoginView role="crc" onLogin={() => setIsLoggedIn(true)} />
      </PhoneContainer>
    );
  }

  if (screen === 'detail') {
    return <ProjectDetail onBack={() => setScreen('home')} />;
  }

  return (
    <PhoneContainer>
      <div className="flex flex-col h-full relative">
        
        <div className="flex-1 overflow-hidden relative mt-6 bg-[#f8f9fa]">
          {tab === 'home' && screen === 'home' && <WorkbenchCrc onOpenNotifications={() => setScreen('notifications')} unreadCount={notifications.length} />}
          {tab === 'projects' && screen === 'home' && <ProjectList onNavigateToDetail={() => setScreen('detail')} />}
          {tab === 'profile' && screen === 'home' && renderProfile()}
          {screen === 'my-centers' && renderMyCenters()}
          {screen === 'my-projects' && renderMyProjects()}
          {screen === 'notifications' && renderNotifications()}
        </div>

        {screen === 'home' && (
          <div className="bg-white border-t p-3 flex justify-around text-xs text-slate-500 shrink-0 relative z-20">
            <div className={classNames("flex flex-col items-center cursor-pointer", tab === 'home' ? "text-emerald-600" : "")} onClick={() => setTab('home')}>
              <LayoutList className="w-6 h-6 mb-1" />
              工作台
            </div>
            <div className={classNames("flex flex-col items-center cursor-pointer", tab === 'projects' ? "text-emerald-600" : "")} onClick={() => setTab('projects')}>
              <FolderKanban className="w-6 h-6 mb-1" />
              项目
            </div>
            <div className={classNames("flex flex-col items-center cursor-pointer", tab === 'profile' ? "text-emerald-600" : "")} onClick={() => setTab('profile')}>
              <User className="w-6 h-6 mb-1" />
              我的
            </div>
          </div>
        )}
      </div>
    </PhoneContainer>
  );
};
