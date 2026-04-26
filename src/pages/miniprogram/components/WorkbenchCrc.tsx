import React from 'react';
import { ClipboardList, FileText, Package, AlertTriangle, Bell } from 'lucide-react';

interface WorkbenchCrcProps {
  onOpenNotifications?: () => void;
  unreadCount?: number;
}

const WorkbenchCrc: React.FC<WorkbenchCrcProps> = ({ onOpenNotifications, unreadCount = 0 }) => {
  return (
    <>
      <div className="px-5 pt-6 pb-4 bg-white rounded-b-3xl shadow-sm mb-4">
        {/* Header Content */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">早安，李协调员</h1>
            <p className="text-sm text-gray-500 mt-1">
              当前有 <span className="text-blue-600 font-bold">5</span> 项待办任务
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer" onClick={onOpenNotifications}>
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition">
                <Bell className="text-gray-600 w-5 h-5" />
              </div>
              {unreadCount > 0 && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <img 
              src="https://ui-avatars.com/api/?name=李&background=0D8ABC&color=fff" 
              alt="Avatar"
              className="w-12 h-12 rounded-full border-2 border-white shadow-md" 
            />
          </div>
        </div>
        
        {/* 模块状态 (CRC) */}
        <div className="flex gap-3 mb-2">
          <div className="flex-1 bg-blue-50 rounded-xl p-3 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-xs font-bold text-blue-700">IWRS 系统</span>
            </div>
            <div className="text-xs text-blue-600">3 待随机 · 2 待发药</div>
          </div>
          <div className="flex-1 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-bold text-emerald-700">EDC 系统</span>
            </div>
            <div className="text-xs text-emerald-600">12 待录入 · 4 质疑</div>
          </div>
        </div>
      </div>

      {/* CRC Workbench Content */}
      <div className="px-5 pb-20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">待办事项</h2>
          <span className="text-sm text-blue-600">按优先级排序</span>
        </div>

        <div className="space-y-3">
          {/* IWRS 任务卡片 (Blue) */}
          <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ClipboardList className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-blue-700">IWRS - 随机化</span>
              </div>
              <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded">高优先级</span>
            </div>
            <div className="text-[10px] text-gray-400 mb-1">今天 09:30</div>
            <h3 className="font-bold text-gray-800 text-sm mb-1">受试者 S001-005 随机分配</h3>
            <p className="text-xs text-gray-500 mb-3">项目：阿兹海默症 III 期 (PROJ-2026)</p>
            <button className="w-full py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-blue-700 transition">立即执行</button>
          </div>

          {/* EDC 任务卡片 (Emerald) */}
          <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-emerald-700">EDC - 数据录入</span>
              </div>
              <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded">中优先级</span>
            </div>
            <div className="text-[10px] text-gray-400 mb-1">今天 11:00</div>
            <h3 className="font-bold text-gray-800 text-sm mb-1">受试者 S001-002 V1 访视</h3>
            <p className="text-xs text-gray-500 mb-3">需完成：体格检查表、生命体征表</p>
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-bold rounded-lg hover:bg-emerald-100 transition">去录入</button>
            </div>
          </div>
          
          {/* IWRS 任务卡片 (Blue) */}
          <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-300"></div>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Package className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-blue-700">IWRS - 物资发放</span>
              </div>
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">低优先级</span>
            </div>
            <div className="text-[10px] text-gray-400 mb-1">2026-04-18 14:00</div>
            <h3 className="font-bold text-gray-800 text-sm mb-1">S001-002 V1 期药物发放</h3>
            <p className="text-xs text-gray-500">前置任务：需等待该受试者 V1 访视数据提交</p>
          </div>

          {/* EDC 任务卡片 (Emerald) */}
          <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-300"></div>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-emerald-700">EDC - 质疑回复</span>
              </div>
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">低优先级</span>
            </div>
            <div className="text-[10px] text-gray-400 mb-1">2026-04-15 10:15</div>
            <h3 className="font-bold text-gray-800 text-sm mb-1">受试者 S001-001 (基线期)</h3>
            <p className="text-xs text-gray-500 mb-3">体格检查表中“收缩压”数据异常，请核实并回复。</p>
            <button className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition">查看质疑详情</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkbenchCrc;
