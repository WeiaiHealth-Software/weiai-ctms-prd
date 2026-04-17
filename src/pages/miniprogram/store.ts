export const DB = {
  project: {
    name: "青少年近视防控临床研究",
    code: "MYOPIA-2024-001",
    totalTarget: 150,
    enrolled: 42,
    dimensions: {
      sex: ["男", "女"],
      age: ["4~7岁", "8~10岁", "11~14岁"],
      diopter: ["-1.50~0.00D", "0.01D~1.50D"]
    }
  },
  groups: [
    {
      id: 'g1', name: '试验组 A', drug: '低浓度阿托品 0.01%',
      enrolled: 45, target: 100,
      dimensions: [
        { name: '性别:男 | 年龄:4～7岁 | 屈光:-1.50～0.00D', current: 8, target: 15 },
        { name: '性别:女 | 年龄:8～10岁 | 屈光:0.01～1.50D', current: 12, target: 20 },
        { name: '性别:男 | 年龄:11～14岁 | 屈光:-1.50～0.00D', current: 5, target: 15 },
        { name: '性别:女 | 年龄:4～7岁 | 屈光:0.01～1.50D', current: 20, target: 50 }
      ]
    },
    {
      id: 'g2', name: '对照组 B', drug: '安慰剂',
      enrolled: 42, target: 100,
      dimensions: [
        { name: '性别:男 | 年龄:4～7岁 | 屈光:-1.50～0.00D', current: 10, target: 15 },
        { name: '性别:女 | 年龄:8～10岁 | 屈光:0.01～1.50D', current: 10, target: 20 },
        { name: '性别:男 | 年龄:11～14岁 | 屈光:-1.50～0.00D', current: 8, target: 15 },
        { name: '性别:女 | 年龄:4～7岁 | 屈光:0.01～1.50D', current: 14, target: 50 }
      ]
    }
  ],
  appointments: [
    { id: '101', name: '张伟', phone: '13800138000', sex: '', age: '', diopter: '', status: 'pending_info', doctor: '李医生', time: '10:30', group: '', s_no: 'S-001', id_no: '', r_no: '', drug_no: '' },
    { id: '102', name: '王芳', phone: '13912345678', sex: '女', age: '8~10岁', diopter: '-1.50~0.00D', status: 'pending_confirm', doctor: '李医生', time: '09:15', group: '', s_no: 'S-002', id_no: '', r_no: '', drug_no: '' },
    { id: '103', name: '李强', phone: '13766668888', sex: '男', age: '4~7岁', diopter: '-1.50~0.00D', status: 'enrolled', doctor: '李医生', time: '昨天', group: 'g1', s_no: 'S-003', id_no: 'ID-A01', r_no: 'R-X92', drug_no: 'D-K31' },
    { id: '104', name: '赵敏', phone: '13999990000', sex: '女', age: '8~10岁', diopter: '0.01D~1.50D', status: 'enrolled', doctor: '李医生', time: '昨天', group: 'g2', s_no: 'S-004', id_no: 'ID-B05', r_no: 'R-Y88', drug_no: 'D-M55' },
    { id: '105', name: '刘洋', phone: '13611112222', sex: '男', age: '11~14岁', diopter: '0.01D~1.50D', status: 'pending_confirm', doctor: '李医生', time: '前天', group: '', s_no: 'S-005', id_no: '', r_no: '', drug_no: '' },
    { id: '106', name: '陈晨', phone: '13533334444', sex: '女', age: '4~7岁', diopter: '-1.50~0.00D', status: 'enrolled', doctor: '李医生', time: '前天', group: 'g1', s_no: 'S-006', id_no: 'ID-C09', r_no: 'R-Z11', drug_no: 'D-P77' },
    { id: '107', name: '杨光', phone: '13888889999', sex: '男', age: '8~10岁', diopter: '0.01D~1.50D', status: 'closed', doctor: '李医生', time: '3天前', group: '', s_no: 'S-007', id_no: '', r_no: '', drug_no: '' },
    { id: '108', name: '周杰', phone: '13900001111', sex: '男', age: '11~14岁', diopter: '-1.50~0.00D', status: 'enrolled', doctor: '李医生', time: '4天前', group: 'g2', s_no: 'S-008', id_no: 'ID-D12', r_no: 'R-Q33', drug_no: 'D-L99' },
    { id: '109', name: '吴艳', phone: '13722223333', sex: '女', age: '4~7岁', diopter: '0.01D~1.50D', status: 'pending_info', doctor: '李医生', time: '5天前', group: '', s_no: 'S-009', id_no: '', r_no: '', drug_no: '' },
    { id: '110', name: '郑华', phone: '13655556666', sex: '男', age: '8~10岁', diopter: '-1.50~0.00D', status: 'enrolled', doctor: '李医生', time: '一周前', group: 'g1', s_no: 'S-010', id_no: 'ID-E45', r_no: 'R-W66', drug_no: 'D-N22' }
  ],
  users: {
    doc: { name: '张三', role: 'doc' },
    crc: { name: '王CRC', role: 'crc' },
    mfr: { name: '张经理', role: 'mfr' }
  }
};

export const utils = {
  getStatusBadge: (status: string) => {
    const map: Record<string, { class: string, text: string }> = {
      'pending_info': { class: 'bg-yellow-100 text-yellow-700 border border-yellow-200', text: '待补充资料' },
      'pending_confirm': { class: 'bg-blue-100 text-blue-700 border border-blue-200', text: '待CRC确认' },
      'confirmed': { class: 'bg-green-100 text-green-700 border border-green-200', text: '预约成功' },
      'closed': { class: 'bg-slate-100 text-slate-500 border border-slate-200', text: '已关闭' },
      'enrolled': { class: 'bg-purple-100 text-purple-700 border border-purple-200', text: '已入组' }
    };
    const s = map[status] || map['closed'];
    return `<span class="px-2 py-0.5 rounded text-[10px] font-bold ${s.class}">${s.text}</span>`;
  }
};
