import React, { useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Link,
  X
} from 'lucide-react';

type SubjectStatus = 'enrolled' | 'pending';

interface SubjectDimension {
  label: string;
  value: string;
  options: string[];
}

interface Subject {
  id: string;
  index: string;
  name: string;
  status: SubjectStatus;
  statusLabel: string;
  basic: {
    age: string;
    diopter: string;
    referDoctor: string;
  };
  code: {
    screening?: string;
    subject?: string;
    random?: string;
    product?: string;
  };
  group?: {
    groupName: string;
    splitStatus?: string;
  };
  dimensions: {
    tags: string[];
    items: SubjectDimension[];
  };
}

const SUBJECTS: Subject[] = [
  {
    id: 'sub-01',
    index: '01',
    name: '李强',
    status: 'enrolled',
    statusLabel: '已入组',
    basic: { age: '9岁', diopter: '-1.50D', referDoctor: '李医生' },
    code: {
      screening: '0001',
      subject: 'XW09_0001',
      random: 'R-1001',
      product: 'D-A001'
    },
    group: { groupName: '试验组 A', splitStatus: '--' },
    dimensions: {
      tags: ['男', '7-10岁'],
      items: [
        { label: '性别维度', value: '男', options: ['男', '女'] },
        { label: '年龄分层', value: '7-10岁', options: ['4-7岁', '8-10岁', '11-14岁'] },
        { label: '屈光度范围', value: '-1.0~-0.5', options: ['-1.0~-0.5', '-0.4~0'] }
      ]
    }
  },
  {
    id: 'sub-02',
    index: '02',
    name: '张三',
    status: 'pending',
    statusLabel: '待入组',
    basic: { age: '6岁', diopter: '--', referDoctor: '王医生' },
    code: {},
    dimensions: {
      tags: ['男', '4-7岁'],
      items: [
        { label: '性别维度', value: '男', options: ['男', '女'] },
        { label: '年龄分层', value: '4-7岁', options: ['4-7岁', '8-10岁', '11-14岁'] },
        { label: '屈光度范围', value: '--', options: ['-1.0~-0.5', '-0.4~0'] }
      ]
    }
  },
  {
    id: 'sub-03',
    index: '03',
    name: '赵敏',
    status: 'enrolled',
    statusLabel: '已入组',
    basic: { age: '12岁', diopter: '+0.25D', referDoctor: '陈主任' },
    code: {
      screening: '0002',
      subject: 'XW09_0002',
      random: 'R-1002',
      product: 'D-P001'
    },
    group: { groupName: '对照组 B', splitStatus: '--' },
    dimensions: {
      tags: ['女', '11-14岁'],
      items: [
        { label: '性别维度', value: '女', options: ['男', '女'] },
        { label: '年龄分层', value: '11-14岁', options: ['4-7岁', '8-10岁', '11-14岁'] },
        { label: '屈光度范围', value: '-0.4~0', options: ['-1.0~-0.5', '-0.4~0'] }
      ]
    }
  },
  {
    id: 'sub-04',
    index: '04',
    name: '陈晨',
    status: 'enrolled',
    statusLabel: '已入组',
    basic: { age: '8岁', diopter: '-0.75D', referDoctor: '李医生' },
    code: {
      screening: '0003',
      subject: 'XW09_0003',
      random: 'R-1003',
      product: 'D-A002'
    },
    group: { groupName: '试验组 A', splitStatus: '--' },
    dimensions: {
      tags: ['男', '7-10岁'],
      items: [
        { label: '性别维度', value: '男', options: ['男', '女'] },
        { label: '年龄分层', value: '7-10岁', options: ['4-7岁', '8-10岁', '11-14岁'] },
        { label: '屈光度范围', value: '-1.0~-0.5', options: ['-1.0~-0.5', '-0.4~0'] }
      ]
    }
  },
  {
    id: 'sub-05',
    index: '05',
    name: '王五',
    status: 'pending',
    statusLabel: '待入组',
    basic: { age: '11岁', diopter: '--', referDoctor: '赵医生' },
    code: {},
    dimensions: {
      tags: ['男', '11-14岁'],
      items: [
        { label: '性别维度', value: '男', options: ['男', '女'] },
        { label: '年龄分层', value: '11-14岁', options: ['4-7岁', '8-10岁', '11-14岁'] },
        { label: '屈光度范围', value: '--', options: ['-1.0~-0.5', '-0.4~0'] }
      ]
    }
  }
];

