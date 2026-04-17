import React from 'react';
import { Activity, Stethoscope, ClipboardCheck, Building2, ChevronRight } from 'lucide-react';
import { PhoneContainer } from './PhoneContainer';
import classNames from 'classnames';

interface HomePhoneProps {
  onSelectRole: (role: 'doc' | 'crc' | 'mfr') => void;
  activeRoles: ('doc' | 'crc' | 'mfr')[];
}

export const HomePhone: React.FC<HomePhoneProps> = ({ onSelectRole, activeRoles }) => {
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

        <div onClick={() => onSelectRole('doc')} className={classNames(
          "bg-white p-4 rounded-xl shadow-md border flex items-center gap-4 cursor-pointer transition-all group",
          activeRoles.includes('doc') ? "border-blue-500 ring-2 ring-blue-100 opacity-50 pointer-events-none" : "border-gray-100 hover:bg-gray-50"
        )}>
          <div className={classNames(
            "w-14 h-14 rounded-full flex items-center justify-center transition-colors",
            activeRoles.includes('doc') ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
          )}>
            <Stethoscope className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-lg">医生角色面板</h3>
            <p className="text-xs text-gray-400">Doctor / PI / Sub-I</p>
          </div>
          <ChevronRight className={classNames("transition-colors", activeRoles.includes('doc') ? "text-blue-500" : "text-gray-300 group-hover:text-blue-500")} />
        </div>

        <div onClick={() => onSelectRole('crc')} className={classNames(
          "bg-white p-4 rounded-xl shadow-md border flex items-center gap-4 cursor-pointer transition-all group",
          activeRoles.includes('crc') ? "border-emerald-500 ring-2 ring-emerald-100 opacity-50 pointer-events-none" : "border-gray-100 hover:bg-gray-50"
        )}>
          <div className={classNames(
            "w-14 h-14 rounded-full flex items-center justify-center transition-colors",
            activeRoles.includes('crc') ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white"
          )}>
            <ClipboardCheck className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-lg">CRC角色面板</h3>
            <p className="text-xs text-gray-400">Coordinator</p>
          </div>
          <ChevronRight className={classNames("transition-colors", activeRoles.includes('crc') ? "text-emerald-500" : "text-gray-300 group-hover:text-emerald-500")} />
        </div>

        <div onClick={() => onSelectRole('mfr')} className={classNames(
          "bg-white p-4 rounded-xl shadow-md border flex items-center gap-4 cursor-pointer transition-all group",
          activeRoles.includes('mfr') ? "border-purple-500 ring-2 ring-purple-100 opacity-50 pointer-events-none" : "border-gray-100 hover:bg-gray-50"
        )}>
          <div className={classNames(
            "w-14 h-14 rounded-full flex items-center justify-center transition-colors",
            activeRoles.includes('mfr') ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white"
          )}>
            <Building2 className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-lg">厂家角色面板</h3>
            <p className="text-xs text-gray-400">Sponsor / Manager</p>
          </div>
          <ChevronRight className={classNames("transition-colors", activeRoles.includes('mfr') ? "text-purple-500" : "text-gray-300 group-hover:text-purple-500")} />
        </div>

        <div className="absolute bottom-6 left-0 w-full text-center text-xs text-slate-400">
          点击选择角色，右侧将展开对应的操作终端
        </div>
      </div>
    </PhoneContainer>
  );
};
