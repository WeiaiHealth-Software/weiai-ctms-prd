import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useProjectWizardStore } from '../../../store/useProjectWizardStore';
import { Shuffle, SlidersHorizontal, Plus, AlertTriangle } from 'lucide-react';

export const Step3Grouping: React.FC = () => {
  const { 
    totalCount, 
    matchMode, 
    isFissionMode, 
    groups, 
    dimensionFactors,
    updateGrouping,
    setStep
  } = useProjectWizardStore();

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [showFissionConfirm, setShowFissionConfirm] = useState(false);
  
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
        name: `分组 ${groups.length + 1}`,
        medicine: '',
        count: 0,
        factors: dimensionFactors.reduce((acc, factor) => ({ ...acc, [factor]: 0 }), {})
      }
    ];
    updateGrouping({ groups: newGroups });
  };

  const handleToggleFission = (checked: boolean) => {
    if (checked) {
      setShowFissionConfirm(true);
    } else {
      updateGrouping({ isFissionMode: false });
    }
  };

  const confirmEnableFission = () => {
    updateGrouping({ isFissionMode: true });
    setShowFissionConfirm(false);
    setStep(4);
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
              onChange={(e) => handleToggleFission(e.target.checked)}
            />
            <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-600"></div>
          </label>
        </div>
      </div>

      {isFissionMode && (
        <div className="mb-8 bg-brand-50 border border-brand-100 rounded-2xl p-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-brand-800">已开启二阶段裂变</div>
            <div className="text-xs text-brand-700 mt-1">一阶段分组配置保留不变，裂变配置在下一步完成。</div>
          </div>
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all active:scale-95 whitespace-nowrap"
            onClick={() => setStep(4)}
          >
            前往裂变配置
          </button>
        </div>
      )}

      <div className="space-y-8">
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
                      onChange={(e) => {
                        const newGroups = groups.map(g => g.id === group.id ? { ...g, name: e.target.value } : g);
                        updateGrouping({ groups: newGroups });
                      }}
                      className="font-bold text-slate-800 bg-transparent border-b border-dashed border-slate-300 focus:border-brand-500 focus:outline-none px-1 py-0.5 w-32"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-500">配额</span>
                    <input 
                      type="number" 
                      value={group.count}
                      onChange={(e) => {
                        if (matchMode === 'free') {
                          const count = parseInt(e.target.value) || 0;
                          const newGroups = groups.map(g => g.id === group.id ? { ...g, count } : g);
                          const newTotal = newGroups.reduce((acc, g) => acc + g.count, 0);
                          updateGrouping({ groups: newGroups, totalCount: newTotal });
                        }
                      }}
                      readOnly={matchMode === 'random'}
                      className={`w-20 text-center font-bold rounded-lg border px-2 py-1 ${matchMode === 'random' ? 'bg-slate-100 border-transparent text-slate-500' : 'bg-white border-slate-300 text-brand-600 focus:border-brand-500 focus:outline-none'}`}
                    />
                  </div>
                </div>
                <div className="p-5">
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">关联产品/药物</label>
                    <input 
                      type="text" 
                      value={group.medicine} 
                      onChange={(e) => {
                        const newGroups = groups.map(g => g.id === group.id ? { ...g, medicine: e.target.value } : g);
                        updateGrouping({ groups: newGroups });
                      }}
                      placeholder="例如：0.01%阿托品" 
                      className="w-full text-sm border-slate-200 rounded-lg focus:border-brand-500 focus:ring-1 focus:ring-brand-500 py-2" 
                    />
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

      {/* 裂变开启确认 Modal */}
      {showFissionConfirm && typeof document !== 'undefined'
        ? createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-amber-100 rounded-full mb-5">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-center text-slate-800 mb-2">
                    开启二阶段裂变？
                  </h3>
                  <p className="text-center text-slate-500 mb-6 text-sm leading-relaxed">
                    请确保已完成一阶段分组配置，<span className="text-amber-600 font-bold">开启后不可更改一阶段设置</span>。
                  </p>
                  
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-500">当前分组模式</span>
                      <span className="text-xs font-bold text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">{matchMode === 'random' ? '均匀分组 (Uniform)' : '自由分组 (Free)'}</span>
                    </div>
                    <div className="space-y-3">
                      {groups.map(group => (
                        <div key={group.id} className="flex justify-between items-center">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm font-bold text-slate-700 truncate">{group.name}</span>
                            <span className="text-[10px] text-slate-400 bg-slate-200/50 px-1.5 py-0.5 rounded shrink-0">{group.medicine || '无产品'}</span>
                          </div>
                          <span className="text-sm font-bold text-slate-600 whitespace-nowrap">{group.count} 人</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowFissionConfirm(false)}
                      className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      再想想
                    </button>
                    <button
                      onClick={confirmEnableFission}
                      className="flex-1 px-4 py-2.5 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all active:scale-95"
                    >
                      确认开启
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
};
