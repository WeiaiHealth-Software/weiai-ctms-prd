import type { Subject } from '../../../types/subject'

type SubjectInfoCardProps = {
  subject: Subject
}

export default function SubjectInfoCard({ subject }: SubjectInfoCardProps) {
  return (
    <div className="bg-blue-600 text-white rounded-2xl p-5 shadow-sm">
      <div className="text-xs text-blue-100">当前受试者</div>
      <div className="mt-3 text-2xl font-bold">{subject.initials}</div>
      <div className="mt-1 text-sm text-blue-100">{subject.screeningNo}</div>
      <div className="mt-4 inline-flex px-2.5 py-1 rounded-full text-xs bg-white/15 border border-white/20">
        {subject.status}
      </div>
    </div>
  )
}
