import React, { useState } from 'react';
import { useProjectWizardStore } from '../../../store/useProjectWizardStore';
import { Shuffle, SlidersHorizontal, Plus } from 'lucide-react';

export const Step3Grouping: React.FC = () => {
  const { 
    totalCount, 
    matchMode, 
    isFissionMode, 
    groups, 
    dimensionFactors,
    updateGrouping 
  } = useProjectWizardStore();

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroupExpand = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const total = parseInt(e.target.value) || 0;
    updateGrouping({ totalCount: total });
  };

  const handleAddGroup = () => {
    const newGroups = [
      ...groups,
      {
        id: `g${Date.now()}`,
        name: `新分组 ${groups.length + 1}`,
        medicine: '',
        count: 0,
        factors: dimensionFactors.reduce((acc, factor) => ({ ...acc, [factor]: 0 }), {})
      }
    ];
    updateGrouping({ groups: newGroups });
  };

  return (
    <div className="animate-fade-in pb-10">
      {/* Header with Toggle */}
      <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">分组与随机化配置</h3>
          <p className="text-sm text-slate-500 mt-1">配置各组比例及随机化算法</p>
        </div>
        <div className="flex items-center bg-slate-50 rounded-xl p-2 border border-slate-200 shadow-sm">
          <div className="mr-4 text-right">
            <span className="block text-sm font-bold text-slate-700">二阶段裂变 (Multi-stage)</span>
            <span className="block text-xs text-slate-400 mt-0.5">支持二次随机化分配</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={isFissionMode}
              onChange={(e) => updateGrouping({ isFissionMode: e.target.checked })}
            />
            <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-600"></div>
          </label>
        </div>
      </div>

      {!isFissionMode ? (
        <div className="space-y-8 animate-fade-in">
          {/* Grouping Mode */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-3">选择分组模式</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="relative cursor-pointer group">
                <input 
                  type="radio" 
                  className="peer sr-only" 
                  checked={matchMode === 'random'}
                  onChange={() => updateGrouping({ matchMode: 'random' })}
                />
                <div className="p-5 rounded-2xl border-2 border-slate-200 hover:border-brand-300 peer-checked:border-brand-500 peer-checked:bg-brand-50 transition-all shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 peer-checked:bg-brand-100 peer-checked:text-brand-600 flex items-center justify-center transition-colors">
                      <Shuffle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-700 peer-checked:text-brand-800 text-sm">均匀分组 (Uniform)</span>
                      <span className="text-xs text-slate-500 mt-1 block">系统自动均匀分配，适合完全随机场景。</span>
                    </div>
                  </div>
                </div>
              </label>
              <label className="relative cursor-pointer group">
                <input 
                  type="radio" 
                  className="peer sr-only" 
                  checked={matchMode === 'free'}
                  onChange={() => updateGrouping({ matchMode: 'free' })}
                />
                <div className="p-5 rounded-2xl border-2 border-slate-200 hover:border-brand-300 peer-checked:border-brand-500 peer-checked:bg-brand-50 transition-all shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 peer-checked:bg-brand-100 peer-checked:text-brand-600 flex items-center justify-center transition-colors">
                      <SlidersHorizontal className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-700 peer-checked:text-brand-800 text-sm">自由分组 (Free)</span>
                      <span className="text-xs text-slate-500 mt-1 block">手动调整各组配额，适合复杂干预场景。</span>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Total Count */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label className="font-bold text-slate-700 text-base">项目总人数:</label>
            <div className="relative w-40">
              <input 
                type="number" 
                value={totalCount}
                onChange={handleTotalChange}
                className="w-full pl-4 pr-10 py-2.5 border-2 border-slate-200 rounded-xl font-bold text-xl text-center focus:border-brand-500 focus:outline-none transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">人</span>
            </div>
            <div className="text-xs text-slate-400 sm:ml-auto bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
              * 修改总人数将自动平均分配给各分组
            </div>
          </div>

          {/* Groups Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {groups.map((group, index) => (
              <div key={group.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 font-bold flex items-center justify-center">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <input 
                      type="text" 
                      value={group.name} 
                      className="font-bold text-slate-800 bg-transparent border-b border-dashed border-slate-300 focus:border-brand-500 focus:outline-none px-1 py-0.5 w-32"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-500">配额</span>
                    <input 
                      type="number" 
                      value={group.count}
                      readOnly={matchMode === 'random'}
                      className={`w-20 text-center font-bold rounded-lg border px-2 py-1 ${matchMode === 'random' ? 'bg-slate-100 border-transparent text-slate-500' : 'bg-white border-slate-300 text-brand-600 focus:border-brand-500 focus:outline-none'}`}
                    />
                  </div>
                </div>
                <div className="p-5">
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">关联产品/药物</label>
                    <input type="text" value={group.medicine} placeholder="例如：0.01%阿托品" className="w-full text-sm border-slate-200 rounded-lg focus:border-brand-500 focus:ring-1 focus:ring-brand-500 py-2" />
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div 
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleGroupExpand(group.id)}
                    >
                      <span className="text-xs font-bold text-slate-600">维度因子组合 ({dimensionFactors.length})</span>
                      <span className="text-xs text-brand-600 font-medium flex items-center gap-1">
                        {expandedGroups[group.id] ? '收起' : '展开查看'}
                      </span>
                    </div>
                    
                    {expandedGroups[group.id] && (
                      <div className="mt-3 space-y-2 border-t border-slate-200 pt-3">
                        {dimensionFactors.map((factor, fIdx) => (
                          <div key={fIdx} className="flex justify-between items-center bg-white rounded-lg px-3 py-2 border border-slate-100 shadow-sm">
                            <div className="flex gap-2">
                              {factor.split(' ').map((part, pIdx) => (
                                <span key={pIdx} className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                  {part}
                                </span>
                              ))}
                            </div>
                            <input 
                              type="number"
                              className={`w-16 text-center text-sm font-bold rounded focus:outline-none py-1 ${matchMode === 'random' ? 'bg-slate-50 text-slate-500 border-transparent' : 'bg-white text-slate-700 border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500'}`}
                              value={group.factors?.[factor] || 0}
                              readOnly={matchMode === 'random'}
                              onChange={(e) => {
                                if (matchMode === 'free') {
                                  const val = parseInt(e.target.value) || 0;
                                  const newFactors = { ...group.factors, [factor]: val };
                                  const newCount = Object.values(newFactors).reduce((a, b) => a + b, 0);
                                  
                                  const newGroups = groups.map(g => 
                                    g.id === group.id 
                                      ? { ...g, count: newCount, factors: newFactors }
                                      : g
                                  );
                                  updateGrouping({ groups: newGroups });
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleAddGroup} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-all flex justify-center items-center gap-2 shadow-sm">
            <Plus className="w-5 h-5" /> 增加新的分组
          </button>
        </div>
      ) : (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 text-center animate-fade-in">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <span className="text-2xl">⎇</span>
          </div>
          <h4 className="text-lg font-bold text-indigo-900 mb-2">已开启二阶段裂变模式</h4>
          <p className="text-sm text-indigo-700/80 max-w-md mx-auto">
            在此模式下，受试者在完成第一阶段研究后，将根据触发规则进入第二阶段子组的再次随机化分配。
          </p>
          <button className="mt-6 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all">
            配置裂变规则
          </button>
        </div>
      )}
    </div>
  );
};
