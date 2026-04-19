import { Eye } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import type { Subject } from '../../../../types/subject'
import { classNames } from '../../../../lib/classNames'
import { statusClassMap } from '../../../../lib/statusMap'

type SubjectTableProps = {
  subjects: Subject[]
}

export default function SubjectTable({ subjects }: SubjectTableProps) {
  const { projectId } = useParams()

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
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
              <td className="px-4 py-4 text-slate-600">{subject.source}</td>
              <td className="px-4 py-4 text-slate-600">{subject.currentVisit}</td>
              <td className="px-4 py-4 text-slate-600">{subject.nextVisitDate}</td>
              <td className="px-4 py-4">
                <span className={classNames('px-2.5 py-1 rounded-full text-xs font-medium', statusClassMap[subject.status])}>
                  {subject.status}
                </span>
              </td>
              <td className="px-4 py-4 text-right">
                <Link
                  to={`/projects/${projectId}/subjects/${subject.id}`}
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
