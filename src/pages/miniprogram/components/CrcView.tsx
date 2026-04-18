import React, { useState, useEffect } from 'react';
import { LayoutList, User, ArrowLeft, Bell, CheckCircle, Building2, FolderKanban, LogOut as LogOutIcon, ChevronRight, MapPin } from 'lucide-react';
import classNames from 'classnames';
import { DB, db } from '../store';
import { PhoneContainer } from './PhoneContainer';
import { LoginView } from './LoginView';

export const CrcView: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tab, setTab] = useState<'home' | 'profile'>('home');
  const [screen, setScreen] = useState<'home' | 'detail' | 'my-centers' | 'my-projects' | 'notifications'>('home');
  const [currentAppt, setCurrentAppt] = useState<any>(null);
  const [showModal, setShowModal] = useState<'success' | 'fail' | null>(null);
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

  const renderHome = () => {
    const pendingCount = db.getPendingCount();
    const pendingList = db.getPendingAppointments().slice(0, 2);

    const getTodoBadge = (status: string) => {
      if (status === 'pending_info') return { text: '待补全', className: 'bg-orange-50 text-orange-500' };
      if (status === 'pending_confirm') return { text: '待确认', className: 'bg-blue-50 text-blue-500' };
      return { text: '已处理', className: 'bg-slate-100 text-slate-500' };
    };

    const counterText = pendingCount > 99 ? '99+' : String(pendingCount);

    return (
      <div className="flex flex-col h-full bg-[#f8f9fa] relative z-10">
        <div className="px-5 pt-12 pb-4 flex justify-between items-center">
        <div>
          <div className="text-slate-600 text-lg">Hi,</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-bold text-[22px] tracking-wide text-slate-800">{DB.users.crc.name}</span>
            <span className="text-[11px] bg-blue-50 border border-blue-200 text-blue-600 px-2 py-0.5 rounded font-bold">CRC</span>
          </div>
        </div>
        <div className="relative" onClick={() => setScreen('notifications')}>
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors">
            <Bell className="text-slate-600 w-5 h-5" />
          </div>
          {notifications.length > 0 && (
            <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 space-y-6 pb-6">
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-center">
            <div className="text-xs text-slate-500 font-medium mb-2">待处理预约</div>
            <div className="text-3xl font-black text-emerald-600">{counterText}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-center">
            <div className="text-xs text-slate-500 font-medium mb-2">进行中项目</div>
            <div className="text-3xl font-black text-slate-800">2</div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-800 text-[17px] mb-4 flex justify-between items-end">
            待办任务
            <div className="w-5 h-5 rounded-full bg-slate-200 text-white text-[10px] flex items-center justify-center font-bold">{counterText}</div>
          </h3>
          
          <div className="space-y-4">
            {pendingList.map(a => {
              const badge = getTodoBadge(a.status);
              return (
                <div key={a.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[11px] font-bold">青少年近视防控临床研究</div>
                    <div className={classNames("px-2 py-1 rounded text-[11px] font-bold", badge.className)}>{badge.text}</div>
                  </div>
                  <div className="flex items-end gap-3 mb-6">
                    <div className="font-black text-slate-800 text-xl">{a.name}</div>
                    <div className="text-slate-500 font-mono text-[15px] pb-0.5">{a.phone}</div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                    <div className="text-[12px] text-slate-400">来自: {a.doctor} <span className="ml-2">{a.time}</span></div>
                    <button className="bg-indigo-50 text-indigo-600 text-[12px] font-bold px-3 py-1.5 rounded flex items-center hover:bg-indigo-100 transition-colors" onClick={() => {
                      setCurrentAppt(a);
                      setScreen('detail');
                    }}>
                      查看详情 &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    );
  };

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
  const handleEnrollSuccess = () => {
    if (currentAppt?.id) {
      db.updateAppointment(currentAppt.id, { status: 'enrolled', group: 'g1' });
    }
    DB.events.dispatchEvent(new CustomEvent('crc_action', {
      detail: {
        type: 'enroll_success',
        patient: { name: currentAppt?.name || '张伟' },
        group: '试验组 A'
      }
    }));
    setShowModal(null);
    setScreen('home');
  };

  const handleEnrollFail = () => {
    if (currentAppt?.id) {
      db.updateAppointment(currentAppt.id, { status: 'closed' });
    }
    DB.events.dispatchEvent(new CustomEvent('crc_action', {
      detail: {
        type: 'enroll_fail',
        patient: { name: currentAppt?.name || '张伟' },
        reason: '因个人原因退筛'
      }
    }));
    setShowModal(null);
    setScreen('home');
  };

  const renderDetail = () => {
    const isReady = currentAppt?.status === 'pending_confirm';

    return (
      <div className="flex flex-col h-full bg-[#f8f9fa] relative z-10">
        <div className="bg-white pt-10 px-3 pb-3 flex items-center shadow-sm z-20 flex-none relative">
          <div className="absolute left-3 cursor-pointer p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors" onClick={() => setScreen('home')}>
            <ArrowLeft className="text-slate-600" width={22} />
          </div>
          <h2 className="font-bold text-[17px] w-full text-center text-slate-800 tracking-wide">处理预约</h2>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24 relative">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6">
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <div className="text-[12px] text-slate-500 mb-1">患者姓名</div>
                <div className="text-[17px] font-bold text-slate-800">{currentAppt?.name || '张伟'}</div>
              </div>
              <div>
                <div className="text-[12px] text-slate-500 mb-1">联系电话</div>
                <div className="text-[17px] text-blue-600 font-mono">{currentAppt?.phone || '13800138000'}</div>
              </div>
              <div className="col-span-2">
                <div className="text-[12px] text-slate-500 mb-1">推荐医生</div>
                <div className="text-[17px] font-bold text-slate-800">{currentAppt?.doctor || '李医生'}</div>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-slate-800 text-[16px] mb-4 pl-1">维度核查</h3>
          
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6 space-y-4">
            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-2">性别 {isReady ? '' : <span className="text-orange-500 font-normal">(需补充)</span>}</label>
              <select className={classNames(
                "w-full px-4 py-3 bg-[#fff8eb] border rounded-xl focus:outline-none transition-all text-[15px] font-bold appearance-none",
                isReady ? "border-emerald-200 text-emerald-700 bg-emerald-50" : "border-orange-200 text-slate-800"
              )}>
                {isReady ? <option>女</option> : <option>请选择</option>}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-2">年龄段 {isReady ? '' : <span className="text-orange-500 font-normal">(需补充)</span>}</label>
              <select className={classNames(
                "w-full px-4 py-3 bg-[#fff8eb] border rounded-xl focus:outline-none transition-all text-[15px] font-bold appearance-none",
                isReady ? "border-emerald-200 text-emerald-700 bg-emerald-50" : "border-orange-200 text-slate-800"
              )}>
                {isReady ? <option>8~10岁</option> : <option>请选择</option>}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-2">屈光度 {isReady ? '' : <span className="text-orange-500 font-normal">(需补充)</span>}</label>
              <select className={classNames(
                "w-full px-4 py-3 bg-[#fff8eb] border rounded-xl focus:outline-none transition-all text-[15px] font-bold appearance-none",
                isReady ? "border-emerald-200 text-emerald-700 bg-emerald-50" : "border-orange-200 text-slate-800"
              )}>
                {isReady ? <option>-1.50~0.00D</option> : <option>请选择</option>}
              </select>
            </div>
          </div>

          <div className="space-y-3 mt-8">
            <button 
              className={classNames(
                "w-full py-3.5 rounded-xl text-white font-bold text-[16px] shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2",
                isReady ? "bg-emerald-600 shadow-emerald-600/30 hover:brightness-110" : "bg-emerald-600 opacity-50 cursor-not-allowed"
              )}
              onClick={() => isReady && setShowModal('success')}
            >
              <CheckCircle size={20} /> 确认预约 & 锁定名额
            </button>
            <button 
              className={classNames(
                "w-full py-3.5 rounded-xl text-emerald-600 bg-emerald-50 font-bold text-[16px] transition-all active:scale-[0.98] border border-emerald-100 flex items-center justify-center gap-2",
                isReady ? "hover:bg-emerald-100" : "opacity-50 cursor-not-allowed"
              )}
              onClick={() => isReady && setShowModal('success')}
            >
              ⚡ 一键转化入组
            </button>
            <button 
              className="w-full py-3.5 rounded-xl text-rose-500 bg-rose-50 font-bold text-[16px] transition-all active:scale-[0.98] border border-rose-100"
              onClick={() => setShowModal('fail')}
            >
              无法入组
            </button>
          </div>
        </div>

        {/* Modal Overlays */}
        {showModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center animate-fade-in">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(null)}></div>
            <div className="relative bg-white w-[85%] rounded-[24px] p-6 shadow-2xl animate-fade-in-right transform transition-all translate-y-[-10%]">
              {showModal === 'success' ? (
                <>
                  <h3 className="text-[20px] font-black text-slate-800 mb-3 tracking-wide">一键转入组 (正式入组)</h3>
                  <p className="text-[13px] text-slate-600 mb-4 leading-relaxed">
                    该操作表示患者正式进入临床试验，系统将立即执行<span className="text-emerald-600 font-bold">随机化分组</span>。
                  </p>
                  <ul className="text-[12px] text-slate-500 space-y-1.5 mb-6 list-disc pl-4 marker:text-slate-300">
                    <li>生成筛选号、受试者编号、随机号</li>
                    <li>自动分配产品号</li>
                    <li>更新项目入组进度</li>
                    <li className="text-rose-500">此操作不可撤销</li>
                  </ul>
                  <div className="flex gap-3">
                    <button className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-[15px] bg-white" onClick={() => setShowModal(null)}>取消</button>
                    <button className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-[15px] shadow-lg shadow-emerald-600/30" onClick={handleEnrollSuccess}>确认执行</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6"></div>
                  <h3 className="text-[18px] font-black text-slate-800 mb-4 tracking-wide">填写无法入组原因</h3>
                  <textarea 
                    className="w-full bg-[#f8f9fa] border border-slate-200 rounded-xl p-4 text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/50 mb-6 min-h-[120px] resize-none placeholder:text-slate-400"
                    placeholder="请详细描述无法入组的原因..."
                  ></textarea>
                  <button className="w-full py-3.5 rounded-xl bg-[#dc2626] text-white font-bold text-[16px] shadow-lg shadow-rose-600/30" onClick={handleEnrollFail}>确认取消入组</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

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

  return (
    <PhoneContainer>
      <div className="flex flex-col h-full relative">
        
        <div className="flex-1 overflow-hidden relative mt-6">
          {tab === 'home' && screen === 'home' && renderHome()}
          {tab === 'profile' && screen === 'home' && renderProfile()}
          {screen === 'detail' && renderDetail()}
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
