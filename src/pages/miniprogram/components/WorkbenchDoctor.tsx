import React from 'react';
import { Plus, AlertTriangle, Pill } from 'lucide-react';

const WorkbenchDoctor: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header Content */}
      <div className="flex justify-between items-center mb-4 px-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">早安，张主任</h1>
          <p className="text-sm text-gray-500 mt-1">
            当前有 <span className="text-rose-600 font-bold">3</span> 条重要反馈待确认
          </p>
        </div>
        <img
          src="https://ui-avatars.com/api/?name=张&background=4F46E5&color=fff"
          alt="Doctor Avatar"
          className="w-12 h-12 rounded-full border-2 border-white shadow-md"
        />
      </div>
      
      {/* 模块状态 (Doctor) */}
      <div className="flex gap-3 mb-6 px-5">
        <div className="flex-1 bg-indigo-50 rounded-xl p-3 border border-indigo-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <span className="text-xs font-bold text-indigo-700">在研项目</span>
          </div>
          <div className="text-xs text-indigo-600">3 个进行中</div>
        </div>
        <div className="flex-1 bg-rose-50 rounded-xl p-3 border border-rose-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
            <span className="text-xs font-bold text-rose-700">核心预警</span>
          </div>
          <div className="text-xs text-rose-600">2 异常 · 1 待审</div>
        </div>
      </div>

      {/* Doctor Workbench Content */}
      <div className="px-5">
        {/* 快捷入口 (Quick Action) */}
        <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 shadow-lg shadow-blue-600/30 text-white mb-6 relative overflow-hidden transform active:scale-[0.98] transition">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="text-left">
              <h2 className="text-lg font-black tracking-wide mb-1">预约登记入组</h2>
              <p className="text-xs text-blue-100 opacity-90">快速为患者建立档案并分配项目</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </div>
        </button>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">重要预警与反馈</h2>
        </div>

        <div className="space-y-3">
          {/* EDC 异常数据卡片 (Emerald) */}
          <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-emerald-700">EDC - 数据异常确认</span>
              </div>
              <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded">高优先级</span>
            </div>
            <div className="text-[10px] text-gray-400 mb-1">今天 08:15</div>
            <h3 className="font-bold text-gray-800 text-sm mb-1">受试者 S001-008 (V2 访视)</h3>
            <p className="text-xs text-gray-500 mb-3">心电图提示 QTc 间期延长 (480ms)，已触发安全性阈值预警。</p>
            <button className="w-full py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-bold rounded-lg hover:bg-emerald-100 transition">
              查看并签发意见
            </button>
          </div>

          {/* IWRS 用药调整卡片 (Blue) */}
          <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Pill className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-blue-700">IWRS - 剂量调整申请</span>
              </div>
              <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded">中优先级</span>
            </div>
            <div className="text-[10px] text-gray-400 mb-1">昨天 16:30</div>
            <h3 className="font-bold text-gray-800 text-sm mb-1">受试者 S001-012</h3>
            <p className="text-xs text-gray-500 mb-3">CRC 提交了降级用药申请（原因：患者出现中度不良反应）。</p>
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition">
                审批
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkbenchDoctor;
