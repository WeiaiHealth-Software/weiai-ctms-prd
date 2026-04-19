import type { BuilderField, BuilderFieldType } from '../types'

export function createFieldByType(type: BuilderFieldType): BuilderField {
  const baseId = `field_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`

  const baseLabelMap: Record<BuilderFieldType, string> = {
    section: '新区块',
    text: '新文本字段',
    number: '新数字字段',
    date: '新日期字段',
    select: '新下拉字段',
    radio: '新单选字段',
    textarea: '新多行文本',
    eyeGrid: '新左右眼表格',
    matrix: '新矩阵表格',
    dynamicList: '新动态列表',
  }

  if (type === 'section') {
    return {
      id: baseId,
      type,
      label: baseLabelMap[type],
      key: `${baseId}_key`,
      sectionTitle: '新区块标题',
    }
  }

  if (type === 'select' || type === 'radio') {
    return {
      id: baseId,
      type,
      label: baseLabelMap[type],
      key: `${baseId}_key`,
      placeholder: '请输入占位提示',
      options: ['选项1', '选项2'],
    }
  }

  if (type === 'eyeGrid') {
    return {
      id: baseId,
      type,
      label: baseLabelMap[type],
      key: `${baseId}_key`,
      rows: ['指标1', '指标2'],
    }
  }

  if (type === 'matrix') {
    return {
      id: baseId,
      type,
      label: baseLabelMap[type],
      key: `${baseId}_key`,
      rows: ['OD', 'OS'],
      cols: ['A', 'B', 'C'],
    }
  }

  if (type === 'dynamicList') {
    return {
      id: baseId,
      type,
      label: baseLabelMap[type],
      key: `${baseId}_key`,
      columns: ['名称', '开始时间', '是否持续'],
    }
  }

  return {
    id: baseId,
    type,
    label: baseLabelMap[type],
    key: `${baseId}_key`,
    placeholder: '请输入占位提示',
  }
}
