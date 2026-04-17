import React from 'react';
import { Activity, Stethoscope, ClipboardCheck, Building2, ChevronRight } from 'lucide-react';
import { PhoneContainer } from './PhoneContainer';

export const HomePhone: React.FC = () => {
  return (
    <PhoneContainer>
      <div className="flex-1 overflow-y-auto no-scrollbar bg-white flex flex-col justify-center p-6 space-y-6 h-full relative">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-brand-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-brand-200 mb-4">
            <Activity className="text-white w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">惟翎 · CTMS小程序</h1>
          <p className="text-gray-500 text-md mt-2">临床科研管理系统</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-all group">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-lg">医生角色面板</h3>
            <p className="text-xs text-gray-400">Doctor / PI / Sub-I</p>
          </div>
          <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors" />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-all group">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <ClipboardCheck className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-lg">CRC角色面板</h3>
            <p className="text-xs text-gray-400">Coordinator</p>
          </div>
          <ChevronRight className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-all group">
          <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-lg">厂家角色面板</h3>
            <p className="text-xs text-gray-400">Sponsor / Manager</p>
          </div>
          <ChevronRight className="text-gray-300 group-hover:text-purple-500 transition-colors" />
        </div>

        <div className="absolute bottom-6 left-0 w-full text-center text-xs text-slate-400">
          请在右侧对应的角色终端中进行操作
        </div>
      </div>
    </PhoneContainer>
  );
};
