import type { Subject } from '../types/subject'

const p001Subjects: Subject[] = [
  { id: 'SUB001', screeningNo: 'S-P001-001', randomNo: 'R001', initials: 'ZSM', source: '门诊', center: '上海市眼病防治中心', status: '随访中', currentVisit: '3M', nextVisitDate: '2026-04-12', enrollDate: '2025-12-12' },
  { id: 'SUB002', screeningNo: 'S-P001-002', randomNo: 'R002', initials: 'LJH', source: '招募', center: '上海市眼病防治中心', status: '已入组', currentVisit: '基线', nextVisitDate: '2026-03-28', enrollDate: '2026-03-01' },
  { id: 'SUB003', screeningNo: 'S-P001-003', randomNo: 'R003', initials: 'WXY', source: '门诊', center: '上海市眼病防治中心', status: '提前退出', currentVisit: '3M', nextVisitDate: '--', enrollDate: '2025-10-22' },
  { id: 'SUB004', screeningNo: 'S-P001-004', randomNo: 'R004', initials: 'CQ', source: '门诊', center: '上海市眼病防治中心', status: '筛选中', currentVisit: '基线', nextVisitDate: '2026-03-24', enrollDate: '2026-03-20' },
  { id: 'SUB005', screeningNo: 'S-P001-005', randomNo: 'R005', initials: 'HLM', source: '招募', center: '上海市眼病防治中心', status: '随访中', currentVisit: '6M', nextVisitDate: '2026-06-18', enrollDate: '2025-09-15' },
  { id: 'SUB006', screeningNo: 'S-P001-006', randomNo: 'R006', initials: 'YTT', source: '门诊', center: '上海市眼病防治中心', status: '已入组', currentVisit: '基线', nextVisitDate: '2026-04-03', enrollDate: '2026-03-03' },
  { id: 'SUB007', screeningNo: 'S-P001-007', randomNo: 'R007', initials: 'QZR', source: '招募', center: '上海市眼病防治中心', status: '随访中', currentVisit: '9M', nextVisitDate: '2026-09-02', enrollDate: '2025-07-10' },
  { id: 'SUB008', screeningNo: 'S-P001-008', randomNo: 'R008', initials: 'MJN', source: '门诊', center: '上海市眼病防治中心', status: '筛选中', currentVisit: '基线', nextVisitDate: '2026-03-26', enrollDate: '2026-03-21' },
  { id: 'SUB009', screeningNo: 'S-P001-009', randomNo: 'R009', initials: 'DYL', source: '招募', center: '上海市眼病防治中心', status: '已入组', currentVisit: '基线', nextVisitDate: '2026-04-05', enrollDate: '2026-03-05' },
  { id: 'SUB010', screeningNo: 'S-P001-010', randomNo: 'R010', initials: 'FKW', source: '门诊', center: '上海市眼病防治中心', status: '随访中', currentVisit: '12M', nextVisitDate: '2026-12-20', enrollDate: '2025-03-11' },
  { id: 'SUB011', screeningNo: 'S-P001-011', randomNo: 'R011', initials: 'PRX', source: '招募', center: '上海市眼病防治中心', status: '提前退出', currentVisit: '6M', nextVisitDate: '--', enrollDate: '2025-08-18' },
  { id: 'SUB012', screeningNo: 'S-P001-012', randomNo: 'R012', initials: 'LCY', source: '门诊', center: '上海市眼病防治中心', status: '随访中', currentVisit: '3M', nextVisitDate: '2026-04-16', enrollDate: '2025-12-18' },
  { id: 'SUB013', screeningNo: 'S-P001-013', randomNo: 'R013', initials: 'TXH', source: '门诊', center: '上海市眼病防治中心', status: '已入组', currentVisit: '基线', nextVisitDate: '2026-04-08', enrollDate: '2026-03-08' },
  { id: 'SUB014', screeningNo: 'S-P001-014', randomNo: 'R014', initials: 'GQY', source: '招募', center: '上海市眼病防治中心', status: '随访中', currentVisit: '6M', nextVisitDate: '2026-06-25', enrollDate: '2025-09-22' },
  { id: 'SUB015', screeningNo: 'S-P001-015', randomNo: 'R015', initials: 'NSW', source: '门诊', center: '上海市眼病防治中心', status: '筛选中', currentVisit: '基线', nextVisitDate: '2026-03-29', enrollDate: '2026-03-22' },
  { id: 'SUB016', screeningNo: 'S-P001-016', randomNo: 'R016', initials: 'BHT', source: '招募', center: '上海市眼病防治中心', status: '随访中', currentVisit: '9M', nextVisitDate: '2026-09-18', enrollDate: '2025-06-30' },
  { id: 'SUB017', screeningNo: 'S-P001-017', randomNo: 'R017', initials: 'KSL', source: '门诊', center: '上海市眼病防治中心', status: '已入组', currentVisit: '基线', nextVisitDate: '2026-04-10', enrollDate: '2026-03-09' },
  { id: 'SUB018', screeningNo: 'S-P001-018', randomNo: 'R018', initials: 'JQD', source: '招募', center: '上海市眼病防治中心', status: '提前退出', currentVisit: '3M', nextVisitDate: '--', enrollDate: '2025-11-14' },
  { id: 'SUB019', screeningNo: 'S-P001-019', randomNo: 'R019', initials: 'VXM', source: '门诊', center: '上海市眼病防治中心', status: '随访中', currentVisit: '12M', nextVisitDate: '2026-12-28', enrollDate: '2025-02-20' },
  { id: 'SUB020', screeningNo: 'S-P001-020', randomNo: 'R020', initials: 'RJN', source: '招募', center: '上海市眼病防治中心', status: '筛选中', currentVisit: '基线', nextVisitDate: '2026-03-31', enrollDate: '2026-03-23' },
]

export const projectSubjects: Record<string, Subject[]> = {
  P001: p001Subjects,
  P002: [],
  P003: [],
}
