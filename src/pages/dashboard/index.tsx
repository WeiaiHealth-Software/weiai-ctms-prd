import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useHeaderStore } from '../../store/useHeaderStore';
import { ArrowUp, ArrowDown, RefreshCw, Users, FileCheck, Clock } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);

  useEffect(() => {
    setTitle('系统总览', '项目、中心与受试者关键指标概览', [{ text: '所有角色', color: 'slate' }]);
  }, [setTitle]);

  const ageGenderOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: {
      bar: { horizontal: true, borderRadius: 4, dataLabels: { position: 'top' } }
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 1, colors: ['#fff'] },
    tooltip: { shared: true, intersect: false },
    xaxis: { categories: ["15-24", "25-34", "35-44", "45-54", "55-64", "65+"] },
    colors: ["#60a5fa", "#34d399"]
  };

  const ageGenderSeries = [
    { name: "Male", data: [25, 40, 32, 28, 18, 10] },
    { name: "Female", data: [22, 45, 38, 20, 15, 8] }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Top 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium">项目总数</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">2,450</p>
          <div className="flex items-center mt-2">
            <span className="text-emerald-500 text-sm font-medium flex items-center bg-emerald-50 px-2 py-0.5 rounded-md">
              <ArrowUp size={14} className="mr-1" /> 20%
            </span>
            <span className="text-slate-400 text-sm ml-2">较上月</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium">中心总数</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">380</p>
          <div className="flex items-center mt-2">
            <span className="text-red-500 text-sm font-medium flex items-center bg-red-50 px-2 py-0.5 rounded-md">
              <ArrowDown size={14} className="mr-1" /> 12%
            </span>
            <span className="text-slate-400 text-sm ml-2">较上月</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium">患者总数</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">1,120</p>
          <div className="flex items-center mt-2">
            <span className="text-emerald-500 text-sm font-medium flex items-center bg-emerald-50 px-2 py-0.5 rounded-md">
              <ArrowUp size={14} className="mr-1" /> 18%
            </span>
            <span className="text-slate-400 text-sm ml-2">较上月</span>
          </div>
        </div>
      </div>

       {/* Bottom section cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <h4 className="text-slate-800 font-semibold mb-1">今日新增受试者</h4>
            <p className="text-2xl font-bold text-slate-900">42</p>
            <p className="text-sm text-slate-500 mt-1">分布在 12 个活跃项目中</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <FileCheck size={24} />
          </div>
          <div>
            <h4 className="text-slate-800 font-semibold mb-1">待处理的 Query</h4>
            <p className="text-2xl font-bold text-slate-900">156</p>
            <p className="text-sm text-slate-500 mt-1">较昨日减少 8%</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <h4 className="text-slate-800 font-semibold mb-1">即将超期随访</h4>
            <p className="text-2xl font-bold text-slate-900">28</p>
            <p className="text-sm text-slate-500 mt-1">需要在 3 天内完成</p>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-full">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
            <h3 className="text-slate-800 font-bold text-lg">数据完整度</h3>
            <p className="text-slate-500 text-sm mt-1">实时数据质量监控</p>
            <div className="flex-1 flex flex-col justify-center items-center my-8">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(#4f46e5 0% 72%, #f1f5f9 72% 100%)' }}></div>
                <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-4xl font-black text-slate-800">72%</span>
                </div>
              </div>
            </div>
            <div className="text-center bg-slate-50 rounded-xl p-4 mt-auto">
              <p className="text-brand-600 font-bold">状态良好</p>
              <p className="text-slate-500 text-xs mt-1">各项指标均在正常范围内</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 h-full">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-slate-800 font-bold text-lg">受试者年龄性别分布</h3>
                <p className="text-slate-500 text-sm mt-1">入组人群结构分析</p>
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 transition-all">
                <RefreshCw size={16} />
              </button>
            </div>
            <div className="w-full flex-1 min-h-[300px]">
               <Chart options={ageGenderOptions as any} series={ageGenderSeries} type="bar" height="100%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
