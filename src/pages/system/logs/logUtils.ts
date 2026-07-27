export type LogType = '系统日志' | '数据操作日志' | '登录审计';
export type LogResult = '成功' | '失败';
export type RiskLevel = '低风险' | '中风险' | '高风险';

export type LogField = {
  label: string;
  value: string;
  valueClassName?: string;
};

type BaseLogRow = {
  id: number;
  logId: string;
  time: string;
  type: LogType;
  module: string;
  action: string;
  operatorName: string;
  operatorAccount: string;
  operatorRole: string;
  operatorOrg: string;
  ip: string;
  terminal: string;
  source: string;
  result: LogResult;
  riskLevel: RiskLevel;
  summary: string;
  objectType: string;
  objectId: string;
  objectName: string;
  relatedNumber: string;
  traceId: string;
  sessionId: string;
};

export type LoginAuditLog = BaseLogRow & {
  type: '登录审计';
  loginMethod: string;
  authResult: string;
  failureReason: string;
  deviceFingerprint: string;
};

export type DataActionLog = BaseLogRow & {
  type: '数据操作日志';
  changeSummary: string;
  beforeSummary: string;
  afterSummary: string;
  impactObject: string;
  relatedEntity: string;
};

export type SystemTaskLog = BaseLogRow & {
  type: '系统日志';
  taskName: string;
  serviceName: string;
  errorCode: string;
  errorReason: string;
  retryStatus: string;
};

export type LogRow = LoginAuditLog | DataActionLog | SystemTaskLog;

export const TYPE_OPTIONS: LogType[] = ['系统日志', '数据操作日志', '登录审计'];

export const TYPE_BADGE_CLASS: Record<LogType, string> = {
  系统日志: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  数据操作日志: 'bg-sky-50 text-sky-700 border-sky-100',
  登录审计: 'bg-amber-50 text-amber-700 border-amber-100'
};

export const RESULT_BADGE_CLASS: Record<LogResult, string> = {
  成功: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  失败: 'bg-red-50 text-red-600 border-red-100'
};

export const RISK_BADGE_CLASS: Record<RiskLevel, string> = {
  低风险: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  中风险: 'bg-amber-50 text-amber-700 border-amber-100',
  高风险: 'bg-red-50 text-red-600 border-red-100'
};

export const ROW_HIGHLIGHT_CLASS: Record<RiskLevel, string> = {
  低风险: '',
  中风险: 'bg-amber-50/40',
  高风险: 'bg-red-50/45'
};

const pad2 = (n: number) => String(n).padStart(2, '0');

export const formatDate = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
export const formatDateTime = (d: Date) =>
  `${formatDate(d)} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
export const parseDateTime = (value: string) => new Date(value.replace(' ', 'T'));

export const withTime = (date: Date, time: string) => {
  const next = new Date(date);
  const [hour = '0', minute = '0', second = '0'] = time.split(':');
  next.setHours(Number(hour), Number(minute), Number(second), 0);
  return next;
};

export const daysAgo = (baseDate: Date, offset: number, time: string) => {
  const next = new Date(baseDate);
  next.setDate(baseDate.getDate() - offset);
  return withTime(next, time);
};

export const getRecentWeekRange = (baseDate = new Date()) => {
  const endDate = formatDate(baseDate);
  const start = new Date(baseDate);
  start.setDate(baseDate.getDate() - 6);
  return {
    startDate: formatDate(start),
    endDate
  };
};

export const getDefaultDateRange = (rows: LogRow[]) => {
  if (rows.length === 0) {
    return { startDate: '', endDate: '' };
  }

  const timestamps = rows.map(row => parseDateTime(row.time).getTime()).sort((a, b) => a - b);
  return {
    startDate: formatDate(new Date(timestamps[0])),
    endDate: formatDate(new Date(timestamps[timestamps.length - 1]))
  };
};

export const getCommonDetailSections = (row: LogRow) => [
  {
    title: '事件摘要',
    fields: [
      { label: '日志编号', value: row.logId },
      { label: '日志类型', value: row.type },
      { label: '所属模块', value: row.module },
      { label: '操作结果', value: row.result },
      { label: '风险等级', value: row.riskLevel, valueClassName: RISK_BADGE_CLASS[row.riskLevel] },
      { label: '事件说明', value: row.summary }
    ] satisfies LogField[]
  },
  {
    title: '操作主体',
    fields: [
      { label: '操作账号', value: row.operatorAccount },
      { label: '操作人姓名', value: row.operatorName },
      { label: '角色', value: row.operatorRole },
      { label: '所属中心', value: row.operatorOrg }
    ] satisfies LogField[]
  },
  {
    title: '操作对象',
    fields: [
      { label: '对象类型', value: row.objectType },
      { label: '对象标识', value: row.objectId },
      { label: '对象名称', value: row.objectName },
      { label: '关联编号', value: row.relatedNumber }
    ] satisfies LogField[]
  },
  {
    title: '环境与追踪',
    fields: [
      { label: 'IP 地址', value: row.ip },
      { label: '浏览器 / 系统', value: row.terminal },
      { label: '来源入口', value: row.source },
      { label: 'Trace ID', value: row.traceId },
      { label: '会话 ID', value: row.sessionId },
      { label: '请求时间', value: row.time }
    ] satisfies LogField[]
  }
];

export const getTypeDetailSection = (row: LogRow) => {
  if (row.type === '登录审计') {
    return {
      title: '登录审计信息',
      fields: [
        { label: '登录方式', value: row.loginMethod },
        { label: '认证结果', value: row.authResult },
        { label: '失败原因', value: row.failureReason || '--' },
        { label: '设备指纹', value: row.deviceFingerprint }
      ] satisfies LogField[]
    };
  }

  if (row.type === '数据操作日志') {
    return {
      title: '数据变更信息',
      fields: [
        { label: '动作类型', value: row.action },
        { label: '影响对象', value: row.impactObject },
        { label: '关联实体', value: row.relatedEntity },
        { label: '变更前摘要', value: row.beforeSummary },
        { label: '变更后摘要', value: row.afterSummary },
        { label: '变更说明', value: row.changeSummary }
      ] satisfies LogField[]
    };
  }

  return {
    title: '系统任务信息',
    fields: [
      { label: '任务名称', value: row.taskName },
      { label: '服务模块', value: row.serviceName },
      { label: '错误码', value: row.errorCode || '--' },
      { label: '异常原因', value: row.errorReason || '--' },
      { label: '重试状态', value: row.retryStatus }
    ] satisfies LogField[]
  };
};

export const getLogHeadline = (row: LogRow) => `${row.objectName} · 审计详情`;
export const getLogSubline = (row: LogRow) => `${row.time} · ${row.operatorName} / ${row.operatorAccount}`;
