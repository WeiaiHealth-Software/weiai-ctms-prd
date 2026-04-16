import { create } from 'zustand';
import { AVAILABLE_DIMENSIONS } from '../constants/dimensions';

const getCartesianProduct = (lists: string[][]) =>
  lists.reduce<string[]>(
    (acc, list) => acc.flatMap((a) => list.map((b) => (a ? `${a} ${b}` : b))),
    ['']
  );

const computeDimensionFactors = (selectedDimensions: string[]) => {
  const ordered = AVAILABLE_DIMENSIONS.filter((d) => selectedDimensions.includes(d.id));
  if (ordered.length === 0) return ['默认'];
  return getCartesianProduct(ordered.map((d) => d.options));
};

export interface ProjectWizardState {
  isOpen: boolean;
  currentStep: number;
  
  // Step 1: 基础设置
  basicInfo: {
    name: string;
    code: string;
    randomPrefix: string;
    productPrefix: string;
    isShared: boolean;
    isBlind: boolean;
    description: string;
    centers: string[];
    leader: string;
    collab: string;
    crc: string;
    inclusionCriteria: string[];
    exclusionCriteria: string[];
  };

  // Step 2: 维度选择
  selectedDimensions: string[];
  dimensionFactors: string[]; // 笛卡尔积组合，如 ["男 4-7岁", "女 4-7岁"]

  // Step 3: 分组配置
  totalCount: number;
  matchMode: 'random' | 'free';
  isFissionMode: boolean;
  groups: {
    id: string;
    name: string;
    medicine: string;
    count: number;
    factors: Record<string, number>; // key: 因子名称, value: 人数
  }[];
  fissionRules: Record<string, any>; // key: groupId, value: 裂变规则

  // Actions
  setIsOpen: (isOpen: boolean) => void;
  setStep: (step: number) => void;
  updateBasicInfo: (info: Partial<ProjectWizardState['basicInfo']>) => void;
  updateDimensions: (dims: string[]) => void;
  updateGrouping: (config: Partial<Pick<ProjectWizardState, 'totalCount' | 'matchMode' | 'isFissionMode' | 'groups' | 'fissionRules'>>) => void;
  reset: () => void;
}

const initialState = {
  isOpen: false,
  currentStep: 1,
  basicInfo: {
    name: '',
    code: '',
    randomPrefix: '',
    productPrefix: '',
    isShared: false,
    isBlind: false,
    description: '',
    centers: [],
    leader: '',
    collab: '',
    crc: '',
    inclusionCriteria: [],
    exclusionCriteria: [],
  },
  selectedDimensions: [],
  dimensionFactors: ['默认'],
  totalCount: 100,
  matchMode: 'random' as const,
  isFissionMode: false,
  groups: [
    { id: 'g1', name: '实验组', medicine: '产品A', count: 50, factors: { '默认': 50 } },
    { id: 'g2', name: '对照组', medicine: '安慰剂', count: 50, factors: { '默认': 50 } }
  ],
  fissionRules: {}
};

export const useProjectWizardStore = create<ProjectWizardState>((set) => ({
  ...initialState,
  setIsOpen: (isOpen) => set({ isOpen }),
  setStep: (step) => set({ currentStep: step }),
  updateBasicInfo: (info) => set((state) => ({ basicInfo: { ...state.basicInfo, ...info } })),
  updateDimensions: (dims) =>
    set((state) => {
      const dimensionFactors = computeDimensionFactors(dims);
      const factorsCount = dimensionFactors.length;

      const newGroups = state.groups.map((g) => {
        if (factorsCount <= 0) return { ...g, factors: {} };

        const avg = Math.floor(g.count / factorsCount);
        const remainder = g.count % factorsCount;
        const newFactors: Record<string, number> = {};
        dimensionFactors.forEach((factor, idx) => {
          newFactors[factor] = avg + (idx < remainder ? 1 : 0);
        });

        return { ...g, factors: newFactors };
      });

      return { selectedDimensions: dims, dimensionFactors, groups: newGroups };
    }),
  updateGrouping: (config) => set((state) => {
    const newState = { ...state, ...config };
    
    // 如果切换到随机分组，或者在随机分组下修改了总人数/分组数量，重新平均分配
    if (newState.matchMode === 'random') {
      if ('totalCount' in config || 'groups' in config || 'matchMode' in config) {
        const total = newState.totalCount;
        const groupCount = newState.groups.length;
        if (groupCount > 0) {
          const avg = Math.floor(total / groupCount);
          const remainder = total % groupCount;
          newState.groups = newState.groups.map((g, idx) => {
            const groupTotal = avg + (idx === groupCount - 1 ? remainder : 0);
            
            // 平均分配给该组内的各个因子
            const factorsCount = newState.dimensionFactors.length;
            const newFactors: Record<string, number> = {};
            if (factorsCount > 0) {
              const factorAvg = Math.floor(groupTotal / factorsCount);
              const factorRemainder = groupTotal % factorsCount;
              newState.dimensionFactors.forEach((factor, fIdx) => {
                newFactors[factor] = factorAvg + (fIdx < factorRemainder ? 1 : 0);
              });
            }
            
            return {
              ...g,
              count: groupTotal,
              factors: newFactors
            };
          });
        }
      }
    }
    
    return newState;
  }),
  reset: () => set(initialState)
}));
