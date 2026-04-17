import React, { useState } from 'react';
import { LayoutList, User, ArrowLeft, Bell, CheckCircle } from 'lucide-react';
import classNames from 'classnames';
import { DB } from '../store';
import { PhoneContainer } from './PhoneContainer';
import { LoginView } from './LoginView';

export const CrcView: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tab, setTab] = useState<'home' | 'profile'>('home');
  const [screen, setScreen] = useState<'home' | 'detail'>('home');
  const [currentAppt, setCurrentAppt] = useState<any>(null);
  const [showModal, setShowModal] = useState<'success' | 'fail' | null>(null);

  const renderHome = () => (
    <div className="flex flex-col h-full bg-[#f8f9fa] animate-fade-in relative z-10">
      <div className="px-5 pt-12 pb-4 flex justify-between items-center">
        <div>
          <div className="text-slate-600 text-lg">Hi,</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-bold text-[22px] tracking-wide text-slate-800">{DB.users.crc.name}</span>
            <span className="text-[11px] bg-blue-50 border border-blue-200 text-blue-600 px-2 py-0.5 rounded font-bold">CRC</span>
          </div>
        </div>
        <div className="relative">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors">
            <Bell className="text-slate-600 w-5 h-5" />
          </div>
          <div className="absolute top-2 right-2 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-[8px] text-white font-bold transform scale-90">4</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 space-y-6 pb-6">
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-center">
            <div className="text-xs text-slate-500 font-medium mb-2">待处理预约</div>
            <div className="text-3xl font-black text-emerald-600">4</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-center">
            <div className="text-xs text-slate-500 font-medium mb-2">进行中项目</div>
            <div className="text-3xl font-black text-slate-800">2</div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-800 text-[17px] mb-4 flex justify-between items-end">
            待办任务
            <div className="w-5 h-5 rounded-full bg-slate-200 text-white text-[10px] flex items-center justify-center font-bold">4</div>
          </h3>
          
          <div className="space-y-4">
            {DB.appointments.slice(0, 2).map((a, i) => (
              <div key={a.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[11px] font-bold">青少年近视防控临床研究</div>
                  {i === 0 ? (
                    <div className="px-2 py-1 bg-orange-50 text-orange-500 rounded text-[11px] font-bold">待补全</div>
                  ) : (
                    <div className="px-2 py-1 bg-blue-50 text-blue-500 rounded text-[11px] font-bold">待确认</div>
                  )}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetail = () => {
    const isReady = currentAppt?.id === '102';

    return (
      <div className="flex flex-col h-full bg-[#f8f9fa] animate-fade-in relative z-10">
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
                    <button className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-[15px]" onClick={() => setShowModal(null)}>取消</button>
                    <button className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-[15px] shadow-lg shadow-emerald-600/30" onClick={() => {
                      setShowModal(null);
                      setScreen('home');
                    }}>确认执行</button>
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
                  <button className="w-full py-3.5 rounded-xl bg-[#dc2626] text-white font-bold text-[16px] shadow-lg shadow-rose-600/30" onClick={() => {
                    setShowModal(null);
                    setScreen('home');
                  }}>确认取消入组</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

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
          {screen === 'home' && renderHome()}
          {screen === 'detail' && renderDetail()}
        </div>

        {screen === 'home' && (
          <div className="bg-white border-t p-3 flex justify-around text-xs text-slate-500 shrink-0">
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
