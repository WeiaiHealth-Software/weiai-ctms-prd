import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Plus, 
  Search, 
  ChevronRight,
  Edit,
  Link
} from 'lucide-react';

interface ProjectDetailProps {
  onBack?: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'iwrs' | 'edc'>('iwrs');

  return (
    <div className="flex flex-col h-full relative z-10 bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white px-4 py-3 flex items-center border-b border-gray-200 z-40">
          <button className="text-gray-500 mr-4" onClick={onBack}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold flex-1 text-center mr-10">项目详情</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 pb-10 scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {/* 项目宏观信息卡片 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-5 relative overflow-hidden">
            {/* 绝对定位的状态标签 */}
            <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-bl-lg z-10">
              进行中
            </div>
            
            <div className="p-4 pt-10">
              <h2 className="text-lg font-bold text-gray-900 leading-tight mb-4">一项评价某药物在晚期实体瘤患者中的安全性及有效性的II期临床试验</h2>
              
              <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 text-xs">项目编号</span>
                  <span className="font-medium text-gray-800">PRJ-2024-001</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 text-xs">项目阶段</span>
                  <span className="font-medium text-gray-800">II期</span>
                </div>
                <div className="flex flex-col gap-1 col-span-2">
                  <span className="text-gray-400 text-xs">主要研究者</span>
                  <span className="font-medium text-gray-800">张建国 主任</span>
                </div>
                <div className="flex flex-col gap-1 col-span-2">
                  <span className="text-gray-400 text-xs">申办方</span>
                  <span className="font-medium text-gray-800">康和医药科技有限公司</span>
                </div>
              </div>
            </div>
          </div>

          {/* 文件夹式模块 Tabs */}
          <div className="flex space-x-1">
            <div 
              onClick={() => setActiveTab('iwrs')}
              className={`rounded-t-lg px-4 py-2 text-sm font-medium cursor-pointer transition-all border border-b-0 -mb-px relative z-[1] ${
                activeTab === 'iwrs' 
                  ? 'bg-white text-blue-600 border-gray-200 z-[10]' 
                  : 'bg-gray-100 text-gray-500 border-transparent'
              }`}
            >
              IWRS 随机化
            </div>
            <div 
              onClick={() => setActiveTab('edc')}
              className={`rounded-t-lg px-4 py-2 text-sm font-medium cursor-pointer transition-all border border-b-0 -mb-px relative z-[1] ${
                activeTab === 'edc' 
                  ? 'bg-white text-emerald-500 border-gray-200 z-[10]' 
                  : 'bg-gray-100 text-gray-500 border-transparent'
              }`}
            >
              EDC 数据采集
            </div>
          </div>

          {/* 内容容器 */}
          <div className="bg-white border border-gray-200 rounded-lg rounded-tl-none p-4 relative z-[5] shadow-sm min-h-[400px]">
            {/* ================= IWRS 内容模块 ================= */}
            {activeTab === 'iwrs' && (
              <div className="block">
                {/* 进度条 */}
                <div className="mb-5">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600 font-medium">总入组进度</span>
                    <span className="text-blue-600 font-bold">45 / 100</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>

                {/* 核心数据看板 */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col justify-center items-center">
                    <div className="text-sm text-blue-600 mb-1">已入组</div>
                    <div className="text-2xl font-bold text-gray-900">45</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col justify-center items-center">
                    <div className="text-sm text-blue-600 mb-1">待处理预约</div>
                    <div className="text-2xl font-bold text-gray-900">12</div>
                  </div>
                </div>

                {/* 快捷操作区 */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button className="bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm text-center shadow-sm flex justify-center items-center">
                    <Plus className="w-4 h-4 mr-1" />
                    新增受试者
                  </button>
                  <button className="bg-white border border-blue-600 text-blue-600 py-2.5 rounded-lg font-medium text-sm text-center shadow-sm">
                    处理预约
                  </button>
                </div>

                {/* 分组概览 */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-bold text-gray-800">项目分组概览</h3>
                    <span className="text-xs text-gray-400">共 2 个分组</span>
                  </div>

                  {/* 试验组 A */}
                  <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-lg text-gray-900">试验组 A</h4>
                    </div>
                    <div className="flex items-center text-gray-400 text-xs mb-4">
                      <Link className="w-3 h-3 mr-1" />
                      低浓度阿托品 0.01%
                    </div>

                    {/* 整体进度 */}
                    <div className="flex justify-between gap-4 mb-4 pb-4 border-b border-gray-50">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">已入组</span>
                          <span className="text-blue-600 font-bold">45</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      <div className="w-px bg-gray-200"></div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">剩余名额</span>
                          <span className="text-gray-900 font-bold">55</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className="bg-gray-300 h-1.5 rounded-full" style={{ width: '55%' }}></div>
                        </div>
                      </div>
                    </div>

                    {/* 因子维度分布 */}
                    <div>
                      <div className="text-xs text-gray-400 mb-3">因子维度分布</div>
                      <div className="space-y-3">
                        <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-3">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">性别:男</span>
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">年龄:4~7岁</span>
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">屈光:-1.50~0.00D</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-400 h-2 rounded-full" style={{ width: '66.6%' }}></div>
                            </div>
                            <span className="text-xs font-medium text-gray-700">10/15</span>
                          </div>
                        </div>
                        <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-3">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">性别:女</span>
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">年龄:8~10岁</span>
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">屈光:0.01~1.50D</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-400 h-2 rounded-full" style={{ width: '50%' }}></div>
                            </div>
                            <span className="text-xs font-medium text-gray-700">10/20</span>
                          </div>
                        </div>
                        <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-3">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">性别:男</span>
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">年龄:11~14岁</span>
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">屈光:-1.50~0.00D</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-400 h-2 rounded-full" style={{ width: '53.3%' }}></div>
                            </div>
                            <span className="text-xs font-medium text-gray-700">8/15</span>
                          </div>
                        </div>
                        <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-3">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">性别:女</span>
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">年龄:4~7岁</span>
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">屈光:0.01~1.50D</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-400 h-2 rounded-full" style={{ width: '28%' }}></div>
                            </div>
                            <span className="text-xs font-medium text-gray-700">14/50</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 对照组 B */}
                  <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-lg text-gray-900">对照组 B</h4>
                    </div>
                    <div className="flex items-center text-gray-400 text-xs mb-4">
                      <Link className="w-3 h-3 mr-1" />
                      安慰剂
                    </div>

                    {/* 整体进度 */}
                    <div className="flex justify-between gap-4 mb-4 pb-4 border-b border-gray-50">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">已入组</span>
                          <span className="text-blue-600 font-bold">42</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '42%' }}></div>
                        </div>
                      </div>
                      <div className="w-px bg-gray-200"></div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">剩余名额</span>
                          <span className="text-gray-900 font-bold">58</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className="bg-gray-300 h-1.5 rounded-full" style={{ width: '58%' }}></div>
                        </div>
                      </div>
                    </div>

                    {/* 因子维度分布 */}
                    <div>
                      <div className="text-xs text-gray-400 mb-3">因子维度分布</div>
                      <div className="space-y-3">
                        <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-3">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">性别:男</span>
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">年龄:4~7岁</span>
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">屈光:-1.50~0.00D</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-400 h-2 rounded-full" style={{ width: '66.6%' }}></div>
                            </div>
                            <span className="text-xs font-medium text-gray-700">10/15</span>
                          </div>
                        </div>
                        <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-3">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">性别:女</span>
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">年龄:8~10岁</span>
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">屈光:0.01~1.50D</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-400 h-2 rounded-full" style={{ width: '50%' }}></div>
                            </div>
                            <span className="text-xs font-medium text-gray-700">10/20</span>
                          </div>
                        </div>
                        <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-3">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">性别:男</span>
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">年龄:11~14岁</span>
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">屈光:-1.50~0.00D</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-400 h-2 rounded-full" style={{ width: '53.3%' }}></div>
                            </div>
                            <span className="text-xs font-medium text-gray-700">8/15</span>
                          </div>
                        </div>
                        <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-3">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">性别:女</span>
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">年龄:4~7岁</span>
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">屈光:0.01~1.50D</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-400 h-2 rounded-full" style={{ width: '28%' }}></div>
                            </div>
                            <span className="text-xs font-medium text-gray-700">14/50</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 受试者表格 */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-bold text-gray-800">受试者表格</h3>
                    <div className="flex gap-2">
                      <div className="relative">
                        <input type="text" placeholder="姓名" className="w-20 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500" />
                        <Search className="w-3 h-3 text-gray-400 absolute right-2 top-1.5" />
                      </div>
                      <select className="border border-gray-200 rounded px-2 py-1 text-xs bg-white text-gray-600 focus:outline-none focus:border-blue-500 appearance-none pr-6 relative">
                        <option>已入组</option>
                        <option>筛查中</option>
                        <option>已脱落</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 text-gray-500 text-xs border-b border-gray-100">
                          <th className="py-3 px-4 font-medium">姓名/状态</th>
                          <th className="py-3 px-2 font-medium">组别</th>
                          <th className="py-3 px-4 font-medium text-center">操作</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50/50">
                          <td className="py-3 px-4">
                            <div className="font-bold text-gray-900 mb-1">李强</div>
                            <span className="inline-block px-1.5 py-0.5 bg-green-50 text-green-600 text-[10px] rounded border border-green-100">已入组</span>
                          </td>
                          <td className="py-3 px-2 text-gray-800 font-medium">试验组 A</td>
                          <td className="py-3 px-4 text-center">
                            <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold">查看</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50/50">
                          <td className="py-3 px-4">
                            <div className="font-bold text-gray-900 mb-1">张三</div>
                            <span className="inline-block px-1.5 py-0.5 bg-amber-50 text-amber-600 text-[10px] rounded border border-amber-200">待入组</span>
                          </td>
                          <td className="py-3 px-2 text-gray-800 font-medium">-</td>
                          <td className="py-3 px-4 text-center">
                            <button className="px-3 py-1 bg-amber-50 text-amber-600 rounded text-xs font-bold whitespace-nowrap">处理预约</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50/50">
                          <td className="py-3 px-4">
                            <div className="font-bold text-gray-900 mb-1">赵敏</div>
                            <span className="inline-block px-1.5 py-0.5 bg-green-50 text-green-600 text-[10px] rounded border border-green-100">已入组</span>
                          </td>
                          <td className="py-3 px-2 text-gray-800 font-medium">对照组 B</td>
                          <td className="py-3 px-4 text-center">
                            <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold">查看</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50/50">
                          <td className="py-3 px-4">
                            <div className="font-bold text-gray-900 mb-1">陈晨</div>
                            <span className="inline-block px-1.5 py-0.5 bg-green-50 text-green-600 text-[10px] rounded border border-green-100">已入组</span>
                          </td>
                          <td className="py-3 px-2 text-gray-800 font-medium">试验组 A</td>
                          <td className="py-3 px-4 text-center">
                            <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold">查看</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50/50">
                          <td className="py-3 px-4">
                            <div className="font-bold text-gray-900 mb-1">王五</div>
                            <span className="inline-block px-1.5 py-0.5 bg-amber-50 text-amber-600 text-[10px] rounded border border-amber-200">待入组</span>
                          </td>
                          <td className="py-3 px-2 text-gray-800 font-medium">-</td>
                          <td className="py-3 px-4 text-center">
                            <button className="px-3 py-1 bg-amber-50 text-amber-600 rounded text-xs font-bold whitespace-nowrap">处理预约</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================= EDC 内容模块 ================= */}
            {activeTab === 'edc' && (
              <div className="block">
                {/* 进度条 */}
                <div className="mb-5">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600 font-medium">CRF 整体完成度</span>
                    <span className="text-green-600 font-bold">82%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>

                {/* 核心数据看板 */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex flex-col justify-center items-center">
                    <div className="text-xs text-green-700 mb-1">待填表单</div>
                    <div className="text-xl font-bold text-gray-900">24</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex flex-col justify-center items-center relative">
                    <div className="text-xs text-green-700 mb-1">未解决质疑</div>
                    <div className="text-xl font-bold text-gray-900">8</div>
                    {/* 红点提示 */}
                    <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex flex-col justify-center items-center">
                    <div className="text-xs text-green-700 mb-1">待签名</div>
                    <div className="text-xl font-bold text-gray-900">15</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex flex-col justify-center items-center">
                    <div className="text-xs text-green-700 mb-1">SDV 完成率</div>
                    <div className="text-xl font-bold text-gray-900">65%</div>
                  </div>
                </div>

                {/* 快捷操作区 */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button className="bg-green-600 text-white py-2.5 rounded-lg font-medium text-sm text-center shadow-sm flex justify-center items-center">
                    <Edit className="w-4 h-4 mr-1" />
                    录入数据
                  </button>
                  <button className="bg-white border border-green-600 text-green-600 py-2.5 rounded-lg font-medium text-sm text-center shadow-sm">
                    处理质疑
                  </button>
                </div>

                {/* 最近任务列表 */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex justify-between items-center">
                    <span>待办录入 & 质疑</span>
                    <a href="#" className="text-xs text-green-600 font-normal">查看全部 &gt;</a>
                  </h3>
                  <div className="space-y-3">
                    <div className="border border-red-200 bg-red-50/50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded border border-red-200">系统质疑</span>
                        <span className="text-xs text-gray-500">刚刚</span>
                      </div>
                      <div className="font-bold text-gray-800 text-sm">SUB-045 - 生命体征</div>
                      <div className="text-xs text-gray-600 mt-1">收缩压 (160) 超出正常参考范围，请核实。</div>
                    </div>
                    <div className="border border-gray-100 bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded border border-green-200">待录入</span>
                        <span className="text-xs text-gray-500">今天 10:00</span>
                      </div>
                      <div className="font-bold text-gray-800 text-sm">SUB-021 - V2 访视访视表</div>
                      <div className="text-xs text-gray-600 mt-1">受试者已完成访视，请尽快补充实验室检查数据。</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
    </div>
  );
};

export default ProjectDetail;
