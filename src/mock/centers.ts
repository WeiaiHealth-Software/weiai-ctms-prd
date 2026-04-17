export type CenterProject = {
  id: string;
  code: string;
  name: string;
  status: '进行中' | '已结束';
  currentCount: number;
  totalCount: number;
  tags: string[];
};

export type CenterStaff = {
  id: string;
  name: string;
  username: string;
  phone: string;
  createdAt: string;
  roleTag?: { text: string; className: string };
};

export type CenterDepartment = {
  id: string;
  name: string;
  icon: string;
  colorClass: string;
};

export type Center = {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  adminName: string;
  adminAvatar: string;
  createdAt: string;
  stats: {
    departments: number;
    doctors: number;
    crcs: number;
    projects: number;
  };
  projects: CenterProject[];
  departments: CenterDepartment[];
  doctors: Record<string, CenterStaff[]>;
  crcs: CenterStaff[];
};

const cover1 =
  'https://www.shsyf.com/res/202503/11/503deae8f88a90a2.png';
const cover2 =
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=photorealistic%2C%20large%20university%20affiliated%20specialty%20hospital%20entrance%2C%20East%20China%2C%20daytime%2C%20urban%20street%2C%20clean%20architecture%2C%20high%20detail%2C%20natural%20colors&image_size=landscape_4_3';

export const CENTERS: Center[] = [
  {
    id: 'c_sh_eye',
    name: '上海眼病防治中心',
    description:
      '上海眼病防治中心是国内最早成立的眼科之一，集医疗、教学、科研为一体，拥有国际一流的诊疗设备和专家团队，在各类疑难眼病的诊治方面处于国内领先水平。',
    coverImage: cover1,
    adminName: '徐教授',
    adminAvatar: 'https://ui-avatars.com/api/?name=%E5%BE%90%E6%95%99%E6%8E%88&background=0ea5e9&color=fff',
    createdAt: '2023-01-15',
    stats: { departments: 6, doctors: 24, crcs: 60, projects: 8 },
    projects: [
      {
        id: 'p_child_eyescreen',
        code: 'CHILD_EYESCREEN',
        name: '光刺激结构近视管理提供研究',
        status: '进行中',
        currentCount: 12,
        totalCount: 20,
        tags: ['负责人：徐教授', 'ULS', '+3 组属性参与']
      },
      {
        id: 'p_adult_dryeye',
        code: 'ADULT_DRYEYE',
        name: '成人干眼症临床数据采集',
        status: '已结束',
        currentCount: 50,
        totalCount: 50,
        tags: ['负责人：周医生', 'ULS', '+1 组属性参与']
      }
    ],
    departments: [
      { id: 'd_vision', name: '视光中心', icon: 'ri-focus-2-line', colorClass: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
      { id: 'd_eye', name: '眼底病科', icon: 'ri-eye-2-line', colorClass: 'bg-blue-50 text-blue-600 border-blue-100' },
      { id: 'd_myopia', name: '青光眼科', icon: 'ri-flashlight-line', colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
      { id: 'd_cornea', name: '角膜病科', icon: 'ri-sun-line', colorClass: 'bg-amber-50 text-amber-600 border-amber-100' },
      { id: 'd_peds', name: '小儿眼科', icon: 'ri-heart-3-line', colorClass: 'bg-rose-50 text-rose-600 border-rose-100' }
    ],
    doctors: {
      d_vision: [
        {
          id: 'u_wang_prof',
          name: '王教授',
          username: 'wang_prof',
          phone: '13800138000',
          createdAt: '2023-01-15',
          roleTag: { text: '负责人', className: 'bg-indigo-50 text-indigo-700 border-indigo-100' }
        },
        { id: 'u_zhang_doc', name: '张医师', username: 'zhang_doc', phone: '13900139000', createdAt: '2023-02-10' },
        { id: 'u_li_assist', name: '李助理', username: 'li_assist', phone: '13700137000', createdAt: '2023-02-12' }
      ],
      d_eye: [{ id: 'u_sun_doc', name: '孙医生', username: 'sun_doc', phone: '13600136000', createdAt: '2023-03-04' }],
      d_myopia: [],
      d_cornea: [],
      d_peds: []
    },
    crcs: [
      { id: 'c_zhang_prof', name: '张同学', username: 'zhang_prof', phone: '13800138000', createdAt: '2023-01-15' },
      { id: 'c_li_doc', name: '李同学', username: 'li_doc', phone: '13900139000', createdAt: '2023-02-10' },
      { id: 'c_zhou_assist', name: '周助理', username: 'zhou_assist', phone: '13700137000', createdAt: '2023-02-12' }
    ]
  },
  {
    id: 'c_fdu_ent',
    name: '上海复旦大学附属五官科医院',
    description: '华东地区领先的眼耳鼻喉专科医院，中心覆盖多学科临床试验与真实世界研究。',
    coverImage: cover2,
    adminName: '李主任',
    adminAvatar: 'https://ui-avatars.com/api/?name=%E6%9D%8E%E4%B8%BB%E4%BB%BB&background=10b981&color=fff',
    createdAt: '2023-03-22',
    stats: { departments: 4, doctors: 16, crcs: 32, projects: 5 },
    projects: [],
    departments: [],
    doctors: {},
    crcs: []
  }
];

