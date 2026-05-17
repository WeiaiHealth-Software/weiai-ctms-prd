import React from 'react';
import { Plus, AlertTriangle, Pill, Bell, Hospital } from 'lucide-react';

interface WorkbenchDoctorProps {
  onOpenNotifications?: () => void;
  unreadCount?: number;
  onStartAppointment?: () => void;
}

const WorkbenchDoctor: React.FC<WorkbenchDoctorProps> = ({ onOpenNotifications, unreadCount = 0, onStartAppointment }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="px-5 pt-6 pb-4 bg-white shadow-sm mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="https://ui-avatars.com/api/?name=张&background=4F46E5&color=fff"
              alt="Doctor Avatar"
              className="w-12 h-12 rounded-full border-2 border-white shadow-md shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-xl font-bold text-gray-900 truncate">
                徐蔚
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0">
                  医生
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2 min-w-0">
                <p className="flex items-center gap-1 text-sm text-gray-500 truncate">
                  <Hospital className="w-5 h-5 text-gray-600 mr-1" />
                  上海眼病防治中心
                </p>
              </div>
            </div>
          </div>

          <div className="relative cursor-pointer" onClick={onOpenNotifications}>
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition">
              <Bell className="text-gray-600 w-5 h-5" />
            </div>
            {unreadCount > 0 && (
              <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
            )}
          </div>
        </div>
      </div>

      {/* Doctor Workbench Content */}
      <div className="px-5">
        {/* 快捷入口 (Quick Action) */}
        <button
          type="button"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 shadow-lg shadow-blue-600/30 text-white mb-6 relative overflow-hidden transform active:scale-[0.98] transition"
          onClick={onStartAppointment}
        >
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
