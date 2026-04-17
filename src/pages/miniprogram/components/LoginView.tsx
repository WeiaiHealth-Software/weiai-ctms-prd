import React, { useState } from 'react';
import { Stethoscope, ClipboardCheck, Building2 } from 'lucide-react';

interface LoginViewProps {
  role: 'doc' | 'crc' | 'mfr';
  onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ role, onLogin }) => {
  const [username, setUsername] = useState(role === 'doc' ? 'Dr.Li' : role === 'crc' ? 'crc01' : 'mfr01');
  const [password, setPassword] = useState('123456');

  const roleConfig = {
    doc: { title: '医生工作台', bgClass: 'bg-blue-100', iconColor: 'text-blue-600', btnClass: 'bg-blue-600', icon: <Stethoscope size={36} strokeWidth={2} /> },
    crc: { title: 'CRC工作台', bgClass: 'bg-emerald-100', iconColor: 'text-emerald-600', btnClass: 'bg-emerald-600', icon: <ClipboardCheck size={36} strokeWidth={2} /> },
    mfr: { title: '厂家工作台', bgClass: 'bg-purple-100', iconColor: 'text-purple-600', btnClass: 'bg-purple-600', icon: <Building2 size={36} strokeWidth={2} /> },
  };

  const config = roleConfig[role];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] p-8 justify-center animate-fade-in relative z-10">
      <div className="text-center mb-12">
        <div className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-6 ${config.bgClass} ${config.iconColor}`}>
          {config.icon}
        </div>
        <h2 className="text-[28px] font-black text-slate-900 tracking-wider">欢迎登录</h2>
        <p className="text-slate-500 text-base mt-2 font-medium tracking-widest">{config.title}</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-[13px] font-bold text-slate-700 mb-2 pl-1">账号</label>
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-800 font-medium"
              placeholder="请输入账号"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-[13px] font-bold text-slate-700 mb-2 pl-1">密码</label>
          <div className="relative">
            <input
              type="password"
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-800 font-medium tracking-[0.2em]"
              placeholder="请输入密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="pt-6">
          <button
            type="submit"
            className={`w-full py-3.5 rounded-xl text-white font-bold text-[17px] shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] ${config.btnClass} hover:brightness-110`}
          >
            立即登录
          </button>
        </div>
      </form>
    </div>
  );
};
