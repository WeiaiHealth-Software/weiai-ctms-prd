export type ProjectStatus = '进行中' | '已结束';

export type ProjectSummary = {
  id: string;
  code: string;
  status: ProjectStatus;
  title: string;
  date: string;
  description: string;
  fissionDescription?: string;
  leader?: string;
  collab?: string;
  crc?: string;
  centers?: string[];
  inclusionCriteria?: string[];
  exclusionCriteria?: string[];
  currentCount: number;
  totalCount: number;
  themeColor: 'brand' | 'indigo';
  isFission: boolean;
};

export type EnrollmentRowStatus = 'enrolled' | 'failed' | 'pending';

export type EnrollmentRow = {
  id: string;
  screenId: string;
  randomId: string;
  drugId: string;
  drugIdStage1?: string;
  drugIdStage2?: string;
  name: string;
  age: string;
  indicator: string;
  group: string;
  subGroup?: string;
  groupClass: string;
  tags: string[];
  status: EnrollmentRowStatus;
  doctor: string;
  stage?: 'Stage 1' | 'Stage 2' | '--';
  isFissioned?: boolean;
};

export const PROJECTS: ProjectSummary[] = [
  {
    id: 'p1',
    code: 'CHILD_ELESCREEN',
    status: '进行中',
    title: '光刻微结构近视管理镜片在儿童青少年近视防控中的有效性及佩戴安全舒适性的随机对照临床研究',
    date: '2025-12-25',
    description:
      '主要目的：评价不同光刻微结构近视管理镜片对控制儿童青少年近视进展的有效性和佩戴的安全舒适性，探索对近视防控有效的离焦微透镜设计及光刻微结构近视管理镜片应用于近视防控的可行性。次要目的：了解和分析儿童青少年近视防控诊疗情况和相关影响因素，例如初发年龄、性别、佩戴时长、用眼习惯等。',
    leader: '徐医生',
    collab: '王医生（徐州眼视光中心）、李医生（上海眼病中心）',
    crc: '张同学',
    centers: ['徐州眼视光中心', '上海眼科中心'],
    inclusionCriteria: [
      '年龄：6-14岁',
      '使用1%盐酸环喷托酯滴眼液（赛飞杰）睫状肌麻痹后，双眼均在-0.50D～-4.00D，双眼柱镜≤1.50D，屈光参差≤1.50D，最佳矫正视力5.0以上',
      '3个月内未使用过多焦眼镜、角膜塑形镜、离焦软镜、渐进眼镜、阿托品滴眼液、红光和针灸治疗等近视防控方法',
      '受试者有治疗意愿并由其法定监护人签署知情同意书'
    ],
    exclusionCriteria: ['确诊恒定斜视', '确诊病理性近视', '其他先天性眼病', '研究医生认为不适合纳入项目的其他原因等'],
    currentCount: 46,
    totalCount: 100,
    themeColor: 'brand',
    isFission: false
  },
  {
    id: 'p2',
    code: 'CARDIO_01',
    status: '进行中',
    title: '冠心病介入治疗术后心脏康复分级干预策略的多中心随机对照研究',
    date: '2024-06-30',
    description:
      '本研究旨在评价冠心病患者在经皮冠状动脉介入治疗(PCI)后，采用不同级别的心脏康复干预策略(包括运动处方、营养指导、心理干预)对改善患者心肺运动耐量、降低主要不良心血管事件(MACE)发生率的作用。',
    fissionDescription:
      '本研究旨在探索基于风险分层的心脏康复分级干预策略对冠心病介入治疗术后患者心肺功能、生活质量及预后的影响。采用两阶段随机化设计（裂变设计），第一阶段根据初始风险评估分组，第二阶段针对特定亚组进行强化干预或常规随访的二次随机分配。',
    leader: '李主任',
    collab: '张医生（北京同仁医院）、王医生（上海眼病中心）',
    crc: '陈同学',
    centers: ['北京同仁医院', '上海眼科中心'],
    inclusionCriteria: ['确诊冠心病且完成PCI治疗', '术后情况稳定，具备心脏康复评估条件', '已签署知情同意书'],
    exclusionCriteria: ['严重心律失常', '急性心衰失代偿', '研究者认为不适合纳入的其他情况'],
    currentCount: 380,
    totalCount: 1000,
    themeColor: 'indigo',
    isFission: true
  },
  {
    id: 'p3',
    code: 'GLAUCOMA_PH3',
    status: '已结束',
    title: '新型降眼压滴眼液在原发性开角型青光眼患者中的 III 期临床试验',
    date: '2023-11-15',
    description:
      '评估试验药物在原发性开角型青光眼或高眼压症患者中连续使用 12 周降低眼内压(IOP)的疗效和安全性。与现有的一线前列腺素类药物进行非劣效性比较。',
    leader: '赵医生',
    collab: '—',
    crc: '王同学',
    centers: ['上海眼病防治中心'],
    inclusionCriteria: ['确诊原发性开角型青光眼或高眼压症', '基线IOP符合研究范围', '签署知情同意书并能配合随访'],
    exclusionCriteria: ['继发性青光眼', '近期眼科手术史', '研究者判断不适合纳入'],
    currentCount: 240,
    totalCount: 240,
    themeColor: 'brand',
    isFission: false
  },
  {
    id: 'p4',
    code: 'CARDIO_FISSION_END',
    status: '已结束',
    title: '慢性心力衰竭患者个体化二阶段裂变干预策略的多中心随机对照研究',
    date: '2023-08-20',
    description:
      '采用二阶段裂变随机化设计，对慢性心力衰竭患者在第一阶段稳定后触发第二阶段个体化干预分配，评估再分配策略对预后与依从性的影响。',
    fissionDescription:
      '项目已完成全部随访与二阶段裂变触发，当前仅提供历史数据回溯与审计。',
    leader: '王主任',
    collab: '李医生（徐州眼视光中心）',
    crc: '刘同学',
    centers: ['徐州眼视光中心', '广州中山医院'],
    inclusionCriteria: ['慢性心衰诊断明确', '第一阶段随访完成', '符合裂变触发规则'],
    exclusionCriteria: ['合并严重肝肾功能障碍', '无法完成随访', '其他研究者判断风险过高情况'],
    currentCount: 600,
    totalCount: 600,
    themeColor: 'indigo',
    isFission: true
  }
];

