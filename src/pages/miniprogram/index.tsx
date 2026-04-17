import React from 'react';
import { HomePhone } from './components/HomePhone';
import { DoctorView } from './components/DoctorView';
import { CrcView } from './components/CrcView';
import { MfrView } from './components/MfrView';

export const MiniProgram: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-slate-50 p-6 overflow-hidden">
      <div className="mb-6 text-center shrink-0">
        <h1 className="text-2xl font-bold text-gray-800">临床试验管理系统 - 小程序端</h1>
        <p className="text-gray-500 text-sm mt-2">横向展示四个容器，各角色独立操作演示</p>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden no-scrollbar pb-4">
        <div className="flex flex-row gap-8 w-max px-4 h-full items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="text-slate-500 font-bold">首页大厅</div>
            <HomePhone />
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="text-blue-600 font-bold">医生端</div>
            <DoctorView />
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="text-emerald-600 font-bold">CRC端</div>
            <CrcView />
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="text-purple-600 font-bold">厂家端</div>
            <MfrView />
          </div>
        </div>
      </div>
    </div>
  );
};
