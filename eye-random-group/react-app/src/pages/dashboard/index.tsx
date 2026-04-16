import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useHeaderStore } from '../../store/useHeaderStore';
import { ArrowUp, ArrowDown, Calendar, RefreshCw } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const setTitle = useHeaderStore(state => state.setTitle);
  const chinaMapRef = useRef<HTMLDivElement>(null);
  const ageGenderRef = useRef<HTMLDivElement>(null);
  const radarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitle('系统总览', '项目、中心与受试者关键指标概览', [{ text: '所有角色', color: 'slate' }]);
  }, [setTitle]);

  useEffect(() => {
    let chinaChart: echarts.ECharts | null = null;
    let ageChart: echarts.ECharts | null = null;
    let radarChart: echarts.ECharts | null = null;

    const initCharts = async () => {
      // 1. 中国地图
      if (chinaMapRef.current) {
        chinaChart = echarts.init(chinaMapRef.current);
        const centers = [
          { name: "上海眼病防治中心", value: 120, coord: [121.4737, 31.2304] },
          { name: "广州中山医院", value: 95, coord: [113.2644, 23.1291] }
        ];
        const option: echarts.EChartsOption = {
          tooltip: { trigger: "item", formatter: (p: any) => `${p.data.name}<br/>受试者：${p.data.value}` },
          geo: {
            map: "china",
            roam: false,
            label: { show: false },
            itemStyle: { areaColor: "#f1f5f9", borderColor: "#e2e8f0" },
            emphasis: { itemStyle: { areaColor: "#e0e7ff" } }
          },
          series: [
            {
              name: "Centers",
              type: "effectScatter",
              coordinateSystem: "geo",
              showEffectOn: "render",
              rippleEffect: { brushType: "stroke", scale: 3 },
              symbol: "pin",
              symbolSize: 30,
              itemStyle: { color: "#4f46e5" },
              label: { show: true, formatter: "{b}", position: "top", color: "#334155", fontSize: 12 },
              data: centers.map(c => ({ name: c.name, value: c.value, coord: c.coord }))
            }
          ]
        };

        const apply = () => chinaChart?.setOption(option);

        try {
          if (!echarts.getMap("china")) {
            const resp = await fetch("https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=100000_full");
            if (resp.ok) {
              const geo = await resp.json();
              echarts.registerMap("china", geo);
            }
          }
          apply();
        } catch (err) {
          console.error('Failed to load china map data', err);
          apply();
        }
      }

      // 2. 年龄性别分布图
      if (ageGenderRef.current) {
        ageChart = echarts.init(ageGenderRef.current);
        const option: echarts.EChartsOption = {
          tooltip: { trigger: "axis" },
          legend: { data: ["Male", "Female"] },
          grid: { left: 60, right: 20, top: 30, bottom: 20 },
          xAxis: { type: "value" },
          yAxis: { type: "category", data: ["15-24", "25-34", "35-44", "45-54", "55-64", "65+"] },
          series: [
            { name: "Male", type: "bar", data: [25, 40, 32, 28, 18, 10], itemStyle: { color: "#60a5fa" } },
            { name: "Female", type: "bar", data: [22, 45, 38, 20, 15, 8], itemStyle: { color: "#34d399" } }
          ]
        };
        ageChart.setOption(option);
      }

      // 3. 雷达图
      if (radarRef.current) {
        radarChart = echarts.init(radarRef.current);
        const option: echarts.EChartsOption = {
          tooltip: {},
          legend: { bottom: 0, data: ["Tiktok", "Twitter", "Facebook"] },
          radar: {
            indicator: [
              { name: "Fashion", max: 100 },
              { name: "Technology", max: 100 },
              { name: "Cars", max: 100 },
              { name: "Memes", max: 100 },
              { name: "Watches", max: 100 },
              { name: "Others", max: 100 }
            ]
          },
          series: [{
            type: "radar",
            data: [
              { value: [80, 65, 40, 70, 30, 55], name: "Tiktok", areaStyle: { color: "rgba(234,88,12,0.2)" } },
              { value: [60, 75, 45, 50, 40, 60], name: "Twitter", areaStyle: { color: "rgba(59,130,246,0.2)" } },
              { value: [50, 55, 35, 40, 45, 50], name: "Facebook", areaStyle: { color: "rgba(52,211,153,0.2)" } }
            ]
          }]
        };
        radarChart.setOption(option);
      }
    };

    initCharts();

    const handleResize = () => {
      chinaChart?.resize();
      ageChart?.resize();
      radarChart?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chinaChart?.dispose();
      ageChart?.dispose();
      radarChart?.dispose();
    };
  }, []);

  return (
    <div className="animate-fade-in space-y-6">
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

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-slate-800 font-bold text-lg">数据完整度</h3>
            <p className="text-slate-500 text-sm mt-1">实时数据质量监控</p>
            <div className="my-8 flex justify-center">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(#4f46e5 0% 72%, #f1f5f9 72% 100%)' }}></div>
                <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-3xl font-black text-slate-800">72%</span>
                </div>
              </div>
            </div>
            <div className="text-center bg-slate-50 rounded-xl p-4">
              <p className="text-brand-600 font-bold">状态良好</p>
              <p className="text-slate-500 text-xs mt-1">各项指标均在正常范围内</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="text-slate-800 font-bold text-lg mb-4">受试者特征雷达</h3>
             <div ref={radarRef} className="w-full h-64"></div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-slate-800 font-bold text-lg">全国中心分布</h3>
                <p className="text-slate-500 text-sm mt-1">各中心患者招募地理位置</p>
              </div>
              <button className="flex items-center text-sm border px-3 py-1.5 rounded-xl text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all font-medium">
                <Calendar size={16} className="mr-2 text-slate-400" /> 本月
              </button>
            </div>
            <div ref={chinaMapRef} className="w-full h-96 rounded-xl bg-slate-50/50 border border-slate-100"></div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-slate-800 font-bold text-lg">受试者年龄性别分布</h3>
                <p className="text-slate-500 text-sm mt-1">入组人群结构分析</p>
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 transition-all">
                <RefreshCw size={16} />
              </button>
            </div>
            <div ref={ageGenderRef} className="w-full h-64"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
