import React, { useState } from 'react';
import { HomePhone } from './components/HomePhone';
import { DoctorView } from './components/DoctorView';
import { CrcView } from './components/CrcView';
import { MfrView } from './components/MfrView';

export const MiniProgram: React.FC = () => {
  const [activeRole, setActiveRole] = useState<'doc' | 'crc' | 'mfr' | null>(null);

  return (
    <div className="h-full flex flex-col bg-slate-50 p-6 overflow-hidden">
      <div className="mb-6 text-center shrink-0">
        <h1 className="text-2xl font-bold text-gray-800">临床试验管理系统 - 小程序端</h1>
        <p className="text-gray-500 text-sm mt-2">点击首页大厅中的角色面板，右侧将出现对应的角色操作终端</p>
      </div>

      <div className="flex-1 flex justify-center items-center overflow-hidden pb-4">
        <div className="flex flex-row gap-12 items-center transition-all duration-500 ease-in-out">
          <div className="flex flex-col items-center gap-3 relative z-10">
            <div className="text-slate-500 font-bold">首页大厅</div>
            <HomePhone onSelectRole={setActiveRole} activeRole={activeRole} />
          </div>
          
          {activeRole && (
            <div className="flex flex-col items-center gap-3 animate-fade-in-right">
              <div className={`font-bold ${activeRole === 'doc' ? 'text-blue-600' : activeRole === 'crc' ? 'text-emerald-600' : 'text-purple-600'}`}>
                {activeRole === 'doc' ? '医生端' : activeRole === 'crc' ? 'CRC端' : '厂家端'}
              </div>
              {activeRole === 'doc' && <DoctorView />}
              {activeRole === 'crc' && <CrcView />}
              {activeRole === 'mfr' && <MfrView />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
