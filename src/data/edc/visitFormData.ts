import type { DynamicFormValue } from '../../modules/form-engine/types'

export type VisitFormDataMap = Record<string, DynamicFormValue>

export const visitFormDataMap: Record<string, VisitFormDataMap> = {
  'P001-S001': {
    v0: {
      exam_date: '2026-03-01',
      investigator: '徐蔚',
      initials: 'WXY',
      gender: '女',
      height: 128,
      vision_grid: {
        '裸眼视力': { od: '4.6', os: '4.7' },
        '最佳矫正视力': { od: '5.0', os: '5.0' },
      },
      medication_list: [
        { '用药名称': '维生素AD滴剂', '开始时间': '2025-09-01', '是否持续': '是' },
      ],
      contrast_matrix: {
        OU: { AULCSF: '1.52', '1.0c/d': '30.5', '3.0c/d': '22.1' },
        OD: { AULCSF: '1.48', '1.0c/d': '29.8', '3.0c/d': '21.5' },
        OS: { AULCSF: '1.55', '1.0c/d': '31.2', '3.0c/d': '22.8' },
      },
      note: '受试者配合良好，基线检查指标稳定。',
    },
    v1: {
      exam_date: '2026-06-03',
      investigator: '徐蔚',
      initials: 'WXY',
      gender: '女',
      height: 131,
      vision_grid: {
        '裸眼视力': { od: '4.7', os: '4.7' },
        '最佳矫正视力': { od: '5.0', os: '5.1' },
      },
      medication_list: [
        { '用药名称': '维生素AD滴剂', '开始时间': '2025-09-01', '是否持续': '是' },
        { '用药名称': '0.01%阿托品滴眼液', '开始时间': '2026-03-05', '是否持续': '是' },
      ],
      contrast_matrix: {
        OU: { AULCSF: '1.58', '1.0c/d': '31.2', '3.0c/d': '23.0' },
        OD: { AULCSF: '1.54', '1.0c/d': '30.4', '3.0c/d': '22.4' },
        OS: { AULCSF: '1.61', '1.0c/d': '32.0', '3.0c/d': '23.6' },
      },
      note: '佩戴镜片3个月，依从性良好，未诉明显不适。',
    },
  },
  'P001-S002': {
    v0: {
      exam_date: '2026-03-02',
      investigator: '王医生（上海市眼病防治中心）',
      initials: 'PRX',
      gender: '男',
      height: 135,
      vision_grid: {
        '裸眼视力': { od: '4.5', os: '4.6' },
        '最佳矫正视力': { od: '5.0', os: '5.0' },
      },
      medication_list: [],
      contrast_matrix: {
        OU: { AULCSF: '1.42', '1.0c/d': '28.5', '3.0c/d': '20.8' },
        OD: { AULCSF: '1.38', '1.0c/d': '27.9', '3.0c/d': '20.1' },
        OS: { AULCSF: '1.46', '1.0c/d': '29.2', '3.0c/d': '21.5' },
      },
      note: '入组前未使用任何近视控制药物。',
    },
    v1: {
      exam_date: '2026-06-04',
      investigator: '王医生（上海市眼病防治中心）',
      initials: 'PRX',
      gender: '男',
      height: 137,
      vision_grid: {
        '裸眼视力': { od: '4.6', os: '4.6' },
        '最佳矫正视力': { od: '5.0', os: '5.0' },
      },
      medication_list: [],
      contrast_matrix: {
        OU: { AULCSF: '1.47', '1.0c/d': '29.1', '3.0c/d': '21.4' },
        OD: { AULCSF: '1.43', '1.0c/d': '28.4', '3.0c/d': '20.7' },
        OS: { AULCSF: '1.50', '1.0c/d': '29.8', '3.0c/d': '22.0' },
      },
      note: '3个月复查，度数稳定，暂无明显进展。',
    },
  },
  'P001-S003': {
    v0: {
      exam_date: '2026-03-05',
      investigator: '李医生（复旦大学附属眼耳鼻喉科医院）',
      initials: 'VXM',
      gender: '女',
      height: 142,
      vision_grid: {
        '裸眼视力': { od: '4.3', os: '4.4' },
        '最佳矫正视力': { od: '4.9', os: '4.9' },
      },
      medication_list: [
        { '用药名称': '叶黄素片', '开始时间': '2025-11-15', '是否持续': '否' },
      ],
      contrast_matrix: {
        OU: { AULCSF: '1.28', '1.0c/d': '25.6', '3.0c/d': '18.4' },
        OD: { AULCSF: '1.25', '1.0c/d': '25.0', '3.0c/d': '17.9' },
        OS: { AULCSF: '1.30', '1.0c/d': '26.2', '3.0c/d': '18.8' },
      },
      note: '近视进展较快，近半年加深-1.00D。',
    },
    v1: {},
  },
  'P001-S004': {
    v0: {
      exam_date: '2026-03-07',
      investigator: '陈医生（苏州大学附属儿童医院）',
      initials: 'LWR',
      gender: '男',
      height: 130,
      vision_grid: {
        '裸眼视力': { od: '4.7', os: '4.6' },
        '最佳矫正视力': { od: '5.0', os: '5.0' },
      },
      medication_list: [],
      contrast_matrix: {
        OU: { AULCSF: '1.55', '1.0c/d': '31.0', '3.0c/d': '22.5' },
        OD: { AULCSF: '1.52', '1.0c/d': '30.2', '3.0c/d': '21.9' },
        OS: { AULCSF: '1.58', '1.0c/d': '31.6', '3.0c/d': '23.1' },
      },
      note: '初诊低度近视，双眼对称。',
    },
    v1: {
      exam_date: '2026-06-08',
      investigator: '陈医生（苏州大学附属儿童医院）',
      initials: 'LWR',
      gender: '男',
      height: 132,
      vision_grid: {
        '裸眼视力': { od: '4.7', os: '4.7' },
        '最佳矫正视力': { od: '5.1', os: '5.0' },
      },
      medication_list: [],
      contrast_matrix: {
        OU: { AULCSF: '1.60', '1.0c/d': '31.8', '3.0c/d': '23.3' },
        OD: { AULCSF: '1.57', '1.0c/d': '31.1', '3.0c/d': '22.7' },
        OS: { AULCSF: '1.63', '1.0c/d': '32.4', '3.0c/d': '23.9' },
      },
      note: '3个月随访结果理想，视力保持稳定。',
    },
  },
  'P001-S005': {
    v0: {
      exam_date: '2026-03-10',
      investigator: '徐蔚',
      initials: 'LYF',
      gender: '女',
      height: 125,
      vision_grid: {
        '裸眼视力': { od: '4.8', os: '4.8' },
        '最佳矫正视力': { od: '5.0', os: '5.0' },
      },
      medication_list: [
        { '用药名称': '复合维生素B', '开始时间': '2025-06-01', '是否持续': '是' },
      ],
      contrast_matrix: {
        OU: { AULCSF: '1.68', '1.0c/d': '33.2', '3.0c/d': '24.5' },
        OD: { AULCSF: '1.65', '1.0c/d': '32.6', '3.0c/d': '24.0' },
        OS: { AULCSF: '1.71', '1.0c/d': '33.8', '3.0c/d': '25.0' },
      },
      note: '双眼初诊轻度近视，家族史阴性。',
    },
    v1: {
      exam_date: '2026-06-12',
      investigator: '徐蔚',
      initials: 'LYF',
      gender: '女',
      height: 127,
      vision_grid: {
        '裸眼视力': { od: '4.8', os: '4.8' },
        '最佳矫正视力': { od: '5.0', os: '5.1' },
      },
      medication_list: [
        { '用药名称': '复合维生素B', '开始时间': '2025-06-01', '是否持续': '是' },
      ],
      contrast_matrix: {
        OU: { AULCSF: '1.72', '1.0c/d': '33.9', '3.0c/d': '25.2' },
        OD: { AULCSF: '1.69', '1.0c/d': '33.3', '3.0c/d': '24.6' },
        OS: { AULCSF: '1.74', '1.0c/d': '34.4', '3.0c/d': '25.7' },
      },
      note: '对比敏感度较基线轻度提升，整体状态良好。',
    },
  },
}

export function getVisitFormData(subjectId: string, visitId: string): DynamicFormValue | undefined {
  const subjectData = visitFormDataMap[subjectId]
  if (!subjectData) return undefined
  return subjectData[visitId]
}
