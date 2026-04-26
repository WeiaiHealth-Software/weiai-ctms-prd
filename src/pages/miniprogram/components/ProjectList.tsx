import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';

interface ProjectListProps {
  onNavigateToDetail?: () => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ onNavigateToDetail }) => {
  const [activeTab, setActiveTab] = useState<'iwrs' | 'edc'>('iwrs');

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="px-5 pt-6 pb-2 sticky top-0 bg-[#f8fafc] z-40">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">我的项目</h1>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索项目编号或名称..."
            className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="px-5 mt-4 space-y-5">
        {/* 项目 1: 既有 IWRS 又有 EDC */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* 头部公用信息 */}
          <div className="p-4 pb-2">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-900 text-base">PROJ-2026-001</h3>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] rounded-full font-bold">进行中</span>
            </div>
            <p className="text-xs text-gray-500 line-clamp-1">阿兹海默症 III 期多中心临床试验</p>
          </div>

          {/* 文件夹风格 Tab 切换区 */}
          <div className="flex px-1 pt-2 items-end">
            <div
              className={`relative transition-all duration-300 border border-b-0 rounded-t-lg px-4 py-1.5 text-xs mr-1 cursor-pointer
                ${activeTab === 'iwrs' 
                  ? "bg-white text-gray-900 font-bold border-gray-200 border-t-[3px] border-t-blue-500 z-30 after:content-[''] after:absolute after:-bottom-[1px] after:left-0 after:right-0 after:h-[2px] after:bg-white" 
                  : "bg-gray-100 text-gray-500 border-gray-200 z-10"}`}
              onClick={() => setActiveTab('iwrs')}
            >
              IWRS 系统
            </div>
            <div
              className={`relative transition-all duration-300 border border-b-0 rounded-t-lg px-4 py-1.5 text-xs mr-1 cursor-pointer
                ${activeTab === 'edc' 
                  ? "bg-white text-gray-900 font-bold border-gray-200 border-t-[3px] border-t-emerald-500 z-30 after:content-[''] after:absolute after:-bottom-[1px] after:left-0 after:right-0 after:h-[2px] after:bg-white" 
                  : "bg-gray-100 text-gray-500 border-gray-200 z-10"}`}
              onClick={() => setActiveTab('edc')}
            >
              EDC 系统
            </div>
          </div>

          {/* 内容容器区 */}
          <div className="border-t border-gray-200 -mt-[1px] relative z-20">
            {/* IWRS 卡片内容 */}
            <div className={`p-4 pt-5 bg-white ${activeTab === 'iwrs' ? 'block' : 'hidden'}`}>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                  <div className="text-[10px] text-gray-400 mb-1">筛查中</div>
                  <div className="text-sm font-bold text-blue-600">18</div>
                </div>
                <div className="text-center border-l border-gray-100">
                  <div className="text-[10px] text-gray-400 mb-1">已随机</div>
                  <div className="text-sm font-bold text-blue-600">12<span className="text-[10px] text-gray-400 font-normal">/50</span></div>
                </div>
                <div className="text-center border-l border-gray-100">
                  <div className="text-[10px] text-gray-400 mb-1">物资余量</div>
                  <div className="text-sm font-bold text-blue-600">充足</div>
                </div>
              </div>
              <button 
                className="w-full py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-xs font-bold hover:bg-blue-100 transition flex justify-center items-center gap-1"
                onClick={onNavigateToDetail}
              >
                进入项目详情 <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* EDC 卡片内容 */}
            <div className={`p-4 pt-5 bg-white ${activeTab === 'edc' ? 'block' : 'hidden'}`}>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                  <div className="text-[10px] text-gray-400 mb-1">访视中</div>
                  <div className="text-sm font-bold text-emerald-600">10</div>
                </div>
                <div className="text-center border-l border-gray-100">
                  <div className="text-[10px] text-gray-400 mb-1">表单录入</div>
                  <div className="text-sm font-bold text-emerald-600">45%</div>
                </div>
                <div className="text-center border-l border-gray-100">
                  <div className="text-[10px] text-gray-400 mb-1">待办质疑</div>
                  <div className="text-sm font-bold text-rose-500">4</div>
                </div>
              </div>
              <button 
                className="w-full py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-xs font-bold hover:bg-emerald-100 transition flex justify-center items-center gap-1"
                onClick={onNavigateToDetail}
              >
                进入项目详情 <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* 项目 2: 仅有 EDC */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
          {/* 头部公用信息 */}
          <div className="p-4 pb-3 border-b border-gray-50 pl-5">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-base">PROJ-2025-042</h3>
                <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded">仅 EDC</span>
              </div>
              <span className="px-2 py-0.5 bg-gray-50 text-gray-500 border border-gray-200 text-[10px] rounded-full font-bold">已结束</span>
            </div>
            <p className="text-xs text-gray-500 line-clamp-1">某创新药真实世界研究</p>
          </div>
          
          {/* EDC 卡片内容 */}
          <div className="p-4 bg-white pl-5">
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <div className="text-[10px] text-gray-400 mb-1">总受试者</div>
                <div className="text-sm font-bold text-gray-700">120</div>
              </div>
              <div className="text-center border-l border-gray-100">
                <div className="text-[10px] text-gray-400 mb-1">表单录入</div>
                <div className="text-sm font-bold text-gray-700">100%</div>
              </div>
              <div className="text-center border-l border-gray-100">
                <div className="text-[10px] text-gray-400 mb-1">待办质疑</div>
                <div className="text-sm font-bold text-gray-400">0</div>
              </div>
            </div>
            <button 
              className="w-full py-2 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-100 transition flex justify-center items-center gap-1"
              onClick={onNavigateToDetail}
            >
              进入项目详情 <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        {/* 项目 3: 仅有 IWRS */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
          {/* 头部公用信息 */}
          <div className="p-4 pb-3 border-b border-gray-50 pl-5">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-base">PROJ-2027-018</h3>
                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold rounded">仅 IWRS</span>
              </div>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 text-[10px] rounded-full font-bold">筹备期</span>
            </div>
            <p className="text-xs text-gray-500 line-clamp-1">某靶向药 I 期剂量递增试验</p>
          </div>
          
          {/* IWRS 卡片内容 */}
          <div className="p-4 bg-white pl-5">
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <div className="text-[10px] text-gray-400 mb-1">中心启动</div>
                <div className="text-sm font-bold text-gray-700">2<span className="text-[10px] text-gray-400 font-normal">/5</span></div>
              </div>
              <div className="text-center border-l border-gray-100">
                <div className="text-[10px] text-gray-400 mb-1">物资入库</div>
                <div className="text-sm font-bold text-blue-600">待完成</div>
              </div>
              <div className="text-center border-l border-gray-100">
                <div className="text-[10px] text-gray-400 mb-1">随机池</div>
                <div className="text-sm font-bold text-gray-700">已生成</div>
              </div>
            </div>
            <button 
              className="w-full py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-xs font-bold hover:bg-blue-100 transition flex justify-center items-center gap-1"
              onClick={onNavigateToDetail}
            >
              进入项目详情 <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
