import { Eye } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import type { Subject } from '../../../../types/subject'
import { classNames } from '../../../../lib/classNames'

type SubjectTableProps = {
  subjects: Subject[]
}

export default function SubjectTable({ subjects }: SubjectTableProps) {
  const { projectId } = useParams()

  const sourceClassMap: Record<string, string> = {
    门诊: 'border-blue-200 bg-blue-50 text-blue-700',
    招募: 'border-purple-200 bg-purple-50 text-purple-700',
  }
  const subjectStatusClassMap: Record<string, string> = {
    筛选中: 'border-blue-200 bg-blue-50 text-blue-700',
    随访中: 'border-amber-200 bg-amber-50 text-amber-700',
    已入组: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    提前退出: 'border-rose-200 bg-rose-50 text-rose-700',
  }

  return (
    <div className="overflow-hidden rounded-b-2xl border-x border-b border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="text-left px-4 py-3 font-medium">筛选号</th>
            <th className="text-left px-4 py-3 font-medium">随机号</th>
            <th className="text-left px-4 py-3 font-medium">姓名缩写</th>
            <th className="text-left px-4 py-3 font-medium">来源</th>
            <th className="text-left px-4 py-3 font-medium">当前访视</th>
            <th className="text-left px-4 py-3 font-medium">下次访视日期</th>
            <th className="text-left px-4 py-3 font-medium">受试者状态</th>
            <th className="text-right px-4 py-3 font-medium">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {subjects.map((subject) => (
            <tr key={subject.id} className="hover:bg-slate-50/80">
              <td className="px-4 py-4 font-medium text-slate-800">{subject.screeningNo}</td>
              <td className="px-4 py-4 text-slate-600">{subject.randomNo}</td>
              <td className="px-4 py-4 text-slate-600">{subject.initials}</td>
              <td className="px-4 py-4">
                <span className={classNames('inline-flex rounded-full border px-2.5 py-1 text-xs font-medium', sourceClassMap[subject.source] ?? 'border-slate-200 bg-slate-50 text-slate-600')}>
                  {subject.source}
                </span>
              </td>
              <td className="px-4 py-4">
                <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {subject.currentVisit}
                </span>
              </td>
              <td className="px-4 py-4 text-slate-600">{subject.nextVisitDate}</td>
              <td className="px-4 py-4">
                <span className={classNames('inline-flex rounded-full border px-2.5 py-1 text-xs font-medium', subjectStatusClassMap[subject.status] ?? 'border-slate-200 bg-slate-50 text-slate-600')}>
                  {subject.status}
                </span>
              </td>
              <td className="px-4 py-4 text-right">
                <Link
                  to={`/index/edc/projects/${projectId}/subjects/${subject.id}`}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <Eye className="w-4 h-4" />
                  查看详情
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
