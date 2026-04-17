import React, { useState } from 'react';
import { HomePhone } from './components/HomePhone';
import { DoctorView } from './components/DoctorView';
import { CrcView } from './components/CrcView';
import { MfrView } from './components/MfrView';

type Role = 'doc' | 'crc' | 'mfr';

export const MiniProgram: React.FC = () => {
  const [activeRoles, setActiveRoles] = useState<Role[]>([]);

  const handleSelectRole = (role: Role) => {
    if (!activeRoles.includes(role)) {
      setActiveRoles([...activeRoles, role]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 p-6 overflow-hidden">
      <div className="mb-6 text-center shrink-0">
        <h1 className="text-2xl font-bold text-gray-800">临床试验管理系统 - 小程序端</h1>
        <p className="text-gray-500 text-sm mt-2">点击首页大厅中的角色面板，右侧将不断叠加展开对应的操作终端以测试互动</p>
      </div>

      <div className="flex-1 flex justify-start items-center overflow-x-auto no-scrollbar pb-4">
        <div className="flex flex-row gap-12 items-center transition-all duration-500 ease-in-out pl-10 pr-10 m-auto">
          <div className="flex flex-col items-center gap-3 relative z-10 shrink-0">
            <div className="text-slate-500 font-bold">首页大厅</div>
            <HomePhone onSelectRole={handleSelectRole} activeRoles={activeRoles} />
          </div>
          
          {activeRoles.map(role => (
            <div key={role} className="flex flex-col items-center gap-3 animate-fade-in-right shrink-0">
              <div className={`font-bold ${role === 'doc' ? 'text-blue-600' : role === 'crc' ? 'text-emerald-600' : 'text-purple-600'}`}>
                {role === 'doc' ? '医生端' : role === 'crc' ? 'CRC端' : '厂家端'}
              </div>
              {role === 'doc' && <DoctorView />}
              {role === 'crc' && <CrcView />}
              {role === 'mfr' && <MfrView />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
