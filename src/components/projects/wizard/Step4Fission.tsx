import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertTriangle,
  CheckCircle2,
  GitFork,
  Plus,
  Settings,
  Shuffle
} from 'lucide-react';
import { useProjectWizardStore } from '../../../store/useProjectWizardStore';

type FissionSubGroup = {
  id: string;
  name: string;
  count: number;
  medicine: string;
};

type FissionRule = {
  subGroups: FissionSubGroup[];
};

const distributeCounts = (total: number, count: number) => {
  if (!Number.isFinite(total) || total <= 0 || count <= 0) {
    return Array.from({ length: count }, () => 0);
  }

  const base = Math.floor(total / count);
  const remainder = total % count;
  return Array.from({ length: count }, (_, index) => base + (index < remainder ? 1 : 0));
};

const createDefaultRule = (stage1Count: number): FissionRule => {
  const counts = distributeCounts(stage1Count, 2);
  const now = Date.now();
  return {
    subGroups: [
      { id: `sub_${now}_1`, name: '裂变1组', count: counts[0] ?? 0, medicine: '' },
      { id: `sub_${now}_2`, name: '裂变2组', count: counts[1] ?? 0, medicine: '' }
    ]
  };
};

const cloneRule = (rule: FissionRule): FissionRule => ({
  subGroups: rule.subGroups.map((subGroup) => ({ ...subGroup }))
});

const validateRule = (rule: FissionRule, stage1Count: number) => {
  if (!rule.subGroups.length) return '请至少配置 2 个裂变子组。';
  if (rule.subGroups.length < 2) return '裂变子组至少需要 2 个。';

  for (const subGroup of rule.subGroups) {
    if (!subGroup.name.trim()) return '请填写每个裂变子组名称。';
    if (!Number.isFinite(subGroup.count) || subGroup.count <= 0) return '每个裂变子组人数必须大于 0。';
  }

  const total = rule.subGroups.reduce((sum, subGroup) => sum + subGroup.count, 0);
  if (total !== stage1Count) return `裂变子组人数合计需等于当前分组人数 ${stage1Count}。`;

  return null;
};

