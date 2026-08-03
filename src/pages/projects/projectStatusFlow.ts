import type { ProjectStatus } from '../../mock/projects';

export type ProjectLifecycleAction = 'start' | 'end' | null;

export type ProjectLifecycleDialogContent = {
  action: Exclude<ProjectLifecycleAction, null>;
  title: string;
  description: string;
  warning?: string;
  confirmLabel: string;
};

export const getProjectLifecycleAction = (status: ProjectStatus): ProjectLifecycleAction => {
  if (status === '未开始') return 'start';
  if (status === '进行中') return 'end';
  return null;
};

export const getProjectLifecycleDialogContent = (
  status: ProjectStatus,
  projectTitle: string
): ProjectLifecycleDialogContent | null => {
  const action = getProjectLifecycleAction(status);

  if (action === 'start') {
    return {
      action,
      title: '确认启动项目？',
      description: `启动后，“${projectTitle}”将进入正式执行状态，可继续录入受试者并开展随机化。`,
      confirmLabel: '确认启动'
    };
  }

  if (action === 'end') {
    return {
      action,
      title: '确认结束项目？',
      description: `结束后，“${projectTitle}”将停止入组与随机化，仅保留历史数据查看与审计。`,
      warning: '结束状态不可恢复，请谨慎确认。',
      confirmLabel: '确认结束项目'
    };
  }

  return null;
};
