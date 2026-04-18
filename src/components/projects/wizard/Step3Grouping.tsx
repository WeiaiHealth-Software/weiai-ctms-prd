import React, { useState } from 'react';
import { useProjectWizardStore } from '../../../store/useProjectWizardStore';
import { Shuffle, SlidersHorizontal, Plus, AlertTriangle, Settings, GitFork } from 'lucide-react';

export const Step3Grouping: React.FC = () => {
  const { 
    totalCount, 
    matchMode, 
    isFissionMode, 
    groups, 
    dimensionFactors,
    fissionRules,
    updateGrouping 
  } = useProjectWizardStore();

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [showFissionConfirm, setShowFissionConfirm] = useState(false);
  const [selectedFissionGroupId, setSelectedFissionGroupId] = useState<string | null>(null);
  
  // 临时编辑裂变规则的状态
  const [editingRule, setEditingRule] = useState<any>(null);

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
      setSelectedFissionGroupId(null);
    }
  };

  const confirmEnableFission = () => {
    updateGrouping({ isFissionMode: true });
    setShowFissionConfirm(false);
  };

  const handleSelectFissionGroup = (groupId: string) => {
    setSelectedFissionGroupId(groupId);
    
    // 初始化编辑规则
    if (fissionRules[groupId]) {
      setEditingRule(JSON.parse(JSON.stringify(fissionRules[groupId])));
    } else {
      setEditingRule({
        triggerMode: 'manual',
        days: 180,
        medicalNote: '',
        balanceStrategy: 'simple',
        subGroups: [
          { id: `sub_${Date.now()}_1`, name: '裂变1组', count: 0, medicine: '' },
          { id: `sub_${Date.now()}_2`, name: '裂变2组', count: 0, medicine: '' }
        ]
      });
    }
  };

  const saveFissionRule = () => {
    if (selectedFissionGroupId && editingRule) {
      updateGrouping({
        fissionRules: {
          ...fissionRules,
          [selectedFissionGroupId]: editingRule
        }
      });
      // 保存成功后不一定需要清空选择，保留在当前页即可
      alert('裂变规则已保存');
    }
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

      {!isFissionMode ? (
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
      ) : (
        <div className="flex gap-6 h-[600px]">
          {/* 左侧：分组结构 */}
          <div className="flex-1 bg-slate-50/50 rounded-2xl border border-slate-200 p-6 flex flex-col h-full">
            <h4 className="text-sm font-bold text-slate-800 mb-1">项目分组结构</h4>
            <p className="text-xs text-slate-500 mb-6">配置第一阶段及裂变后的第二阶段分组逻辑</p>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex gap-6">
                {/* 第一阶段 */}
                <div className="flex-1 space-y-4">
                  <h5 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-200">第一阶段 (Stage 1)</h5>
                  {groups.map(group => (
                    <div key={`s1-${group.id}`} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm h-[88px] flex flex-col justify-center">
                      <div className="font-bold text-slate-800">{group.name}</div>
                      <div className="text-xs text-slate-500 mt-1">占比 {totalCount > 0 ? Math.round((group.count / totalCount) * 100) : 0}% ({group.count}人)</div>
                    </div>
                  ))}
                </div>
                
                {/* 第二阶段 */}
                <div className="flex-1 space-y-4">
                  <h5 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-200">第二阶段 (Stage 2)</h5>
                  {groups.map(group => {
                    const isSelected = selectedFissionGroupId === group.id;
                    const hasRule = !!fissionRules[group.id];
                    return (
                      <div 
                        key={`s2-${group.id}`} 
                        className={`bg-white p-4 rounded-xl border-2 transition-all h-[88px] flex items-center justify-between cursor-pointer ${isSelected ? 'border-brand-500 shadow-md ring-2 ring-brand-500/20' : 'border-slate-200 hover:border-brand-300 shadow-sm'}`}
                        onClick={() => handleSelectFissionGroup(group.id)}
                      >
                        <div>
                          <div className="font-bold text-slate-800">{group.name}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            {hasRule ? <span className="text-brand-600 font-medium">已配置裂变</span> : '维持原组'}
                          </div>
                        </div>
                        <button className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700">
                          <Settings className="w-3.5 h-3.5" />
                          {hasRule ? '编辑裂变' : '配置裂变'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：裂变规则配置 */}
          <div className="w-[400px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
            {selectedFissionGroupId && editingRule ? (
              <>
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
                  <div>
                    <h4 className="font-bold text-slate-800">裂变规则配置</h4>
                    <p className="text-xs text-slate-500 mt-0.5">设置触发条件与分配逻辑</p>
                  </div>
                  <div className="text-xs font-bold text-slate-700 bg-slate-200/50 px-2 py-1 rounded">
                    针对 {groups.find(g => g.id === selectedFissionGroupId)?.name}
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-6">
                  {/* 触发机制 */}
                  <div>
                    <h5 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                      <GitFork className="w-4 h-4 text-brand-500" /> 触发机制
                    </h5>
                    <div className="flex bg-slate-100 p-1 rounded-lg mb-3">
                      <button 
                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${editingRule.triggerMode === 'manual' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setEditingRule({ ...editingRule, triggerMode: 'manual' })}
                      >
                        主动触发
                      </button>
                      <button 
                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${editingRule.triggerMode === 'auto' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setEditingRule({ ...editingRule, triggerMode: 'auto' })}
                      >
                        自动触发
                      </button>
                    </div>
                    <div className="bg-brand-50 text-brand-700 text-xs p-3 rounded-lg flex items-start gap-2">
                      <div className="mt-0.5 font-bold">ⓘ</div>
                      <div>{editingRule.triggerMode === 'manual' ? '当受试者符合裂变规则后，由工作人员主动点击裂变。' : '当受试者符合裂变规则后，系统将自动为其分配第二阶段分组。'}</div>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">受试者入组满此天数后，才允许进行裂变</label>
                        <div className="relative">
                          <input 
                            type="number" 
                            className="w-full text-sm border-slate-200 rounded-lg focus:border-brand-500 focus:ring-1 focus:ring-brand-500 py-2 pr-8"
                            value={editingRule.days}
                            onChange={(e) => setEditingRule({ ...editingRule, days: parseInt(e.target.value) || 0 })}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">天</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">医学指标要求 (备注)</label>
                        <input 
                          type="text" 
                          className="w-full text-sm border-slate-200 rounded-lg focus:border-brand-500 focus:ring-1 focus:ring-brand-500 py-2"
                          placeholder="例如：视功能指标大于 0.8"
                          value={editingRule.medicalNote}
                          onChange={(e) => setEditingRule({ ...editingRule, medicalNote: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 平衡策略 */}
                  <div>
                    <h5 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                      <Shuffle className="w-4 h-4 text-brand-500" /> 平衡策略
                    </h5>
                    <div className="flex bg-slate-100 p-1 rounded-lg mb-3">
                      {[
                        { id: 'simple', label: '简单随机' },
                        { id: 'dimension', label: '维度平衡' },
                        { id: 'manual', label: '主动分配' }
                      ].map(s => (
                        <button 
                          key={s.id}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${editingRule.balanceStrategy === s.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                          onClick={() => setEditingRule({ ...editingRule, balanceStrategy: s.id })}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                    <div className="bg-brand-50 text-brand-700 text-xs p-3 rounded-lg flex items-start gap-2">
                      <div className="mt-0.5 font-bold">ⓘ</div>
                      <div>
                        {editingRule.balanceStrategy === 'simple' && '简单随机算法分配，不保证原组维度的平衡。'}
                        {editingRule.balanceStrategy === 'dimension' && '基于第一阶段的维度进行动态平衡分配。'}
                        {editingRule.balanceStrategy === 'manual' && '由医生手动为受试者指定第二阶段分组。'}
                      </div>
                    </div>
                  </div>
                  
                  {/* 裂变子组 */}
                  <div>
                    <h5 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                      <GitFork className="w-4 h-4 text-brand-500" /> 裂变子组 (Stage 2)
                    </h5>
                    <div className="space-y-3">
                      {editingRule.subGroups.map((sub: any, idx: number) => (
                        <div key={sub.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 relative group">
                          {editingRule.subGroups.length > 2 && (
                            <button 
                              className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                const newSubs = editingRule.subGroups.filter((_: any, i: number) => i !== idx);
                                setEditingRule({ ...editingRule, subGroups: newSubs });
                              }}
                            >
                              <Settings className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <div className="flex gap-3 mb-2">
                            <div className="flex-1">
                              <input 
                                type="text" 
                                value={sub.name}
                                onChange={(e) => {
                                  const newSubs = [...editingRule.subGroups];
                                  newSubs[idx].name = e.target.value;
                                  setEditingRule({ ...editingRule, subGroups: newSubs });
                                }}
                                className="w-full text-sm font-bold bg-transparent border-b border-dashed border-slate-300 focus:border-brand-500 focus:outline-none px-1 py-0.5"
                              />
                            </div>
                            <div className="w-20 relative">
                              <input 
                                type="number" 
                                value={sub.count}
                                onChange={(e) => {
                                  const newSubs = [...editingRule.subGroups];
                                  newSubs[idx].count = parseInt(e.target.value) || 0;
                                  setEditingRule({ ...editingRule, subGroups: newSubs });
                                }}
                                className="w-full text-sm text-center bg-white border border-slate-200 rounded px-1 py-1 pr-5"
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">人</span>
                            </div>
                          </div>
                          <div>
                            <input 
                              type="text" 
                              value={sub.medicine}
                              onChange={(e) => {
                                const newSubs = [...editingRule.subGroups];
                                newSubs[idx].medicine = e.target.value;
                                setEditingRule({ ...editingRule, subGroups: newSubs });
                              }}
                              placeholder="产品 产品名称"
                              className="w-full text-xs bg-transparent border-none focus:ring-0 p-0 text-slate-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    {editingRule.subGroups.length < 3 && (
                      <button 
                        className="w-full mt-3 py-2.5 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-500 hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50 transition-colors flex justify-center items-center gap-1"
                        onClick={() => {
                          setEditingRule({
                            ...editingRule,
                            subGroups: [
                              ...editingRule.subGroups,
                              { id: `sub_${Date.now()}`, name: `裂变${editingRule.subGroups.length + 1}组`, count: 0, medicine: '' }
                            ]
                          })
                        }}
                      >
                        <Plus className="w-3.5 h-3.5" /> 增加子组(最多3个)
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="p-4 border-t border-slate-100 bg-white rounded-b-2xl">
                  <button 
                    onClick={saveFissionRule}
                    className="w-full py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 shadow-lg shadow-brand-500/30 transition-all active:scale-95"
                  >
                    保存规则
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/30 rounded-2xl">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <GitFork className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="text-slate-600 font-bold mb-1">暂未选择需要配置裂变的分组</h4>
                <p className="text-sm text-slate-400">请在左侧点击分组进行配置</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 裂变开启确认 Modal */}
      {showFissionConfirm && (
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
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-700">{group.name}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-200/50 px-1.5 py-0.5 rounded">{group.medicine || '无产品'}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-600">{group.count}人</span>
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
        </div>
      )}
    </div>
  );
};