export const ENROLLMENT_DATA: Record<string, EnrollmentRow[]> = {
  p1: [
    {
      id: 'CHILD_ELESCREEN_0001',
      screenId: '0001',
      randomId: 'R-1001',
      drugId: 'D-A001',
      name: '张小明',
      age: '8岁',
      indicator: '-1.50D',
      group: '实验组',
      groupClass: 'bg-indigo-50 text-indigo-700',
      tags: ['男', '7-10岁'],
      status: 'enrolled',
      doctor: '李医生'
    },
    {
      id: '--',
      screenId: '0002',
      randomId: '--',
      drugId: '--',
      name: '李雅',
      age: '6岁',
      indicator: '-0.50D',
      group: '未入组',
      groupClass: 'text-slate-400 bg-slate-100',
      tags: [],
      status: 'failed',
      doctor: '王医生'
    },
    {
      id: '--',
      screenId: '--',
      randomId: '--',
      drugId: '--',
      name: '王芳',
      age: '9岁',
      indicator: '-1.25D',
      group: '待入组',
      groupClass: 'text-amber-600 bg-amber-50 border border-amber-200',
      tags: ['女', '7-10岁'],
      status: 'pending',
      doctor: '李医生'
    }
  ],
  p2: [
    {
      id: 'CARDIO_0001',
      screenId: '0001',
      randomId: 'R-87766',
      drugId: 'D-f68823',
      drugIdStage1: 'D-f68823',
      name: '刘建国',
      age: '65岁',
      indicator: 'EF 45%',
      group: '实验组',
      groupClass: 'bg-indigo-50 text-indigo-700',
      tags: ['男', '>60岁'],
      status: 'enrolled',
      stage: 'Stage 1',
      isFissioned: false,
      doctor: '李主任'
    },
    {
      id: 'CARDIO_0002',
      screenId: '0002',
      randomId: 'R-9902',
      drugId: 'D-S2-112',
      drugIdStage1: 'D-112',
      drugIdStage2: 'D-S2-112',
      name: '王淑芬',
      age: '58岁',
      indicator: 'EF 52%',
      group: '对照组',
      subGroup: '对照组：裂变子组1',
      groupClass: 'bg-emerald-50 text-emerald-600',
      tags: ['女', '50-60岁'],
      status: 'enrolled',
      stage: 'Stage 2',
      isFissioned: true,
      doctor: '张医生'
    },
    {
      id: '--',
      screenId: '0005',
      randomId: '--',
      drugId: '--',
      name: '孙大妈',
      age: '68岁',
      indicator: 'EF 50%',
      group: '未入组',
      groupClass: 'text-slate-400 bg-slate-100',
      tags: [],
      status: 'failed',
      stage: '--',
      doctor: '张医生'
    }
  ],
  p3: [
    {
      id: 'GLAUCOMA_0231',
      screenId: '0231',
      randomId: 'R-2031',
      drugId: 'D-TRIAL-0231',
      name: '周敏',
      age: '56岁',
      indicator: 'IOP 21mmHg',
      group: '对照组',
      groupClass: 'bg-emerald-50 text-emerald-600',
      tags: ['女', '45-64岁'],
      status: 'enrolled',
      doctor: '赵医生'
    }
  ],
  p4: [
    {
      id: 'CHF_0101',
      screenId: '0101',
      randomId: 'R-7001',
      drugId: 'D-S2-EXP-0101',
      drugIdStage1: 'D-EXP-0101',
      drugIdStage2: 'D-S2-EXP-0101',
      name: '黄国强',
      age: '63岁',
      indicator: 'NT-proBNP 1200',
      group: '实验组',
      subGroup: '实验组：裂变子组2',
      groupClass: 'bg-indigo-50 text-indigo-700',
      tags: ['男', '>60岁'],
      status: 'enrolled',
      stage: 'Stage 2',
      isFissioned: true,
      doctor: '王主任'
    },
    {
      id: 'CHF_0102',
      screenId: '0102',
      randomId: 'R-7002',
      drugId: 'D-CTRL-0102',
      drugIdStage1: 'D-CTRL-0102',
      name: '张月华',
      age: '59岁',
      indicator: 'NT-proBNP 980',
      group: '对照组',
      groupClass: 'bg-emerald-50 text-emerald-600',
      tags: ['女', '50-60岁'],
      status: 'enrolled',
      stage: 'Stage 1',
      isFissioned: false,
      doctor: '李主任'
    }
  ]
};
