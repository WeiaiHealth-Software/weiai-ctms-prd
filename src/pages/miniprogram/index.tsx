import React, { useState } from 'react';
import { Activity, Stethoscope, ClipboardCheck, Building2, ChevronRight } from 'lucide-react';
import { DoctorView } from './components/DoctorView';
import { CrcView } from './components/CrcView';
import { MfrView } from './components/MfrView';
import { PhoneContainer } from './components/PhoneContainer';

export const MiniProgram: React.FC = () => {
  const [role, setRole] = useState<'doc' | 'crc' | 'mfr' | null>(null);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">临床试验管理系统 - 小程序端</h1>
        <p className="text-gray-500 text-sm mt-2">在右侧手机容器中模拟小程序交互</p>
      </div>

      <PhoneContainer>
        {!role ? (
          <div className="flex-1 overflow-y-auto no-scrollbar bg-white flex flex-col justify-center p-6 space-y-6 h-full">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-brand-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-brand-200 mb-4">
                <Activity className="text-white w-10 h-10" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">惟翎·中央随机化系统</h1>
              <p className="text-gray-500 text-md mt-2">请选择您的角色</p>
            </div>

            <div onClick={() => setRole('doc')} className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex items-center gap-4 cursor-pointer hover:bg-gray-50 active:scale-95 transition-all group">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Stethoscope className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg">我是医生</h3>
                <p className="text-xs text-gray-400">Doctor / PI / Sub-I</p>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>

            <div onClick={() => setRole('crc')} className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex items-center gap-4 cursor-pointer hover:bg-gray-50 active:scale-95 transition-all group">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <ClipboardCheck className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg">我是 CRC</h3>
                <p className="text-xs text-gray-400">Coordinator</p>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
            </div>

            <div onClick={() => setRole('mfr')} className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex items-center gap-4 cursor-pointer hover:bg-gray-50 active:scale-95 transition-all group">
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Building2 className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg">我是厂家</h3>
                <p className="text-xs text-gray-400">Sponsor / Manager</p>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-purple-500 transition-colors" />
            </div>
          </div>
        ) : role === 'doc' ? (
          <DoctorView onBack={() => setRole(null)} />
        ) : role === 'crc' ? (
          <CrcView onBack={() => setRole(null)} />
        ) : (
          <MfrView onBack={() => setRole(null)} />
        )}
      </PhoneContainer>
    </div>
  );
};
