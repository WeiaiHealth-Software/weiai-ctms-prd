import type { Subject } from '../types/subject'

const INITIALS_POOL = ['ZSM','LJH','WXY','CQ','HLM','YTT','QZR','MJN','DYL','FKW','PRX','LCY','TXH','GQY','NSW','BHT','KSL','JQD','VXM','RJN','WZY','LQF','XMJ','HYJ','XCF','SYH','LWR','HXX','WJN','ZM','QX','LSW','CL','WMD','LYF','ZQQ','CYJ','HY','WJ','LZ','FYZ','GJX','PZ','TZY','WYX','LYJ','WHH']

const SOURCES = ['门诊', '招募', '转诊']
const STATUSES: Subject['status'][] = ['筛选中', '已入组', '随访中', '提前退出']
const VISITS = ['基线', '3M', '6M', '9M', '12M']

const pick = <T,>(arr: T[], i: number): T => arr[i % arr.length]

const generateSubjects = (projectId: string, centers: string[], count: number): Subject[] => {
  const arr: Subject[] = []
  for (let i = 0; i < count; i++) {
    const seed = projectId.charCodeAt(projectId.length - 1) + i * 7
    const status = pick(STATUSES, seed)
    const visit = pick(VISITS, seed + 3)
    const pad = (n: number) => String(n).padStart(3, '0')
    const enrollMonth = 1 + ((seed * 3) % 11)
    const enrollDay = 1 + ((seed * 5) % 27)
    const datePart = `${2025 + (i % 2)}-${String(enrollMonth).padStart(2,'0')}-${String(enrollDay).padStart(2,'0')}`
    const nextMonth = 1 + ((enrollMonth + 1 + (i % 6)) % 12)
    const nextYear = 2026
    const nextDate = status === '提前退出' ? '--' : `${nextYear}-${String(nextMonth).padStart(2,'0')}-${String(1 + (i % 27)).padStart(2,'0')}`
    arr.push({
      id: `${projectId}-S${pad(i+1)}`,
      screeningNo: `S-${projectId}-${pad(i+1)}`,
      randomNo: `R${pad(seed % 900 + 100)}`,
      initials: pick(INITIALS_POOL, seed + i),
      source: pick(SOURCES, seed + 1),
      center: pick(centers, seed),
      status,
      currentVisit: status === '筛选中' ? '基线' : visit,
      nextVisitDate: nextDate,
      enrollDate: datePart,
    })
  }
  return arr
}

export const projectSubjects: Record<string, Subject[]> = {
  P001: generateSubjects('P001', ['上海市眼病防治中心', '复旦大学附属眼耳鼻喉科医院', '苏州大学附属儿童医院', '温州医科大学附属眼视光医院'], 40),
  P002: generateSubjects('P002', ['上海市眼病防治中心', '广东中山医院'], 30),
  P003: generateSubjects('P003', ['上海市眼病防治中心'], 12),
  P004: generateSubjects('P004', ['上海市眼病防治中心', '苏州大学附属儿童医院'], 28),
  P005: generateSubjects('P005', ['南京市第一医院', '上海市眼病防治中心'], 35),
  P006: generateSubjects('P006', ['上海市眼病防治中心'], 10),
  P007: generateSubjects('P007', ['复旦大学附属眼耳鼻喉科医院', '上海市眼病防治中心'], 38),
  P008: generateSubjects('P008', ['温州医科大学附属眼视光医院'], 22),
  P009: generateSubjects('P009', ['北京同仁医院', '上海市眼病防治中心', '广东中山医院'], 14),
  P010: generateSubjects('P010', ['浙江大学医学院附属第二医院', '上海市眼病防治中心'], 26),
  P011: generateSubjects('P011', ['苏州市立医院'], 32),
  P012: generateSubjects('P012', ['广东中山医院', '深圳市眼科医院'], 30),
}