const statusTagClass: Record<SubjectStatus, string> = {
  enrolled: 'bg-green-50 text-green-600 border border-green-100',
  pending: 'bg-amber-50 text-amber-600 border border-amber-200'
};

const SubjectDrawer: React.FC<{
  subject: Subject;
  onClose: () => void;
}> = ({ subject, onClose }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-end">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] animate-fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-h-[86%] bg-white rounded-t-3xl shadow-2xl flex flex-col animate-slide-up overflow-hidden">
        <div className="flex justify-center pt-2 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        <div className="flex items-center justify-between px-5 pt-2 pb-3 shrink-0 border-b border-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <div className="text-lg font-bold text-slate-900">{subject.name}</div>
              <span className={`px-1.5 py-0.5 text-[10px] rounded ${statusTagClass[subject.status]}`}>
                {subject.statusLabel}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">受试者详情</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center shrink-0"
            aria-label="关闭"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 space-y-4 no-scrollbar">
          <section className="bg-slate-50/60 border border-slate-100 rounded-2xl overflow-hidden">
            <header className="px-4 py-2.5 text-[12px] font-bold text-slate-700 border-b border-slate-100 bg-white">
              基础信息
            </header>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-4 text-[13px]">
              <div>
                <div className="text-[11px] text-slate-400 mb-1">姓名</div>
                <div className="font-medium text-slate-800">{subject.name}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 mb-1">年龄</div>
                <div className="font-medium text-slate-800">{subject.basic.age}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 mb-1">屈光度</div>
                <div className="font-medium text-slate-800 font-mono">{subject.basic.diopter}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 mb-1">推荐医生</div>
                <div className="font-medium text-slate-800">{subject.basic.referDoctor}</div>
              </div>
            </div>
          </section>

          <section className="bg-slate-50/60 border border-slate-100 rounded-2xl overflow-hidden">
            <header className="px-4 py-2.5 text-[12px] font-bold text-slate-700 border-b border-slate-100 bg-white">
              编号信息
            </header>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-4 text-[13px]">
              <div>
                <div className="text-[11px] text-slate-400 mb-1">筛选号</div>
                <div className="font-medium text-slate-800 font-mono">{subject.code.screening ?? '--'}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 mb-1">受试者编号</div>
                <div className="font-medium text-slate-800 font-mono">{subject.code.subject ?? '--'}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 mb-1">随机号</div>
                <div className="font-medium text-slate-800 font-mono">{subject.code.random ?? '--'}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 mb-1">产品号</div>
                <div className="font-medium text-slate-800 font-mono">{subject.code.product ?? '--'}</div>
              </div>
            </div>
          </section>

          <section className="bg-slate-50/60 border border-slate-100 rounded-2xl overflow-hidden">
            <header className="px-4 py-2.5 text-[12px] font-bold text-slate-700 border-b border-slate-100 bg-white">
              分组信息
            </header>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-4 text-[13px]">
              <div>
                <div className="text-[11px] text-slate-400 mb-1">研究组</div>
                {subject.group?.groupName ? (
                  <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[11px] rounded border border-indigo-100 font-medium">
                    {subject.group.groupName}
                  </span>
                ) : (
                  <div className="text-slate-400">--</div>
                )}
              </div>
              <div>
                <div className="text-[11px] text-slate-400 mb-1">裂变状态</div>
                <div className="font-medium text-slate-800">{subject.group?.splitStatus ?? '--'}</div>
              </div>
            </div>
          </section>

          <section className="bg-slate-50/60 border border-slate-100 rounded-2xl overflow-hidden">
            <header className="px-4 py-2.5 text-[12px] font-bold text-slate-700 border-b border-slate-100 bg-white">
              维度信息
            </header>
            <div className="p-4">
              {/* <div className="flex flex-wrap gap-1.5 mb-3">
                {subject.dimensions.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-white border border-slate-200 text-[11px] text-slate-600 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div> */}
              <div className="grid grid-cols-2 gap-3">
                {subject.dimensions.items.map(dim => (
                  <div
                    key={dim.label}
                    className="bg-white border border-slate-100 rounded-xl p-3"
                  >
                    <div className="text-[12px] text-slate-600 font-bold mb-1">{dim.label}</div>
                    <div className="text-[13px] font-bold text-slate-900 mb-1.5">{dim.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

type ProjectKind = 'both' | 'iwrs' | 'edc';

interface ProjectDetailProps {
  projectKind?: ProjectKind;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectKind = 'both' }) => {
  const defaultTab: 'iwrs' | 'edc' = projectKind === 'edc' ? 'edc' : 'iwrs';
  const [activeTab, setActiveTab] = useState<'iwrs' | 'edc'>(defaultTab);
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);

  const activeSubject = useMemo(
    () => SUBJECTS.find(s => s.id === activeSubjectId) ?? null,
    [activeSubjectId]
  );

  const showTabs = projectKind === 'both';
  const contentClass = showTabs
    ? 'bg-white border border-gray-200 rounded-lg rounded-tl-none p-4 relative z-[5] shadow-sm min-h-[400px]'
    : 'bg-white border border-gray-200 rounded-lg p-4 relative z-[5] shadow-sm min-h-[400px]';

  return (
    <div className="flex flex-col h-full relative z-10 bg-gray-50">
      <main className="flex-1 overflow-y-auto p-4 pb-4 scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-bl-lg z-10">
            进行中
          </div>

          <div className="p-4 pt-10">
            <h2 className="text-lg font-bold text-gray-900 leading-tight mb-4">一项评价某药物在晚期实体瘤患者中的安全性及有效性的II期临床试验</h2>

            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
              <div className="flex flex-col gap-1">
                <span className="text-gray-400 text-xs">项目编号</span>
                <span className="font-medium text-gray-800">PRJ-2024-001</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-gray-400 text-xs">项目阶段</span>
                <span className="font-medium text-gray-800">II期</span>
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <span className="text-gray-400 text-xs">主要研究者</span>
                <span className="font-medium text-gray-800">张建国 主任</span>
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <span className="text-gray-400 text-xs">申办方</span>
                <span className="font-medium text-gray-800">康和医药科技有限公司</span>
              </div>
            </div>
          </div>
        </div>

        {showTabs && (
          <div className="flex space-x-1">
            <div
              onClick={() => setActiveTab('iwrs')}
              className={`rounded-t-lg px-4 py-2 text-sm font-medium cursor-pointer transition-all border border-b-0 -mb-px relative z-[1] ${
                activeTab === 'iwrs'
                  ? 'bg-white text-blue-600 border-gray-200 z-[10]'
                  : 'bg-gray-100 text-gray-500 border-transparent'
              }`}
            >
              IWRS 随机化
            </div>
            <div
              onClick={() => setActiveTab('edc')}
              className={`rounded-t-lg px-4 py-2 text-sm font-medium cursor-pointer transition-all border border-b-0 -mb-px relative z-[1] ${
                activeTab === 'edc'
                  ? 'bg-white text-emerald-500 border-gray-200 z-[10]'
                  : 'bg-gray-100 text-gray-500 border-transparent'
              }`}
            >
              EDC 数据采集
            </div>
          </div>
        )}

        <div className={contentClass}>
          {activeTab === 'iwrs' && (
            <div className="block">
              <div className="mb-5">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 font-medium">总入组进度</span>
                  <span className="text-blue-600 font-bold">45 / 100</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex flex-col justify-center items-center">
                  <div className="text-sm text-blue-600 mb-1">已入组</div>
                  <div className="text-2xl font-bold text-gray-900">45</div>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-lg border border-gray-100 flex flex-col justify-center items-center">
                  <div className="text-sm text-blue-600 mb-1">待处理预约</div>
                  <div className="text-2xl font-bold text-gray-900">12</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button className="bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm text-center shadow-sm flex justify-center items-center">
                  <Plus className="w-4 h-4 mr-1" />
                  新增受试者
                </button>
                <button className="bg-white border border-blue-600 text-blue-600 py-2.5 rounded-lg font-medium text-sm text-center shadow-sm">
                  处理预约
                </button>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-bold text-gray-800">项目分组概览</h3>
                  <span className="text-xs text-gray-400">共 2 个分组</span>
                </div>

                <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-lg text-gray-900">试验组 A</h4>
                  </div>
                  <div className="flex items-center text-gray-400 text-xs mb-4">
                    <Link className="w-3 h-3 mr-1" />
                    低浓度阿托品 0.01%
                  </div>

                  <div className="flex justify-between gap-4 mb-4 pb-4 border-b border-gray-50">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">已入组</span>
                        <span className="text-blue-600 font-bold">45</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">剩余名额</span>
                        <span className="text-gray-900 font-bold">55</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-gray-300 h-1.5 rounded-full" style={{ width: '55%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-400 mb-3">因子维度分布</div>
                    <div className="space-y-3">
                      {[
                        { tags: ['性别:男', '年龄:4~7岁', '屈光:-1.50~0.00D'], progress: 66.6, text: '10/15' },
                        { tags: ['性别:女', '年龄:8~10岁', '屈光:0.01~1.50D'], progress: 50, text: '10/20' },
                        { tags: ['性别:男', '年龄:11~14岁', '屈光:-1.50~0.00D'], progress: 53.3, text: '8/15' },
                        { tags: ['性别:女', '年龄:4~7岁', '屈光:0.01~1.50D'], progress: 28, text: '14/50' }
                      ].map((row, i) => (
                        <div key={i} className="bg-gray-50/50 border border-gray-100 rounded-lg p-3">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {row.tags.map(t => (
                              <span key={t} className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">{t}</span>
                            ))}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-400 h-2 rounded-full" style={{ width: `${row.progress}%` }}></div>
                            </div>
                            <span className="text-xs font-medium text-gray-700">{row.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-lg text-gray-900">对照组 B</h4>
                  </div>
                  <div className="flex items-center text-gray-400 text-xs mb-4">
                    <Link className="w-3 h-3 mr-1" />
                    安慰剂
                  </div>

                  <div className="flex justify-between gap-4 mb-4 pb-4 border-b border-gray-50">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">已入组</span>
                        <span className="text-blue-600 font-bold">42</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">剩余名额</span>
                        <span className="text-gray-900 font-bold">58</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-gray-300 h-1.5 rounded-full" style={{ width: '58%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-400 mb-3">因子维度分布</div>
                    <div className="space-y-3">
                      {[
                        { tags: ['性别:男', '年龄:4~7岁', '屈光:-1.50~0.00D'], progress: 66.6, text: '10/15' },
                        { tags: ['性别:女', '年龄:8~10岁', '屈光:0.01~1.50D'], progress: 50, text: '10/20' },
                        { tags: ['性别:男', '年龄:11~14岁', '屈光:-1.50~0.00D'], progress: 53.3, text: '8/15' },
                        { tags: ['性别:女', '年龄:4~7岁', '屈光:0.01~1.50D'], progress: 28, text: '14/50' }
                      ].map((row, i) => (
                        <div key={i} className="bg-gray-50/50 border border-gray-100 rounded-lg p-3">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {row.tags.map(t => (
                              <span key={t} className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">{t}</span>
                            ))}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-400 h-2 rounded-full" style={{ width: `${row.progress}%` }}></div>
                            </div>
                            <span className="text-xs font-medium text-gray-700">{row.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-bold text-gray-800">受试者表格</h3>
                  <div className="flex gap-2">
                    <div className="relative">
                      <input type="text" placeholder="姓名" className="w-20 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500" />
                      <Search className="w-3 h-3 text-gray-400 absolute right-2 top-1.5" />
                    </div>
                    <select className="border border-gray-200 rounded px-2 py-1 text-xs bg-white text-gray-600 focus:outline-none focus:border-blue-500 appearance-none pr-6 relative">
                      <option>已入组</option>
                      <option>筛查中</option>
                      <option>已脱落</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 text-gray-500 text-xs border-b border-gray-100">
                        <th className="py-3 px-3 w-14 font-medium text-center">序号</th>
                        <th className="py-3 px-4 font-medium">姓名/状态</th>
                        <th className="py-3 px-4 font-medium text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                      {SUBJECTS.map(s => (
                        <tr key={s.id} className="hover:bg-gray-50/50">
                          <td className="py-3 px-3 text-center font-mono text-xs text-gray-500">{s.index}</td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-gray-900 mb-1">{s.name}</div>
                            <span className={`inline-block px-1.5 py-0.5 text-[10px] rounded border ${statusTagClass[s.status]}`}>
                              {s.statusLabel}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {s.status === 'enrolled' ? (
                              <button
                                className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold hover:bg-blue-100 transition"
                                onClick={() => setActiveSubjectId(s.id)}
                              >
                                查看
                              </button>
                            ) : (
                              <button
                                className="px-3 py-1 bg-amber-50 text-amber-600 rounded text-xs font-bold whitespace-nowrap hover:bg-amber-100 transition"
                                onClick={() => setActiveSubjectId(s.id)}
                              >
                                处理预约
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'edc' && (
            <div className="block">
              <div className="mb-5">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 font-medium">CRF 整体完成度</span>
                  <span className="text-green-600 font-bold">82%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex flex-col justify-center items-center">
                  <div className="text-xs text-green-700 mb-1">待填表单</div>
                  <div className="text-xl font-bold text-gray-900">24</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex flex-col justify-center items-center relative">
                  <div className="text-xs text-green-700 mb-1">未解决质疑</div>
                  <div className="text-xl font-bold text-gray-900">8</div>
                  <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex flex-col justify-center items-center">
                  <div className="text-xs text-green-700 mb-1">待签名</div>
                  <div className="text-xl font-bold text-gray-900">15</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex flex-col justify-center items-center">
                  <div className="text-xs text-green-700 mb-1">SDV 完成率</div>
                  <div className="text-xl font-bold text-gray-900">65%</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button className="bg-green-600 text-white py-2.5 rounded-lg font-medium text-sm text-center shadow-sm flex justify-center items-center">
                  <Edit className="w-4 h-4 mr-1" />
                  录入数据
                </button>
                <button className="bg-white border border-green-600 text-green-600 py-2.5 rounded-lg font-medium text-sm text-center shadow-sm">
                  处理质疑
                </button>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex justify-between items-center">
                  <span>待办录入 & 质疑</span>
                  <a href="#" className="text-xs text-green-600 font-normal">查看全部 &gt;</a>
                </h3>
                <div className="space-y-3">
                  <div className="border border-red-200 bg-red-50/50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded border border-red-200">系统质疑</span>
                      <span className="text-xs text-gray-500">刚刚</span>
                    </div>
                    <div className="font-bold text-gray-800 text-sm">SUB-045 - 生命体征</div>
                    <div className="text-xs text-gray-600 mt-1">收缩压 (160) 超出正常参考范围，请核实。</div>
                  </div>
                  <div className="border border-gray-100 bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded border border-green-200">待录入</span>
                      <span className="text-xs text-gray-500">今天 10:00</span>
                    </div>
                    <div className="font-bold text-gray-800 text-sm">SUB-021 - V2 访视访视表</div>
                    <div className="text-xs text-gray-600 mt-1">受试者已完成访视，请尽快补充实验室检查数据。</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {activeSubject && (
        <SubjectDrawer
          subject={activeSubject}
          onClose={() => setActiveSubjectId(null)}
        />
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.18s ease-out both; }
        .animate-slide-up { animation: slide-up 0.26s cubic-bezier(0.22, 1, 0.36, 1) both; }
      `}</style>
    </div>
  );
};

export default ProjectDetail;
