import React, { useState } from 'react';
import { LayoutGrid, User, ArrowLeft, Bell, PlusCircle, Search, Plus, ChevronRight, MapPin } from 'lucide-react';
import classNames from 'classnames';
import { DB, utils } from '../store';
import { PhoneContainer } from './PhoneContainer';
import { LoginView } from './LoginView';

export const DoctorView: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [screen, setScreen] = useState<'home' | 'appointment' | 'detail' | 'profile' | 'center' | 'projects'>('home');
  const [projectsFilter, setProjectsFilter] = useState<'all' | 'active' | 'ended'>('all');
  const [appointment, setAppointment] = useState({
    name: '',
    phone: '',
    sex: '',
    age: '',
    diopter: ''
  });

  const renderHome = () => (
    <div className="flex flex-col h-full bg-[#f8f9fa] animate-fade-in relative z-10">
      <div className="px-5 pt-12 pb-4 flex justify-between items-center">
        <div>
          <div className="text-slate-600 text-lg">Hi,</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-bold text-[22px] tracking-wide text-slate-800">{DB.users.doc.name}</span>
            <span className="text-[11px] bg-blue-50 border border-blue-200 text-blue-600 px-2 py-0.5 rounded font-bold">医生</span>
          </div>
        </div>
        <div className="relative">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors">
            <Bell className="text-slate-600 w-5 h-5" />
          </div>
          <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 space-y-6 pb-6">
        
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 text-[15px] mb-4">我的数据</h3>
          <div className="flex justify-between items-center px-2">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">12</div>
              <div className="text-xs text-slate-500">已推荐</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-1">8</div>
              <div className="text-xs text-slate-500">成功入组</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-500 mb-1">1</div>
              <div className="text-xs text-slate-500">筛选失败</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-800 text-[15px] mb-3">进行中的项目</h3>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-slate-800 text-base">{DB.project.name}</h4>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[11px] font-bold whitespace-nowrap ml-2">招募中</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mb-2 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(DB.project.enrolled / DB.project.totalTarget) * 100}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mb-5">
              <span>进度: {DB.project.enrolled}/{DB.project.totalTarget}</span>
              <span>剩余名额: {DB.project.totalTarget - DB.project.enrolled}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-50">
              <button className="bg-blue-600 text-white text-[13px] font-bold px-4 py-2 rounded-lg flex items-center gap-1 shadow-md shadow-blue-600/20 active:scale-95 transition-transform" onClick={() => setScreen('appointment')}>
                <PlusCircle size={16} /> 预约患者
              </button>
              <a onClick={() => setScreen('detail')} className="text-[13px] text-slate-500 cursor-pointer hover:text-blue-600">查看详情 &gt;</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );

  const renderAppointment = () => {
    const sexOptions = DB.project.dimensions.sex;
    const ageOptions = DB.project.dimensions.age;
    const diopterOptions = DB.project.dimensions.diopter;

    return (
      <div className="flex flex-col h-full bg-white animate-fade-in relative z-10">
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
            onClick={() => setScreen('home')}
          >
            提交预约
          </button>
        </div>
      </div>
    );
  };

  const renderDetail = () => (
    <div className="flex flex-col h-full bg-[#f8f9fa] animate-fade-in relative z-10">
      <div className="bg-white pt-10 px-3 pb-3 flex items-center shadow-sm z-20 flex-none relative">
        <div className="absolute left-3 cursor-pointer p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors" onClick={() => setScreen('home')}>
          <ArrowLeft className="text-slate-600" width={22} />
        </div>
        <h2 className="font-bold text-[17px] w-full text-center text-slate-800 tracking-wide">项目详情</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 relative">
        {/* 项目卡片 */}
        <div className="p-4 space-y-4">
          <div className="relative bg-white p-5 pt-8 rounded-2xl shadow-sm border border-slate-100 text-center overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl tracking-wider">
              {DB.project.code}
            </div>
            <h3 className="font-bold text-slate-800 text-[17px] mb-6">{DB.project.name}</h3>
            
            <div className="flex justify-center gap-12 mb-5">
              <div>
                <div className="text-[32px] font-black text-blue-600 leading-none mb-1">
                  {DB.project.enrolled} <span className="text-[13px] text-blue-400 font-bold align-middle">(5)</span>
                </div>
                <div className="text-xs text-slate-500 font-medium">已入组 (我推荐)</div>
              </div>
              <div className="w-[1px] bg-slate-100"></div>
              <div>
                <div className="text-[32px] font-black text-slate-800 leading-none mb-1">
                  {DB.project.totalTarget}
                </div>
                <div className="text-xs text-slate-500 font-medium">目标人数</div>
              </div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${(DB.project.enrolled / DB.project.totalTarget) * 100}%` }}></div>
            </div>
            <div className="text-xs text-slate-400 mt-2 font-medium">
              总体进度 {Math.round((DB.project.enrolled / DB.project.totalTarget) * 100)}%
            </div>
          </div>

          <div className="flex justify-between items-end px-1 pt-2">
            <h3 className="font-bold text-slate-800 text-[15px]">项目分组概览</h3>
            <span className="text-[11px] text-slate-400 font-medium">共 {DB.groups.length} 个分组</span>
          </div>

          {/* 分组列表 */}
          {DB.groups.map(g => (
            <div key={g.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h4 className="font-bold text-slate-800 text-[17px] mb-2">{g.name}</h4>
              <div className="text-[13px] text-slate-500 mb-5 flex items-center gap-1.5">
                <span className="text-slate-300">🔗</span> {g.drug}
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="flex-1 pr-6">
                  <div className="flex justify-between text-[13px] mb-2 font-medium">
                    <span className="text-slate-600">已入组</span>
                    <span className="text-blue-600 font-bold">{g.enrolled}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(g.enrolled / g.target) * 100}%` }}></div>
                  </div>
                </div>
                <div className="w-[1px] h-8 bg-slate-100 mr-6"></div>
                <div className="flex-1">
                  <div className="flex justify-between text-[13px] mb-2 font-medium">
                    <span className="text-slate-600">剩余名额</span>
                    <span className="text-slate-800 font-bold">{g.target - g.enrolled}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-slate-300 h-full rounded-full" style={{ width: `${((g.target - g.enrolled) / g.target) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 mb-3 font-medium">因子维度分布</div>
              <div className="space-y-3">
                {g.dimensions.map((d, i) => {
                  const tags = d.name.split(' | ');
                  return (
                    <div key={i} className="bg-slate-50/50 rounded-xl p-3 border border-slate-50">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map((t, j) => (
                          <span key={j} className="text-[10px] text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm">{t}</span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center gap-3">
                        <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${(d.current / d.target) * 100}%` }}></div>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap w-8 text-right">{d.current}/{d.target}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center px-1 pt-4 pb-2">
            <h3 className="font-bold text-slate-800 text-[15px]">受试者表格</h3>
            <div className="flex gap-2">
              <div className="relative">
                <input type="text" placeholder="姓名" className="text-[11px] w-16 bg-white border border-slate-200 rounded px-2 py-1 pr-6 outline-none focus:border-blue-500 transition-colors" />
                <Search className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3" />
              </div>
              <select className="text-[11px] bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-500 text-slate-700 font-medium">
                <option value="enrolled">已入组</option>
                <option value="pending">待处理</option>
                <option value="all">全部</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="p-3 pl-4 font-medium">姓名/状态</th>
                  <th className="p-3 font-medium">组别</th>
                  <th className="p-3 font-medium">时间</th>
                  <th className="p-3 text-center font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {DB.appointments.slice(0, 6).map(a => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 pl-4">
                      <div className="font-bold text-slate-800 mb-1">{a.name}</div>
                      <div dangerouslySetInnerHTML={{ __html: utils.getStatusBadge(a.status) }}></div>
                    </td>
                    <td className="p-3 text-slate-600 font-medium">
                      {a.group ? DB.groups.find(g => g.id === a.group)?.name : '-'}
                    </td>
                    <td className="p-3 text-slate-500">
                      {a.time}
                    </td>
                    <td className="p-3 text-center">
                      <button className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded border border-blue-100 font-bold transition-colors">查看</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 悬浮添加按钮 */}
        <div className="absolute bottom-6 right-4">
          <button className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-600/40 flex items-center justify-center transition-all active:scale-95">
            <Plus size={32} strokeWidth={2} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="flex flex-col h-full bg-[#f8f9fa] animate-fade-in relative z-10">
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
            onClick={() => setScreen('projects')}
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
    <div className="flex flex-col h-full bg-[#f8f9fa] animate-fade-in relative z-10">
      <div className="bg-white pt-10 px-3 pb-3 flex items-center shadow-sm z-20 flex-none relative">
        <div className="absolute left-3 cursor-pointer p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors" onClick={() => setScreen('profile')}>
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

  const renderProjects = () => {
    const list =
      projectsFilter === 'all'
        ? DB.doctor.projects
        : DB.doctor.projects.filter(p => (projectsFilter === 'active' ? p.status === 'active' : p.status === 'ended'));

    return (
      <div className="flex flex-col h-full bg-[#f8f9fa] animate-fade-in relative z-10">
        <div className="bg-white pt-10 px-3 pb-3 flex items-center shadow-sm z-20 flex-none relative">
          <div className="absolute left-3 cursor-pointer p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors" onClick={() => setScreen('profile')}>
            <ArrowLeft className="text-slate-600" width={22} />
          </div>
          <h2 className="font-bold text-[17px] w-full text-center text-slate-800 tracking-wide">我的项目</h2>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
          <div className="p-4">
            <div className="bg-slate-100 rounded-xl p-1 flex gap-1">
              <button
                type="button"
                className={classNames(
                  'flex-1 py-2 rounded-lg text-[13px] font-bold transition-colors',
                  projectsFilter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'
                )}
                onClick={() => setProjectsFilter('all')}
              >
                全部
              </button>
              <button
                type="button"
                className={classNames(
                  'flex-1 py-2 rounded-lg text-[13px] font-bold transition-colors',
                  projectsFilter === 'active' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'
                )}
                onClick={() => setProjectsFilter('active')}
              >
                进行中
              </button>
              <button
                type="button"
                className={classNames(
                  'flex-1 py-2 rounded-lg text-[13px] font-bold transition-colors',
                  projectsFilter === 'ended' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'
                )}
                onClick={() => setProjectsFilter('ended')}
              >
                已结束
              </button>
            </div>

            <div className="space-y-4 mt-4">
              {list.map(p => (
                <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-[16px] font-black text-slate-800 truncate">{p.name}</div>
                      <div className="mt-2">
                        <span className="text-[11px] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                          {p.code}
                        </span>
                      </div>
                    </div>
                    {p.status === 'active' ? (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[11px] font-bold whitespace-nowrap">
                        进行中
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[11px] font-bold whitespace-nowrap">
                        已结束
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex justify-between items-center text-[12px] text-slate-500 font-medium">
                    <span>项目进度</span>
                    <span>{p.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
                    <div
                      className={classNames('h-full rounded-full', p.status === 'ended' ? 'bg-emerald-500' : 'bg-blue-600')}
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-[12px] text-slate-500">
                      担任角色: <span className="font-bold text-slate-700">{p.role}</span>
                    </div>
                    <button type="button" className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-1.5 rounded-full text-[12px] font-bold">
                      查看详情
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

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
          {screen === 'appointment' && renderAppointment()}
          {screen === 'detail' && renderDetail()}
          {screen === 'profile' && renderProfile()}
          {screen === 'center' && renderCenter()}
          {screen === 'projects' && renderProjects()}
        </div>

        <div className="bg-white border-t p-3 flex justify-around text-xs shrink-0">
          <div
            className={classNames(
              'flex flex-col items-center cursor-pointer transition-colors',
              ['home', 'appointment', 'detail'].includes(screen) ? 'text-blue-600' : 'text-slate-400'
            )}
            onClick={() => setScreen('home')}
          >
            <LayoutGrid className="w-6 h-6 mb-1" />
            工作台
          </div>
          <div
            className={classNames(
              'flex flex-col items-center cursor-pointer transition-colors',
              ['profile', 'center', 'projects'].includes(screen) ? 'text-blue-600' : 'text-slate-400'
            )}
            onClick={() => setScreen('profile')}
          >
            <User className="w-6 h-6 mb-1" />
            我的
          </div>
        </div>
      </div>
    </PhoneContainer>
  );
};