export const Step4Fission: React.FC = () => {
  const {
    groups,
    fissionConfig,
    fissionRules,
    updateGrouping,
    setStep
  } = useProjectWizardStore();
  const getRuleForGroup = (groupId: string | null) => {
    if (!groupId) return null;
    const group = groups.find((item) => item.id === groupId);
    if (!group) return null;

    const existingRule = fissionRules[groupId];
    return existingRule?.subGroups?.length ? cloneRule(existingRule) : createDefaultRule(group.count);
  };

  const [selectedFissionGroupId, setSelectedFissionGroupId] = useState<string | null>(groups[0]?.id ?? null);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [draftRule, setDraftRule] = useState<FissionRule | null>(() => getRuleForGroup(groups[0]?.id ?? null));
  const [draftDirty, setDraftDirty] = useState(false);

  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedFissionGroupId) ?? null,
    [groups, selectedFissionGroupId]
  );
  const configuredGroupsCount = groups.filter((group) => (fissionRules[group.id]?.subGroups?.length ?? 0) > 0).length;
  const draftTotal = draftRule?.subGroups.reduce((sum, subGroup) => sum + subGroup.count, 0) ?? 0;

  const updateFissionConfig = (patch: Partial<typeof fissionConfig>) => {
    updateGrouping({ fissionConfig: { ...fissionConfig, ...patch } });
  };

  const markDraftChanged = (nextRule: FissionRule) => {
    setDraftRule(nextRule);
    setDraftDirty(true);
  };

  const handleSelectGroup = (groupId: string) => {
    if (groupId === selectedFissionGroupId) return;

    if (draftDirty) {
      const confirmed = window.confirm('当前分组还有未确认的裂变子组修改，切换后这些修改将丢失，是否继续？');
      if (!confirmed) return;
    }

    setSelectedFissionGroupId(groupId);
    setDraftRule(getRuleForGroup(groupId));
    setDraftDirty(false);
  };

  const handleConfirmSelectedRule = () => {
    if (!selectedFissionGroupId || !selectedGroup || !draftRule) return;

    const errorMessage = validateRule(draftRule, selectedGroup.count);
    if (errorMessage) {
      window.alert(errorMessage);
      return;
    }

    updateGrouping({
      fissionRules: {
        ...fissionRules,
        [selectedFissionGroupId]: cloneRule(draftRule)
      }
    });
    setDraftDirty(false);
    window.alert(`${selectedGroup.name} 的裂变子组配置已确认。`);
  };

  const disableFission = () => {
    updateGrouping({ isFissionMode: false });
    setSelectedFissionGroupId(null);
    setDraftRule(null);
    setDraftDirty(false);
    setStep(3);
  };

  return (
    <div className="animate-fade-in pb-10 space-y-4">
      <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">二阶段裂变配置</h3>
          <p className="text-sm text-slate-500 mt-1">通用规则统一配置，按需为需要裂变的分组确认子组即可</p>
        </div>
        <button
          type="button"
          className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 font-bold text-sm hover:bg-rose-100 transition-colors"
          onClick={() => setShowDisableConfirm(true)}
        >
          关闭裂变
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-slate-900">裂变通用配置</div>
            <div className="text-xs text-slate-500 mt-1">平衡策略、入组时长门槛与医学指标备注在此统一配置</div>
          </div>
          <div className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            Stage 2 规则
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <Shuffle className="w-4 h-4 text-brand-500" /> 平衡策略
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {[
                { id: 'simple', label: '简单随机' },
                { id: 'dimension', label: '维度平衡' },
                { id: 'manual', label: '主动分配' }
              ].map((strategy) => (
                <button
                  key={strategy.id}
                  type="button"
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                    fissionConfig.balanceStrategy === strategy.id
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                  onClick={() => updateFissionConfig({ balanceStrategy: strategy.id as 'simple' | 'dimension' | 'manual' })}
                >
                  {strategy.label}
                </button>
              ))}
            </div>
            <div className="mt-2 text-[11px] text-slate-500 leading-relaxed">
              {fissionConfig.balanceStrategy === 'simple' && '简单随机算法分配，不保证原组维度的平衡。'}
              {fissionConfig.balanceStrategy === 'dimension' && '按第一阶段维度因子动态平衡分配。'}
              {fissionConfig.balanceStrategy === 'manual' && '由工作人员手动指定第二阶段分组人数。'}
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-slate-700 mb-2">入组时长门槛</div>
            <div className="relative">
              <input
                type="number"
                className="w-full text-sm border-slate-200 rounded-lg focus:border-brand-500 focus:ring-1 focus:ring-brand-500 py-2 pr-10"
                value={fissionConfig.days}
                onChange={(event) => updateFissionConfig({ days: parseInt(event.target.value, 10) || 0 })}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">天</span>
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-slate-700 mb-2">医学指标要求（备注）</div>
            <input
              type="text"
              className="w-full text-sm border-slate-200 rounded-lg focus:border-brand-500 focus:ring-1 focus:ring-brand-500 py-2"
              placeholder="例如：视功能指标大于 0.8"
              value={fissionConfig.medicalNote}
              onChange={(event) => updateFissionConfig({ medicalNote: event.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-6 h-[520px]">
        <div className="flex-1 bg-slate-50/50 rounded-2xl border border-slate-200 p-6 flex flex-col h-full">
          <div className="flex items-start justify-between gap-3 mb-6">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">第二阶段分组（Stage 2）</h4>
                <p className="text-xs text-slate-500">按需选择一阶段分组，为需要裂变的组配置并确认子组</p>
            </div>
            <div className="text-xs font-bold px-2.5 py-1 rounded-lg border bg-white text-slate-600 border-slate-200">
                已配置 {configuredGroupsCount} 组
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {groups.map((group) => {
              const isSelected = selectedFissionGroupId === group.id;
              const rule = fissionRules[group.id];
              const hasRule = (rule?.subGroups?.length ?? 0) > 0;

              return (
                <div
                  key={group.id}
                  className={`bg-white p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-brand-500 shadow-md ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:border-brand-300 shadow-sm'
                  }`}
                  onClick={() => handleSelectGroup(group.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-800">{group.name}</div>
                      <div className={`mt-1 text-[11px] font-bold ${hasRule ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {hasRule ? '已确认子组配置' : '当前未配置裂变'}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-slate-700 bg-slate-200/50 px-2 py-1 rounded whitespace-nowrap">
                      {group.count} 人
                    </div>
                  </div>

                  {hasRule ? (
                    <div className="mt-3 space-y-2">
                      {rule.subGroups.slice(0, 3).map((subGroup) => (
                        <div
                          key={subGroup.id}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <div className="text-[12px] font-bold text-slate-700 truncate">{subGroup.name}</div>
                            <div className="text-[10px] text-slate-400 truncate mt-0.5">
                              {subGroup.medicine || '产品 产品名称'}
                            </div>
                          </div>
                          <div className="text-[12px] font-bold text-slate-700 whitespace-nowrap">{subGroup.count} 人</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                      <div className="text-xs text-slate-500 mt-3">当前分组未配置裂变子组</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-[400px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
          {selectedGroup && draftRule ? (
            <>
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h4 className="font-bold text-slate-800">裂变子组配置</h4>
                  <p className="text-xs text-slate-500 mt-0.5">先编辑当前子组，再点击确认保存到规则中；产品名称可不填</p>
                </div>
                <div className="text-xs font-bold text-slate-700 bg-slate-200/50 px-2 py-1 rounded">
                  {selectedGroup.name}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-3">
                {draftRule.subGroups.map((subGroup, index) => (
                  <div key={subGroup.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 relative group">
                    {draftRule.subGroups.length > 2 && (
                      <button
                        type="button"
                        className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                            const redistributedCounts = distributeCounts(selectedGroup.count, draftRule.subGroups.length - 1);
                          const nextRule = {
                              subGroups: draftRule.subGroups
                                .filter((_, subGroupIndex) => subGroupIndex !== index)
                                .map((item, subGroupIndex) => ({
                                  ...item,
                                  count: redistributedCounts[subGroupIndex] ?? 0
                                }))
                          };
                          markDraftChanged(nextRule);
                        }}
                      >
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <div className="flex gap-3 mb-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={subGroup.name}
                          onChange={(event) => {
                            const nextSubGroups = [...draftRule.subGroups];
                            nextSubGroups[index] = { ...nextSubGroups[index], name: event.target.value };
                            markDraftChanged({ subGroups: nextSubGroups });
                          }}
                          className="w-full text-sm font-bold bg-transparent border-b border-dashed border-slate-300 focus:border-brand-500 focus:outline-none px-1 py-0.5"
                        />
                      </div>
                      <div className="w-20 relative">
                        <input
                          type="number"
                          value={subGroup.count}
                          onChange={(event) => {
                            const nextSubGroups = [...draftRule.subGroups];
                            nextSubGroups[index] = {
                              ...nextSubGroups[index],
                              count: parseInt(event.target.value, 10) || 0
                            };
                            markDraftChanged({ subGroups: nextSubGroups });
                          }}
                          className="w-full text-sm text-center bg-white border border-slate-200 rounded px-1 py-1 pr-5"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">人</span>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={subGroup.medicine}
                      onChange={(event) => {
                        const nextSubGroups = [...draftRule.subGroups];
                        nextSubGroups[index] = { ...nextSubGroups[index], medicine: event.target.value };
                        markDraftChanged({ subGroups: nextSubGroups });
                      }}
                      placeholder="产品 产品名称"
                      className="w-full text-xs bg-transparent border-none focus:ring-0 p-0 text-slate-500"
                    />
                  </div>
                ))}

                {draftRule.subGroups.length < 3 && (
                  <button
                    type="button"
                    className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-500 hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50 transition-colors flex justify-center items-center gap-1"
                    onClick={() => {
                      const redistributedCounts = distributeCounts(selectedGroup.count, draftRule.subGroups.length + 1);
                      const nextRule = {
                        subGroups: [
                          ...draftRule.subGroups,
                          {
                            id: `sub_${Date.now()}`,
                            name: `裂变${draftRule.subGroups.length + 1}组`,
                            count: 0,
                            medicine: ''
                          }
                        ].map((item, subGroupIndex) => ({
                          ...item,
                          count: redistributedCounts[subGroupIndex] ?? 0
                        }))
                      };
                      markDraftChanged(nextRule);
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" /> 增加子组（最多 3 个）
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/30">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <GitFork className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-slate-600 font-bold mb-1">暂未选择需要配置裂变的分组</h4>
              <p className="text-sm text-slate-400">请在左侧点击分组进行配置</p>
            </div>
          )}

          <div className="border-t border-slate-100 p-5 bg-white space-y-3">
            <div
              className={`text-xs rounded-xl px-3 py-2 border ${
                draftDirty
                  ? 'text-amber-700 bg-amber-50 border-amber-200'
                    : 'text-slate-600 bg-slate-50 border-slate-200'
              }`}
            >
              {draftDirty
                ? `当前子组尚未确认，已配置 ${draftTotal}/${selectedGroup?.count ?? 0} 人。`
                    : `当前已配置 ${configuredGroupsCount} 个裂变分组。`}
            </div>

            <button
              type="button"
              disabled={!selectedGroup || !draftRule}
              className="w-full py-2.5 rounded-xl border border-brand-200 text-brand-700 bg-brand-50 font-bold hover:bg-brand-100 transition-colors disabled:bg-slate-100 disabled:border-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={handleConfirmSelectedRule}
            >
              <CheckCircle2 className="w-4 h-4" />
              确认当前子组配置
            </button>
          </div>
        </div>
      </div>

      {showDisableConfirm && typeof document !== 'undefined'
        ? createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-amber-100 rounded-full mb-5">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-center text-slate-800 mb-2">确认关闭裂变？</h3>
                  <p className="text-center text-slate-500 mb-6 text-sm leading-relaxed">
                    关闭裂变后，项目仍保留 Stage 1 分组配置；裂变配置将不再参与后续流程。
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDisableConfirm(false)}
                      className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => {
                        setShowDisableConfirm(false);
                        disableFission();
                      }}
                      className="flex-1 px-4 py-2.5 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all active:scale-95"
                    >
                      确认关闭
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
