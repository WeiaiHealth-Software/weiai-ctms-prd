import React, { useState, useEffect } from 'react';
import { LayoutGrid, User, ArrowLeft, Bell, ChevronRight, MapPin, FolderKanban } from 'lucide-react';
import classNames from 'classnames';
import { DB, db, utils } from '../store';
import { PhoneContainer } from './PhoneContainer';
import { LoginView } from './LoginView';
import WorkbenchDoctor from './WorkbenchDoctor';
import { ProjectList } from './ProjectList';
import ProjectDetail from './ProjectDetail';

export const DoctorView: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tab, setTab] = useState<'home' | 'projects' | 'profile'>('home');
  const [screen, setScreen] = useState<'home' | 'appointment' | 'detail' | 'center' | 'notifications'>('home');
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const handleCrcAction = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { type, patient, group } = customEvent.detail;
      
      const newNotif = {
        id: Date.now(),
        type: type,
        title: type === 'enroll_success' ? '患者成功入组' : '患者入组失败',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        content: type === 'enroll_success' 
          ? `患者 ${patient.name} 已成功入组 ${group}。筛选号:S-IL0BI 受试者编号:ID-S7EZ1 随机号:R-6UZ7E 产品号:D-Z0AXV`
          : `患者 ${patient.name} 筛选失败，原因：${customEvent.detail.reason || '不符合入组条件'}。`
      };
      
      setNotifications(prev => [newNotif, ...prev]);
    };

    DB.events.addEventListener('crc_action', handleCrcAction);
    return () => DB.events.removeEventListener('crc_action', handleCrcAction);
  }, []);
  const [appointment, setAppointment] = useState({
    name: '',
    phone: '',
    sex: '',
    age: '',
    diopter: ''
  });

  const handleSubmitAppointment = () => {
    const name = appointment.name.trim();
    const phone = appointment.phone.trim();
    if (!name || !phone) {
      window.alert('请填写患者姓名和联系电话');
      return;
    }

    db.addAppointmentFromDoctor({
      name,
      phone,
      sex: appointment.sex,
      age: appointment.age,
      diopter: appointment.diopter
    });

    setAppointment({ name: '', phone: '', sex: '', age: '', diopter: '' });
    setScreen('home');
  };

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
              <div className={`absolute top-0 left-0 w-1.5 h-full ${n.type === 'enroll_success' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
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



  const renderAppointment = () => {
    const sexOptions = DB.project.dimensions.sex;
    const ageOptions = DB.project.dimensions.age;
    const diopterOptions = DB.project.dimensions.diopter;

    return (
      <div className="flex flex-col h-full bg-white relative z-10">
        <div className="bg-white pt-10 px-3 pb-3 flex items-center shadow-sm z-20 flex-none relative">
          <div
            className="absolute left-3 cursor-pointer p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors"
            onClick={() => setScreen('home')}
          >
            <ArrowLeft className="text-slate-600" width={22} />
          </div>
          <h2 className="font-bold text-[17px] w-full text-center text-slate-800 tracking-wide">填写预约信息</h2>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-28">
          <div className="px-4 pt-4 pb-6">
            <div className="mb-5">
              <label className="block text-[13px] font-bold text-slate-800 mb-2">
                患者姓名 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-800"
                placeholder="请输入姓名"
                value={appointment.name}
                onChange={e => setAppointment(s => ({ ...s, name: e.target.value }))}
              />
            </div>

            <div className="mb-5">
              <label className="block text-[13px] font-bold text-slate-800 mb-2">
                联系电话 <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-800"
                placeholder="请输入手机号"
                value={appointment.phone}
                onChange={e => setAppointment(s => ({ ...s, phone: e.target.value }))}
              />
            </div>

            <div className="border-t border-slate-100 pt-5 mt-5">
              <div className="flex items-end justify-between mb-2">
                <h3 className="text-[15px] font-bold text-slate-800">分层维度信息 (选填)</h3>
              </div>
              <div className="text-[12px] text-slate-400 mb-4">若不确定，可留空由CRC后续补充。</div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2">性别</label>
                  <select
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-slate-800 font-medium"
                    value={appointment.sex}
                    onChange={e => setAppointment(s => ({ ...s, sex: e.target.value }))}
                  >
                    <option value="">请选择</option>
                    {sexOptions.map(o => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2">年龄段</label>
                  <select
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-slate-800 font-medium"
                    value={appointment.age}
                    onChange={e => setAppointment(s => ({ ...s, age: e.target.value }))}
                  >
                    <option value="">请选择</option>
                    {ageOptions.map(o => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2">屈光度</label>
                  <select
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-slate-800 font-medium"
                    value={appointment.diopter}
                    onChange={e => setAppointment(s => ({ ...s, diopter: e.target.value }))}
                  >
                    <option value="">请选择</option>
                    {diopterOptions.map(o => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 pb-4 pt-3">
          <button
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[16px] py-3.5 rounded-xl shadow-lg shadow-blue-600/25 active:scale-[0.99] transition-transform"
            onClick={handleSubmitAppointment}
          >
            提交预约
          </button>
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="flex flex-col h-full bg-[#f8f9fa] relative z-10">
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-10 pb-24">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[20px] font-black">
            李
          </div>
          <div className="flex-1">
            <div className="text-[18px] font-black text-slate-800">{DB.doctor.profileName}</div>
            <div className="text-[12px] text-slate-400 mt-1">{DB.doctor.profileRole}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mt-4 overflow-hidden">
          <button
            type="button"
            className="w-full flex items-center px-4 py-4 text-left hover:bg-slate-50 transition-colors"
            onClick={() => setScreen('center')}
          >
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mr-3">
              <MapPin size={18} />
            </div>
            <div className="flex-1 text-[15px] font-bold text-slate-800">我的中心</div>
            <ChevronRight className="text-slate-300" size={18} />
          </button>
          <div className="h-px bg-slate-100" />
          <button
            type="button"
            className="w-full flex items-center px-4 py-4 text-left hover:bg-slate-50 transition-colors"
            onClick={() => {
              setScreen('home');
              setTab('projects');
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mr-3">
              <LayoutGrid size={18} />
            </div>
            <div className="flex-1 text-[15px] font-bold text-slate-800">我的项目</div>
            <ChevronRight className="text-slate-300" size={18} />
          </button>
        </div>

        <button
          type="button"
          className="w-full mt-4 bg-white border border-slate-200 rounded-2xl py-3.5 text-rose-500 font-bold flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors"
          onClick={() => {
            setIsLoggedIn(false);
            setScreen('home');
          }}
        >
          <span className="text-[18px]">⟶</span> 退出登录
        </button>
      </div>
    </div>
  );

  const renderCenter = () => (
    <div className="flex flex-col h-full bg-[#f8f9fa] relative z-10">
      <div className="bg-white pt-10 px-3 pb-3 flex items-center shadow-sm z-20 flex-none relative">
        <div className="absolute left-3 cursor-pointer p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors" onClick={() => {
          setScreen('home');
          setTab('profile');
        }}>
          <ArrowLeft className="text-slate-600" width={22} />
        </div>
        <h2 className="font-bold text-[17px] w-full text-center text-slate-800 tracking-wide">我的中心</h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pb-24">
        {DB.doctor.centers.map(c => (
          <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="text-[15px] font-black text-slate-800">{c.name}</div>
              {c.status === 'verified' ? (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 whitespace-nowrap">
                  已认证
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-orange-50 text-orange-600 border border-orange-100 whitespace-nowrap">
                  审核中
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-3">
              <MapPin size={14} className="text-slate-300" />
              <span>{c.address}</span>
            </div>
            <div className="flex justify-between items-center text-[12px] text-slate-500">
              <div>
                当前角色: <span className="font-bold text-slate-700">{c.role}</span>
              </div>
              <button type="button" className="text-blue-600 font-bold">
                查看详情
              </button>
            </div>
          </div>
        ))}
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
        <div className="flex-1 overflow-hidden relative mt-6 bg-[#f8f9fa]">
          {screen === 'home' && tab === 'home' && <div className="h-full overflow-y-auto pb-24"><WorkbenchDoctor /></div>}
          {screen === 'home' && tab === 'projects' && <ProjectList onNavigateToDetail={() => setScreen('detail')} />}
          {screen === 'home' && tab === 'profile' && renderProfile()}
          
          {screen === 'appointment' && renderAppointment()}
          {screen === 'detail' && <ProjectDetail onBack={() => setScreen('home')} />}
          {screen === 'center' && renderCenter()}
          {screen === 'notifications' && renderNotifications()}
        </div>

        {screen === 'home' && (
          <div className="bg-white border-t p-3 flex justify-around text-xs shrink-0 z-50 relative">
            <div
              className={classNames(
                'flex flex-col items-center cursor-pointer transition-colors',
                tab === 'home' ? 'text-blue-600' : 'text-slate-400'
              )}
              onClick={() => setTab('home')}
            >
              <LayoutGrid className="w-6 h-6 mb-1" />
              工作台
            </div>
            <div
              className={classNames(
                'flex flex-col items-center cursor-pointer transition-colors',
                tab === 'projects' ? 'text-blue-600' : 'text-slate-400'
              )}
              onClick={() => setTab('projects')}
            >
              <FolderKanban className="w-6 h-6 mb-1" />
              项目
            </div>
            <div
              className={classNames(
                'flex flex-col items-center cursor-pointer transition-colors',
                tab === 'profile' ? 'text-blue-600' : 'text-slate-400'
              )}
              onClick={() => setTab('profile')}
            >
              <User className="w-6 h-6 mb-1" />
              我的
            </div>
          </div>
        )}
      </div>
    </PhoneContainer>
  );
};
