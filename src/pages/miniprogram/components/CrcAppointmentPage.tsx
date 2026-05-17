import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import classNames from 'classnames';
import { Appointment, DB, db } from '../store';

type Props = {
  appointmentId: string;
  onDone?: () => void;
};

export const CrcAppointmentPage: React.FC<Props> = ({ appointmentId, onDone }) => {
  const appt = useMemo(
    () => (DB.appointments as Appointment[]).find(a => a.id === appointmentId) || null,
    [appointmentId]
  );

  const [sex, setSex] = useState('');
  const [age, setAge] = useState('');
  const [diopter, setDiopter] = useState('');
  const [closeOpen, setCloseOpen] = useState(false);
  const [closeReason, setCloseReason] = useState('');

  useEffect(() => {
    setSex(appt?.sex || '');
    setAge(appt?.age || '');
    setDiopter(appt?.diopter || '');
    setCloseOpen(false);
    setCloseReason('');
  }, [appt?.id]);

  if (!appt) {
    return (
      <div className="h-full bg-slate-50 flex items-center justify-center text-slate-400 text-sm">
        预约记录不存在
      </div>
    );
  }

  const canOperate = appt.status === 'pending_info' || appt.status === 'pending_confirm' || appt.status === 'confirmed';
  const allDims = Boolean(sex && age && diopter);

  const updateDims = (patch: Partial<Pick<Appointment, 'sex' | 'age' | 'diopter'>>) => {
    db.updateAppointment(appt.id, patch as Partial<Appointment>);
  };

  const handleConfirm = () => {
    if (!canOperate) return;
    db.updateAppointment(appt.id, { sex, age, diopter, status: 'confirmed' });
    window.alert('已确认预约并锁定名额');
  };

  const handleEnroll = () => {
    if (!canOperate || !allDims) return;

    const group = sex === '男' ? 'g1' : 'g2';
    const suffix = String(Date.now()).slice(-4);
    db.updateAppointment(appt.id, {
      sex,
      age,
      diopter,
      status: 'enrolled',
      group,
      id_no: appt.id_no || `ID-${suffix}`,
      r_no: appt.r_no || `R-${suffix}`,
      drug_no: appt.drug_no || `D-${suffix}`
    });
    window.alert('已一键转入组');
    onDone?.();
  };

  const handleClose = () => {
    if (!canOperate) return;
    const reason = closeReason.trim();
    if (!reason) {
      window.alert('请填写无法入组原因');
      return;
    }
    db.updateAppointment(appt.id, { status: 'closed', closeReason: reason });
    window.alert('已取消入组');
    setCloseOpen(false);
    onDone?.();
  };

  const statusTag =
    appt.status === 'pending_confirm'
      ? { text: '待确认', cls: 'bg-blue-50 text-blue-600 border border-blue-100' }
      : appt.status === 'pending_info'
        ? { text: '待补全', cls: 'bg-orange-50 text-orange-600 border border-orange-100' }
        : appt.status === 'confirmed'
          ? { text: '已锁定', cls: 'bg-emerald-50 text-emerald-600 border border-emerald-100' }
          : appt.status === 'enrolled'
            ? { text: '已入组', cls: 'bg-purple-50 text-purple-600 border border-purple-100' }
            : { text: '已关闭', cls: 'bg-slate-50 text-slate-600 border border-slate-200' };

  return (
    <div className="h-full bg-slate-50 relative overflow-y-auto no-scrollbar">
      <div className="p-4 pb-10 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[12px] text-slate-500 font-bold mb-1">患者姓名</div>
              <div className="text-[22px] font-black text-slate-900">{appt.name}</div>
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-[12px] font-bold ${statusTag.cls}`}>{statusTag.text}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="text-[12px] text-slate-500 font-bold">联系电话</div>
              <div className="mt-1 text-[16px] font-black text-blue-600">{appt.phone}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="text-[12px] text-slate-500 font-bold">推荐医生</div>
              <div className="mt-1 text-[16px] font-black text-slate-900">{appt.doctor}</div>
            </div>
          </div>
        </div>

        <div className="text-[18px] font-black text-slate-900 px-1">维度核查</div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-slate-800 mb-2">性别</label>
            <select
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-800 font-bold"
              value={sex}
              onChange={e => {
                setSex(e.target.value);
                updateDims({ sex: e.target.value });
              }}
              disabled={!canOperate}
            >
              <option value="">请选择</option>
              {DB.project.dimensions.sex.map(o => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-800 mb-2">年龄段</label>
            <select
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-800 font-bold"
              value={age}
              onChange={e => {
                setAge(e.target.value);
                updateDims({ age: e.target.value });
              }}
              disabled={!canOperate}
            >
              <option value="">请选择</option>
              {DB.project.dimensions.age.map(o => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-800 mb-2">屈光度</label>
            <select
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-800 font-bold"
              value={diopter}
              onChange={e => {
                setDiopter(e.target.value);
                updateDims({ diopter: e.target.value });
              }}
              disabled={!canOperate}
            >
              <option value="">请选择</option>
              {DB.project.dimensions.diopter.map(o => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
          <button
            type="button"
            className={classNames(
              'w-full py-3.5 rounded-2xl font-black text-[16px] flex items-center justify-center gap-2 transition-colors',
              canOperate ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-200 text-slate-500'
            )}
            onClick={handleConfirm}
            disabled={!canOperate}
          >
            <CheckCircle2 className="w-5 h-5" />
            确认预约 & 锁定名额
          </button>

          <button
            type="button"
            className={classNames(
              'w-full py-3.5 rounded-2xl font-black text-[16px] transition-colors',
              canOperate && allDims
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-50 text-slate-400 border border-slate-200'
            )}
            onClick={handleEnroll}
            disabled={!canOperate || !allDims}
          >
            一键转入组（快捷转化）
          </button>

          <button
            type="button"
            className={classNames(
              'w-full py-3.5 rounded-2xl font-black text-[16px] transition-colors',
              canOperate ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100' : 'bg-slate-50 text-slate-400 border border-slate-200'
            )}
            onClick={() => setCloseOpen(true)}
            disabled={!canOperate}
          >
            无法入组
          </button>
        </div>
      </div>

      {closeOpen && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[18px] font-black text-slate-900">填写无法入组原因</div>
              <button
                type="button"
                className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center"
                onClick={() => setCloseOpen(false)}
              >
                <XCircle className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            <textarea
              className="w-full h-28 p-4 rounded-2xl border border-slate-200 outline-none focus:border-rose-400 text-[14px] resize-none"
              placeholder="请详细描述无法入组的原因…"
              value={closeReason}
              onChange={e => setCloseReason(e.target.value)}
            />
            <button
              type="button"
              className="mt-4 w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-[16px] py-3.5 rounded-2xl"
              onClick={handleClose}
            >
              确认取消入组
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
