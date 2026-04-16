export type DimensionDefinition = {
  id: string;
  name: string;
  desc: string;
  options: string[];
};

export const AVAILABLE_DIMENSIONS: DimensionDefinition[] = [
  { id: 'gender', name: '性别维度', desc: '因子：男、女', options: ['男', '女'] },
  { id: 'age', name: '年龄分层', desc: '因子：4-7岁、8-10岁、11-14岁', options: ['4-7岁', '8-10岁', '11-14岁'] },
  { id: 'diopter', name: '屈光度范围', desc: '因子：-1.0~-0.5、-0.4~0', options: ['-1.0~-0.5', '-0.4~0'] }
];

