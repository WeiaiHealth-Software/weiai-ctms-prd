import Drawer from '@/components/overlay/Drawer';
import {
  getCommonDetailSections,
  getLogHeadline,
  getLogSubline,
  getTypeDetailSection,
  type LogField,
  type LogRow
} from './logUtils.ts';

type LogDetailDrawerProps = {
  open: boolean;
  log: LogRow | null;
  onClose: () => void;
};

const SectionPanel = ({ title, fields }: { title: string; fields: LogField[] }) => (
  <section className="rounded-2xl border border-slate-200 bg-white">
    <div className="px-5 py-4 border-b border-slate-100">
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-5">
      {fields.map(field => (
        <div key={`${title}-${field.label}`} className="rounded-xl bg-slate-50/80 px-4 py-3 min-h-[84px]">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{field.label}</div>
          {field.valueClassName ? (
            <span
              className={`mt-3 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${field.valueClassName}`}
            >
              {field.value}
            </span>
          ) : (
            <div className="mt-2 text-sm font-medium leading-6 text-slate-700 break-words">{field.value}</div>
          )}
        </div>
      ))}
    </div>
  </section>
);

export default function LogDetailDrawer({ open, log, onClose }: LogDetailDrawerProps) {
  if (!open || !log) return null;

  const sections = [...getCommonDetailSections(log), getTypeDetailSection(log)];

  return (
    <Drawer
      open={open}
      title={getLogHeadline(log)}
      subtitle={getLogSubline(log)}
      onClose={onClose}
      width={720}
      headerClassName="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-white"
      bodyClassName="px-6 py-5 bg-slate-50/70"
    >
      <div className="space-y-4">
        {sections.map(section => (
          <SectionPanel key={section.title} title={section.title} fields={section.fields} />
        ))}
      </div>
    </Drawer>
  );
}
