import test from 'node:test';
import assert from 'node:assert/strict';
import { getProjectLifecycleAction, getProjectLifecycleDialogContent } from './projectStatusFlow';

test('未开始项目应显示启动动作', () => {
  assert.equal(getProjectLifecycleAction('未开始'), 'start');
});

test('进行中项目应显示结束动作', () => {
  assert.equal(getProjectLifecycleAction('进行中'), 'end');
});

test('初始化和已结束项目不应显示生命周期动作', () => {
  assert.equal(getProjectLifecycleAction('初始化'), null);
  assert.equal(getProjectLifecycleAction('已结束'), null);
});

test('启动弹窗文案应强调进入正式执行状态', () => {
  const dialog = getProjectLifecycleDialogContent('未开始', '青少年近视防控项目');

  assert.deepEqual(dialog, {
    action: 'start',
    title: '确认启动项目？',
    description: '启动后，“青少年近视防控项目”将进入正式执行状态，可继续录入受试者并开展随机化。',
    confirmLabel: '确认启动'
  });
});

test('结束弹窗文案应强调不可恢复与历史保留', () => {
  const dialog = getProjectLifecycleDialogContent('进行中', '青少年近视防控项目');

  assert.deepEqual(dialog, {
    action: 'end',
    title: '确认结束项目？',
    description:
      '结束后，“青少年近视防控项目”将停止入组与随机化，仅保留历史数据查看与审计。',
    warning: '结束状态不可恢复，请谨慎确认。',
    confirmLabel: '确认结束项目'
  });
});
