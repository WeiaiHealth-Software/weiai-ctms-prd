
// src/projects/detail.js

// Mock Data for Project 1 (Normal)
const project1Data = [
  {
    id: 'CHILD_ELESCREEN_0001',
    screenId: '0001',
    randomId: 'R-1001',
    drugId: 'D-A001',
    name: '张小明',
    age: '8岁',
    indicator: '-1.50D',
    group: '实验组',
    groupClass: 'bg-indigo-50 text-indigo-700',
    tags: ['男', '7-10岁'],
    status: 'enrolled',
    doctor: '李医生'
  },
  {
    id: '--',
    screenId: '0002',
    randomId: '--',
    drugId: '--',
    name: '李雅',
    age: '6岁',
    indicator: '-0.50D',
    group: '未入组',
    groupClass: 'text-slate-400 bg-slate-100',
    tags: [],
    status: 'failed',
    doctor: '王医生'
  },
  {
    id: 'CHILD_ELESCREEN_0003',
    screenId: '0003',
    randomId: 'R-1002',
    drugId: 'D-A002',
    name: '王强',
    age: '11岁',
    indicator: '-2.75D',
    group: '实验组',
    groupClass: 'bg-indigo-50 text-indigo-700',
    tags: ['男', '10-14岁'],
    status: 'enrolled',
    doctor: '张主任'
  },
  {
    id: 'CHILD_ELESCREEN_0004',
    screenId: '0004',
    randomId: 'R-1003',
    drugId: 'D-B001',
    name: '陈静',
    age: '9岁',
    indicator: '-1.25D',
    group: '对照组',
    groupClass: 'bg-emerald-50 text-emerald-600',
    tags: ['女', '7-10岁'],
    status: 'enrolled',
    doctor: '李医生'
  },
  {
    id: 'CHILD_ELESCREEN_0005',
    screenId: '0005',
    randomId: 'R-1004',
    drugId: 'D-A003',
    name: '赵雷',
    age: '12岁',
    indicator: '-3.00D',
    group: '实验组',
    groupClass: 'bg-indigo-50 text-indigo-700',
    tags: ['男', '10-14岁'],
    status: 'enrolled',
    doctor: '赵医生'
  },
  {
    id: '--',
    screenId: '0006',
    randomId: '--',
    drugId: '--',
    name: '孙美丽',
    age: '7岁',
    indicator: '-0.75D',
    group: '未入组',
    groupClass: 'text-slate-400 bg-slate-100',
    tags: [],
    status: 'failed',
    doctor: '王医生'
  },
  {
    id: 'CHILD_ELESCREEN_0007',
    screenId: '0007',
    randomId: 'R-1005',
    drugId: 'D-B002',
    name: '周杰',
    age: '10岁',
    indicator: '-2.00D',
    group: '对照组',
    groupClass: 'bg-emerald-50 text-emerald-600',
    tags: ['男', '7-10岁'],
    status: 'enrolled',
    doctor: '张主任'
  },
  {
    id: 'CHILD_ELESCREEN_0008',
    screenId: '0008',
    randomId: 'R-1006',
    drugId: 'D-A004',
    name: '吴芳',
    age: '8岁',
    indicator: '-1.75D',
    group: '实验组',
    groupClass: 'bg-indigo-50 text-indigo-700',
    tags: ['女', '7-10岁'],
    status: 'enrolled',
    doctor: '李医生'
  },
  {
    id: 'CHILD_ELESCREEN_0009',
    screenId: '0009',
    randomId: 'R-1007',
    drugId: 'D-B003',
    name: '郑强',
    age: '13岁',
    indicator: '-3.50D',
    group: '对照组',
    groupClass: 'bg-emerald-50 text-emerald-600',
    tags: ['男', '10-14岁'],
    status: 'enrolled',
    doctor: '赵医生'
  },
  {
    id: 'CHILD_ELESCREEN_0010',
    screenId: '0010',
    randomId: 'R-1008',
    drugId: 'D-A005',
    name: '冯婷婷',
    age: '11岁',
    indicator: '-2.25D',
    group: '实验组',
    groupClass: 'bg-indigo-50 text-indigo-700',
    tags: ['女', '10-14岁'],
    status: 'enrolled',
    doctor: '王医生'
  },
  {
    id: '--',
    screenId: '--',
    randomId: '--',
    drugId: '--',
    name: '王芳',
    age: '9岁',
    indicator: '-1.25D',
    group: '待入组',
    groupClass: 'text-amber-600 bg-amber-50 border border-amber-200',
    tags: ['女', '7-10岁'],
    status: 'pending',
    doctor: '李医生'
  },
  {
    id: '--',
    screenId: '--',
    randomId: '--',
    drugId: '--',
    name: '张伟',
    age: '10岁',
    indicator: '-2.00D',
    group: '待入组',
    groupClass: 'text-amber-600 bg-amber-50 border border-amber-200',
    tags: ['男', '7-10岁'],
    status: 'pending',
    doctor: '赵医生'
  }
];

// Mock Data for Project 2 (Fission)
const project2Data = [
  {
    id: 'CARDIO_0001',
    screenId: '0001',
    randomId: 'R-87766',
    drugId: 'D-f68823', // Stage 1
    drugId_stage1: 'D-f68823',
    drugId_stage2: 'D-S2-EXP-8001',
    name: '刘建国',
    age: '65岁',
    indicator: 'EF 45%',
    group: '实验组',
    groupClass: 'bg-indigo-50 text-indigo-700',
    tags: ['男', '>60岁'],
    status: 'enrolled',
    stage: 'Stage 1',
    isFissioned: false,
    doctor: '李主任'
  },
  {
    id: 'CARDIO_0002',
    screenId: '0002',
    randomId: 'R-9902',
    drugId: 'D-S2-112',
    drugId_stage1: 'D-112',
    drugId_stage2: 'D-S2-112',
    name: '王淑芬',
    age: '58岁',
    indicator: 'EF 52%',
    group: '对照组',
    subGroup: '对照组：裂变子组1',
    groupClass: 'bg-emerald-50 text-emerald-600',
    tags: ['女', '50-60岁'],
    status: 'enrolled',
    stage: 'Stage 2',
    isFissioned: true,
    doctor: '张医生'
  },
  {
    id: 'CARDIO_0005',
    screenId: '0003',
    randomId: 'R-9908',
    drugId: 'D-S2-118',
    drugId_stage1: 'D-118',
    drugId_stage2: 'D-S2-118',
    name: '赵铁柱',
    age: '62岁',
    indicator: 'EF 48%',
    group: '对照组',
    subGroup: '对照组：裂变子组1',
    groupClass: 'bg-emerald-50 text-emerald-600',
    tags: ['男', '>60岁'],
    status: 'enrolled',
    stage: 'Stage 2',
    isFissioned: true,
    doctor: '王主任'
  },
  {
    id: 'CARDIO_0008',
    screenId: '0004',
    randomId: 'R-8897',
    drugId: 'D-77823',
    drugId_stage1: 'D-77823',
    drugId_stage2: 'D-S2-77823',
    name: '钱大爷',
    age: '70岁',
    indicator: 'EF 42%',
    group: '对照组',
    groupClass: 'bg-emerald-50 text-emerald-700',
    tags: ['男', '>60岁'],
    status: 'enrolled',
    stage: 'Stage 1',
    isFissioned: false,
    doctor: '李主任'
  },
  {
     id: '--',
     screenId: '0005',
     randomId: '--',
     drugId: '--',
     name: '孙大妈',
     age: '68岁',
     indicator: 'EF 50%',
     group: '未入组',
     groupClass: 'text-slate-400 bg-slate-100',
     tags: [],
     status: 'failed',
     stage: '--',
     doctor: '张医生'
  }
];

// Current Project Type State
window.currentProjectType = 'NORMAL'; // 'NORMAL' or 'FISSION'

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
});

// Filter Function
window.applyFilter = function() {
    renderTable();
}

// Function to switch project type (for testing/demo purposes)
function switchProjectType(type) {
    window.currentProjectType = type;
    
    // Toggle Fission Alert Button
    const alertBtn = document.getElementById('fission-due-alert-btn');
    if (type === 'FISSION' && alertBtn) {
        alertBtn.classList.remove('hidden');
    } else if (alertBtn) {
        alertBtn.classList.add('hidden');
    }

    renderTable();
}

function renderTable() {
    const tableContainer = document.querySelector('#data-table-wrapper table');
    if (!tableContainer) return;

    let data = window.currentProjectType === 'NORMAL' ? project1Data : project2Data;
    const isFission = window.currentProjectType === 'FISSION';

    // Apply Filter
    const filterEl = document.getElementById('filter-status');
    const filterValue = filterEl ? filterEl.value : 'all';
    const searchInput = document.getElementById('search-input');
    const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : '';

    if (filterValue === 'participated') {
        data = data.filter(row => row.status === 'enrolled');
    } else if (filterValue === 'not_participated') {
        data = data.filter(row => row.status !== 'enrolled');
    } else if (filterValue === 'match_success') {
        data = data.filter(row => row.status === 'enrolled');
    } else if (filterValue === 'match_failed') {
        data = data.filter(row => row.status === 'failed');
    } else if (filterValue === 'pending') {
        data = data.filter(row => row.status === 'pending');
    }
    
    if (searchValue) {
        data = data.filter(row => row.name.toLowerCase().includes(searchValue));
    }
    // 'all' shows everything

    // Sort data: Pending first
    data.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return 0;
    });

    // Build Thead
    let theadHtml = `
        <thead>
            <tr class="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider">
              <th class="px-6 py-4 font-semibold group-[.blind-mode-active]:hidden">筛选号</th>
              <th class="px-6 py-4 font-semibold">受试者编号</th>
              <th class="px-6 py-4 font-semibold group-[.blind-mode-active]:hidden">随机号</th>
              <th class="px-6 py-4 font-semibold group-[.blind-mode-active]:hidden">产品号</th>
              <th class="px-6 py-4 font-semibold">姓名</th>
              <th class="px-6 py-4 font-semibold">年龄</th>
              <th class="px-6 py-4 font-semibold">指标</th>
              <th class="px-6 py-4 font-semibold group-[.blind-mode-active]:hidden">分组</th>
              <th class="px-6 py-4 font-semibold group-[.blind-mode-active]:hidden">维度标签</th>
              <th class="px-6 py-4 font-semibold">推荐医生</th>
              ${isFission ? '<th class="px-6 py-4 font-semibold group-[.blind-mode-active]:hidden">裂变状态</th>' : ''}
              <th class="px-6 py-4 font-semibold text-right">操作</th>
            </tr>
        </thead>
    `;

    // Build Tbody
    let tbodyHtml = '<tbody class="divide-y divide-slate-100 text-sm">';
    
    data.forEach(row => {
        let actionButtons = '';
        
        if (row.status === 'failed') {
             actionButtons = `<button class="text-slate-400 hover:text-brand-600 font-medium text-sm">查看详情</button>`;
        } else if (row.status === 'pending') {
             actionButtons = `<button onclick="openProcessEnrollDrawer('${row.name}', '${row.doctor}', '${row.age}', '${row.indicator}')" class="text-brand-600 hover:text-brand-700 font-bold text-sm bg-brand-50 px-3 py-1 rounded-lg border border-brand-200">处理预约</button>`;
        } else if (isFission) {
            if (row.isFissioned) {
                actionButtons = `
                    <div class="flex items-center justify-end gap-3">
                        <button class="text-slate-300 cursor-not-allowed font-medium text-xs flex items-center gap-1 px-2 py-1" disabled>
                            <i class="ri-check-line"></i> 已裂变
                        </button>
                        <button class="text-slate-400 hover:text-brand-600 font-medium text-sm">详情</button>
                    </div>
                `;
            } else if (row.stage === 'Stage 1') {
                 // Logic Update: Everyone in Stage 1 can "Fission" (change drug)
                 actionButtons = `
                    <div class="flex items-center justify-end gap-3">
                        <button onclick="openFissionModal('${row.id}', '${row.name}')" class="text-indigo-600 hover:text-indigo-700 font-bold text-xs flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 hover:bg-indigo-100 transition-colors">
                            <i class="ri-flashlight-fill"></i> 裂变
                        </button>
                        <button class="text-slate-400 hover:text-brand-600 font-medium text-sm">详情</button>
                    </div>
                `;
            } else {
                 actionButtons = `<button class="text-slate-400 hover:text-brand-600 font-medium text-sm">详情</button>`;
            }
        } else {
            actionButtons = `<button class="text-slate-400 hover:text-brand-600 font-medium text-sm">查看详情</button>`;
        }

        let groupContent = `
            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${row.groupClass}">${row.group}</span>
        `;
        if (row.subGroup) {
             groupContent = `
                <div class="flex flex-col items-start gap-1">
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-100 opacity-70 decoration-slate-400">${row.group}</span>
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                        <i class="ri-arrow-return-right-line mr-1"></i>${row.subGroup}
                    </span>
                </div>
             `;
        }

        let tagsContent = row.tags.map(tag => `<span class="px-1.5 py-0.5 rounded border border-slate-200 text-xs text-slate-500">${tag}</span>`).join('');
        
        let fissionStatusCell = '';
        if (isFission) {
            let stageBadge = '--';
            if (row.stage && row.stage !== '--') {
                const color = row.stage === 'Stage 2' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-amber-100 text-amber-700 border-amber-200';
                stageBadge = `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color} border">${row.stage}</span>`;
            } else {
                 stageBadge = `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">--</span>`;
            }
             fissionStatusCell = `<td class="px-6 py-4 group-[.blind-mode-active]:hidden">${stageBadge}</td>`;
        }

        // Drug ID Display Logic
        let drugIdDisplay = row.drugId;
        if (isFission && row.isFissioned && row.drugId_stage1) {
            drugIdDisplay = `<span class="text-slate-400 line-through mr-1">${row.drugId_stage1}</span> <i class="ri-arrow-right-line text-xs text-slate-300"></i> <span class="text-brand-600 font-bold">${row.drugId_stage2}</span>`;
        }

        tbodyHtml += `
            <tr class="hover:bg-slate-50/80 transition-colors">
              <td class="px-6 py-4 font-mono font-medium text-slate-600 group-[.blind-mode-active]:hidden">${row.screenId}</td>
              <td class="px-6 py-4 font-mono font-medium text-slate-600">${row.id}</td>
              <td class="px-6 py-4 font-mono text-slate-600 group-[.blind-mode-active]:hidden">${row.randomId}</td>
              <td class="px-6 py-4 font-mono text-slate-600 group-[.blind-mode-active]:hidden">${drugIdDisplay}</td>
              <td class="px-6 py-4 font-semibold text-slate-800">${row.name}</td>
              <td class="px-6 py-4 text-slate-600">${row.age}</td>
              <td class="px-6 py-4 text-slate-600">${row.indicator}</td>
              <td class="px-6 py-4 group-[.blind-mode-active]:hidden">${groupContent}</td>
              <td class="px-6 py-4 group-[.blind-mode-active]:hidden">
                  <div class="flex gap-1 flex-wrap">${tagsContent || '--'}</div>
              </td>
              <td class="px-6 py-4 font-medium text-slate-600">${row.doctor || '--'}</td>
              ${fissionStatusCell}
              <td class="px-6 py-4 text-right">${actionButtons}</td>
            </tr>
        `;
    });

    tbodyHtml += '</tbody>';

    tableContainer.innerHTML = theadHtml + tbodyHtml;
}

// 同步排除开关 UI
document.addEventListener('change', function(e){
  if (e.target && e.target.id === 'enroll-exclusion-switch') {
    const knob = document.getElementById('enroll-exclusion-knob');
    knob.style.transform = e.target.checked ? 'translateX(22px)' : 'translateX(0px)';
  }
});

/* ================= 分组视图切换逻辑 (普通项目) ================= */

function toggleGroupView(count) {
  const grid = document.getElementById('group-grid');
  const targetGroup = document.getElementById('group-target');

  if (count === 3) {
    // Switch to 3 columns
    grid.classList.remove('md:grid-cols-2');
    grid.classList.add('md:grid-cols-3');

    // Show 3rd group
    targetGroup.classList.remove('hidden');
  } else {
    // Switch to 2 columns
    grid.classList.remove('md:grid-cols-3');
    grid.classList.add('md:grid-cols-2');

    // Hide 3rd group
    targetGroup.classList.add('hidden');
  }
}

/* ================= 裂变视图切换逻辑 (裂变项目) ================= */

let isFissionExpanded = false;

function toggleFissionGroupView() {
  const grid = document.getElementById('group-grid');
  const parentCtrl = document.getElementById('fission-group-ctrl-parent');
  const sub1 = document.getElementById('fission-group-ctrl-sub1');
  const sub2 = document.getElementById('fission-group-ctrl-sub2');
  const toggleText = document.getElementById('fission-toggle-text');
  const expDetails = document.getElementById('factor-details-fission-exp-container');

  isFissionExpanded = !isFissionExpanded;

  if (isFissionExpanded) {
    // 切换到裂变视图 (3列：强化干预 + 子组1 + 子组2)
    grid.classList.remove('md:grid-cols-2');
    grid.classList.add('md:grid-cols-3');

    parentCtrl.classList.add('hidden');
    sub1.classList.remove('hidden');
    sub2.classList.remove('hidden');
    
    // 隐藏强化干预组的因子详情
    if (expDetails) expDetails.classList.add('hidden');

    toggleText.innerText = "切换回原始视图";
  } else {
    // 切换回原始视图 (2列：强化干预 + 对照组)
    grid.classList.remove('md:grid-cols-3');
    grid.classList.add('md:grid-cols-2');

    parentCtrl.classList.remove('hidden');
    sub1.classList.add('hidden');
    sub2.classList.add('hidden');
    
    // 显示强化干预组的因子详情
    if (expDetails) expDetails.classList.remove('hidden');

    toggleText.innerText = "切换裂变视图";
  }
}

// 暴露给 layout.js 重置状态用
function resetFissionGroupView() {
  isFissionExpanded = true; // 先设为 true, 让 toggle 变成 false
  toggleFissionGroupView(); // 触发一次 toggle 回到 false 状态
  
  // 确保重置时详情是显示的
  const expDetails = document.getElementById('factor-details-fission-exp-container');
  if (expDetails) expDetails.classList.remove('hidden');
}

/* ================= 因子详情展开逻辑 ================= */
function toggleFactorDetails(id) {
  const details = document.getElementById('details-' + id);
  const icon = document.getElementById('icon-' + id);
  
  if (details.classList.contains('hidden')) {
    details.classList.remove('hidden');
    details.classList.add('fade-in');
    icon.classList.add('rotate-180');
  } else {
    details.classList.add('hidden');
    details.classList.remove('fade-in');
    icon.classList.remove('rotate-180');
  }
}

function toggleCriteria(type) {
  const content = document.getElementById(type === 'inclusion' ? 'criteria-inclusion' : 'criteria-exclusion');
  const icon = document.getElementById(type === 'inclusion' ? 'icon-criteria-inclusion' : 'icon-criteria-exclusion');
  const trigger = icon.parentElement;
  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden');
    icon.classList.remove('rotate-180');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  } else {
    content.classList.add('hidden');
    icon.classList.add('rotate-180');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }
}

function toggleCriteriaPanel() {
  const panel = document.getElementById('criteria-panel');
  const icon = document.getElementById('icon-criteria-panel');
  const trigger = icon.parentElement;
  if (panel.classList.contains('hidden')) {
    panel.classList.remove('hidden');
    icon.classList.add('rotate-180');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  } else {
    panel.classList.add('hidden');
    icon.classList.remove('rotate-180');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }
}

// 右上角标签枚举与交互
const RIBBON_ENUM = {
  general: { text: '通用', bg: 'bg-indigo-600' },
  core: { text: '核心', bg: 'bg-emerald-600' },
  draft: { text: '草稿', bg: 'bg-amber-500' },
  disabled: { text: '禁用', bg: 'bg-red-600' }
};

function toggleBadgeDropdown(id) {
  const dd = document.getElementById('badge-dropdown-' + id);
  dd.classList.toggle('hidden');
}

function selectBadgeStatus(id, key) {
  const conf = RIBBON_ENUM[key] || RIBBON_ENUM.general;
  const textEl = document.getElementById('badge-text-' + id);

  textEl.innerText = conf.text;
  textEl.className = "absolute top-0 right-0 px-3 py-1 text-white text-xs font-bold shadow rounded-tr-xl " + conf.bg;

  const dd = document.getElementById('badge-dropdown-' + id);
  dd.classList.add('hidden');
}

/* ================= 受试者录入逻辑 (Enrollment) ================= */

function openEnrollDrawer() {
  const drawer = document.getElementById('enroll-drawer');
  const backdrop = document.getElementById('enroll-backdrop');
  const panel = document.getElementById('enroll-panel');

  // 显示抽屉容器
  drawer.classList.remove('hidden');
  
  // 延时触发动画 (Transition)
  setTimeout(() => {
    backdrop.classList.remove('opacity-0');
    panel.classList.remove('translate-x-full');
  }, 10);

  // 初始化状态
  resetFormState();
}

function closeEnrollDrawer() {
  const drawer = document.getElementById('enroll-drawer');
  const backdrop = document.getElementById('enroll-backdrop');
  const panel = document.getElementById('enroll-panel');

  backdrop.classList.add('opacity-0');
  panel.classList.add('translate-x-full');

  // 等动画播完再隐藏 DOM
  setTimeout(() => {
    drawer.classList.add('hidden');
  }, 300);
}

// 完成并关闭
function resetAndClose() {
  closeEnrollDrawer();
  // 可以在这里添加刷新列表的逻辑
  // alert("数据已保存至列表");
}

// 模拟匹配逻辑 (支持 random 和 free 两种模式)
function startMatching(mode) {
  // 0. 额外必填校验
  const source = document.getElementById('enroll-source').value;
  const sourceOther = document.getElementById('enroll-source-other');
  const center = document.getElementById('enroll-center').value;
  const doctor = document.getElementById('enroll-doctor').value;
  const consent = document.getElementById('enroll-consent').checked;
  const exclusionChecked = document.getElementById('enroll-exclusion-switch').checked;
  if (!source) { alert("请选择入组来源"); return; }
  if (source === '其他' && sourceOther && !sourceOther.classList.contains('hidden') && !sourceOther.value.trim()) { alert("请填写入组来源说明"); return; }
  if (!center) { alert("请选择录入中心"); return; }
  if (!doctor) { alert("请选择所属医生"); return; }
  if (!consent) { alert("需完成签署知情同意书后才能匹配"); return; }

  // 1. 获取输入值
  const age = parseInt(document.getElementById('input-age').value);
  const myopia = parseFloat(document.getElementById('input-myopia').value);
  // const history = document.querySelector('input[name="history"]:checked').value; 
  // Assuming history logic is handled or inputs exist

  // 简单的校验
  if (!age || isNaN(myopia)) {
    alert("请完整填写年龄和近视度数");
    return;
  }

  // 如果符合排除标准，直接失败，不进入算法
  if (exclusionChecked) {
    document.getElementById('enroll-form').classList.add('hidden');
    document.getElementById('enroll-loading').classList.add('hidden');
    document.getElementById('enroll-result').classList.remove('hidden');
    document.getElementById('result-fail').classList.remove('hidden');
    document.getElementById('fail-reason').innerText = "符合项目排除标准。";
    const btnFinish = document.getElementById('btn-finish');
    btnFinish.innerText = "重新录入";
    btnFinish.classList.remove('hidden', 'bg-emerald-600', 'hover:bg-emerald-700');
    btnFinish.classList.add('bg-slate-600', 'hover:bg-slate-700');
    btnFinish.onclick = function () { resetFormState(); };
    return;
  }

  // 2. 切换 UI 到 Loading 状态
  document.getElementById('enroll-form').classList.add('hidden');
  document.getElementById('enroll-loading').classList.remove('hidden');

  // 隐藏底部所有操作按钮
  document.getElementById('btn-match-random').classList.add('hidden');
  document.getElementById('btn-match-free').classList.add('hidden');

  // 3. 模拟算法延迟
  setTimeout(() => {
    document.getElementById('enroll-loading').classList.add('hidden');
    document.getElementById('enroll-result').classList.remove('hidden');

    // 4. 通用校验逻辑 (入排标准)
    let passed = true;
    let failReason = "";

    if (age < 6 || age > 14) {
      passed = false;
      failReason = `年龄 ${age} 岁不符合纳入标准 [6-14岁]`;
    } else if (myopia > 0 || myopia < -6.00) {
      passed = false;
      failReason = `屈光度 ${myopia}D 超出研究范围 [0.00 ~ -6.00D]`;
    } 
    // else if (history === 'yes') { ... }

    if (!passed) {
      // --- 失败流程 ---
      document.getElementById('result-fail').classList.remove('hidden');
      document.getElementById('fail-reason').innerText = failReason;

      // 显示重置按钮
      const btnFinish = document.getElementById('btn-finish');
      btnFinish.innerText = "重新录入";
      btnFinish.classList.remove('hidden', 'bg-emerald-600', 'hover:bg-emerald-700');
      btnFinish.classList.add('bg-slate-600', 'hover:bg-slate-700');
      btnFinish.onclick = function () { resetFormState(); };
      return;
    }

    // --- 成功流程 ---

    // 计算分层因子 Tag (通用)
    const tagAge = (age <= 7) ? "4-7岁" : (age <= 10 ? "7-10岁" : "10-14岁");
    const tagMyopia = (myopia >= -0.5) ? "-0.50~0.00D" : (myopia >= -1.0 ? "-1.00~-0.50D" : "<-1.00D");

    if (mode === 'random') {
      // === 随机匹配逻辑 ===
      document.getElementById('result-success').classList.remove('hidden');
      document.getElementById('btn-finish').classList.remove('hidden');

      // 随机分配
      const isExperiement = Math.random() > 0.5;
      document.getElementById('res-group-name').innerText = isExperiement ? "实验组 (高频)" : "对照组 (低频)";
      document.getElementById('res-id').innerText = "CHILD_ELE_" + Math.floor(1000 + Math.random() * 9000);

      // 填充 Random 下的 tags
      const tagsHtml = `
                  <div class="flex justify-between"><span>分层因素(年龄):</span><span class="font-medium text-slate-800">${tagAge}</span></div>
                  <div class="flex justify-between"><span>分层因素(度数):</span><span class="font-medium text-slate-800">${tagMyopia}</span></div>
              `;
      document.getElementById('res-tags-container').innerHTML = tagsHtml;

    } else {
      // === 自由匹配逻辑 ===
      document.getElementById('result-selection').classList.remove('hidden');

      // 填充顶部提示 Tag
      document.getElementById('sel-tag-age').innerText = `年龄: ${tagAge}`;
      document.getElementById('sel-tag-myopia').innerText = `度数: ${tagMyopia}`;

      // 重置卡片选中状态
      clearSelectionStyles();

      // 此时不显示“完成”按钮，等待用户点击卡片
    }

  }, 1000); // 1秒动画
}

function toggleSourceOther(val) {
  const el = document.getElementById('enroll-source-other');
  if (!el) return;
  if (val === '其他') el.classList.remove('hidden');
  else el.classList.add('hidden');
}

function updateEnrollDoctors() {
  const center = document.getElementById('enroll-center').value;
  const doctorSel = document.getElementById('enroll-doctor');
  doctorSel.innerHTML = '';
  if (!center) {
    doctorSel.disabled = true;
    doctorSel.innerHTML = `<option value="" selected>请先选择录入中心</option>`;
    return;
  }
  const list = (DOCTOR_DATA && DOCTOR_DATA[center]) || [];
  list.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    doctorSel.appendChild(opt);
  });
  doctorSel.disabled = false;
}

function toggleConsent() {
  const checked = document.getElementById('enroll-consent').checked;
  const freeBtn = document.getElementById('btn-match-free');
  const randBtn = document.getElementById('btn-match-random');
  [freeBtn, randBtn].forEach(btn => {
    if (!btn) return;
    btn.disabled = !checked;
    btn.classList.toggle('opacity-50', !checked);
    btn.classList.toggle('cursor-not-allowed', !checked);
  });
}

// 自由模式：点击卡片选择组别
function selectGroupOption(group) {
  // 1. 清除旧样式
  clearSelectionStyles();

  // 2. 选中当前样式
  const card = document.getElementById(`card-${group}`);
  const dot = card.querySelector('.selection-dot');

  // 样式变化: 边框变色, 背景微变, 圆点显示
  if (group === 'exp') {
    card.classList.add('border-indigo-500', 'bg-indigo-50', 'ring-1', 'ring-indigo-500');
    card.classList.remove('border-slate-200');
  } else {
    card.classList.add('border-emerald-500', 'bg-emerald-50', 'ring-1', 'ring-emerald-500');
    card.classList.remove('border-slate-200');
  }
  dot.classList.remove('opacity-0');

  // 3. 显示底部完成按钮
  const btnFinish = document.getElementById('btn-finish');
  btnFinish.innerText = "确认分配并录入下一个";
  btnFinish.classList.remove('hidden', 'bg-slate-600', 'hover:bg-slate-700');
  btnFinish.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
  btnFinish.onclick = resetAndClose;
}

// 辅助：清除所有卡片选中态
function clearSelectionStyles() {
  ['exp', 'ctrl'].forEach(g => {
    const card = document.getElementById(`card-${g}`);
    const dot = card.querySelector('.selection-dot');

    // 恢复默认
    card.className = "group cursor-pointer bg-white border-2 border-slate-200 rounded-xl p-4 transition-all relative hover:border-gray-300";
    // 重新加上 hover 颜色
    if (g === 'exp') card.classList.add('hover:border-indigo-300');
    else card.classList.add('hover:border-emerald-300');

    dot.classList.add('opacity-0');
  });
}

function resetFormState() {
  // UI 显示重置
  document.getElementById('enroll-form').classList.remove('hidden');
  document.getElementById('enroll-loading').classList.add('hidden');
  document.getElementById('enroll-result').classList.add('hidden');

  document.getElementById('result-success').classList.add('hidden');
  document.getElementById('result-fail').classList.add('hidden');
  document.getElementById('result-selection').classList.add('hidden');

  // 按钮重置
  document.getElementById('btn-match-random').classList.remove('hidden');
  document.getElementById('btn-match-free').classList.remove('hidden');
  document.getElementById('btn-finish').classList.add('hidden');

  // 清空表单
  document.getElementById('enroll-form').reset();
  // 新增字段和禁用状态复位
  const srcOther = document.getElementById('enroll-source-other');
  if (srcOther) { srcOther.value = ''; srcOther.classList.add('hidden'); }
  const doctorSel = document.getElementById('enroll-doctor');
  if (doctorSel) {
    doctorSel.innerHTML = `<option value="" selected>请先选择录入中心</option>`;
    doctorSel.disabled = true;
  }
  const consentEl = document.getElementById('enroll-consent');
  if (consentEl) { consentEl.checked = false; }
  const freeBtn = document.getElementById('btn-match-free');
  const randBtn = document.getElementById('btn-match-random');
  if (freeBtn && randBtn) {
    freeBtn.disabled = true; freeBtn.classList.add('opacity-50','cursor-not-allowed');
    randBtn.disabled = true; randBtn.classList.add('opacity-50','cursor-not-allowed');
  }
  const excl = document.getElementById('enroll-exclusion-switch');
  const knob = document.getElementById('enroll-exclusion-knob');
  if (excl && knob) { excl.checked = false; knob.style.transform = 'translateX(0px)'; }
}

// 计算年龄
function calculateAge() {
    const dobInput = document.getElementById('input-dob').value;
    const ageInput = document.getElementById('input-age');
    
    if (!dobInput) {
        ageInput.value = '';
        return;
    }

    const dob = new Date(dobInput);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    
    ageInput.value = age;
}

// 切换多行文本框显示
function toggleTextArea(type, show) {
    const el = document.getElementById('desc-' + type);
    if (show) {
        el.classList.remove('hidden');
    } else {
        el.classList.add('hidden');
    }
}

/* ================= Fission Modal Logic ================= */

let currentFissionId = null;

function openFissionModal(id, name) {
    currentFissionId = id;
    const modal = document.getElementById('fission-modal');
    const backdrop = document.getElementById('fission-backdrop');
    const panel = document.getElementById('fission-panel');
    
    // Set user info
    document.getElementById('fission-user-name').innerText = name;
    document.getElementById('fission-user-id').innerText = id;

    // Reset UI State
    document.getElementById('fission-msg-warning').classList.remove('hidden');
    document.getElementById('fission-msg-success').classList.add('hidden');
    document.getElementById('fission-group-label').innerText = "当前分组";
    
    // Reset Group Display
    const groupDisplay = document.getElementById('fission-group-display');
    const row = project2Data.find(r => r.id === id);
    if (row) {
        if (isBlindMode) {
            groupDisplay.innerText = "***";
        } else {
            groupDisplay.innerText = row.group;
        }
        groupDisplay.className = "text-sm font-bold text-emerald-600 transition-colors";
    }

    const btn = document.getElementById('btn-confirm-fission');
    btn.disabled = false;
    btn.innerText = "确认并执行裂变";
    btn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
    btn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
    btn.onclick = confirmFission; // Reset onclick handler
    
    // Show Modal
    modal.classList.remove('hidden');
    setTimeout(() => {
        backdrop.classList.remove('opacity-0');
        panel.classList.remove('opacity-0', 'translate-y-4', 'sm:translate-y-0', 'sm:scale-95');
    }, 10);
}

function closeFissionModal() {
    const modal = document.getElementById('fission-modal');
    const backdrop = document.getElementById('fission-backdrop');
    const panel = document.getElementById('fission-panel');
    
    backdrop.classList.add('opacity-0');
    panel.classList.add('opacity-0', 'translate-y-4', 'sm:translate-y-0', 'sm:scale-95');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function confirmFission() {
    const btn = document.getElementById('btn-confirm-fission');
    
    // 1. Button Loading State
    btn.disabled = true;
    btn.innerHTML = `<i class="ri-loader-4-line animate-spin mr-1"></i> 分配中...`;

    // 2. No other status area to hide/show, just wait
    
    setTimeout(() => {
        // Update Data (Mock)
        const row = project2Data.find(r => r.id === currentFissionId);
        if (row) {
            row.isFissioned = true;
            row.stage = 'Stage 2';
            row.drugId = row.drugId_stage2; // Update displayed ID
            
            // Determine New Group Name
            let newGroupName = row.group;
            if (row.group === '对照组') {
                newGroupName = '对照组：裂变子组1';
                row.subGroup = newGroupName;
            } else {
                newGroupName = row.group + ' (Stage 2)';
            }

            // 3. Update UI to Success State
            // Update Group Display
            const groupDisplay = document.getElementById('fission-group-display');
            document.getElementById('fission-group-label').innerText = "当前分组";
            
            if (isBlindMode) {
                groupDisplay.innerText = "***";
            } else {
                groupDisplay.innerText = newGroupName;
            }
            
            groupDisplay.className = "text-sm font-bold text-indigo-600 transition-colors";

            // Hide Warning, Show Success Msg
            document.getElementById('fission-msg-warning').classList.add('hidden');
            const successMsg = document.getElementById('fission-msg-success');
            successMsg.classList.remove('hidden');
            
            // Set Drug IDs
            document.getElementById('fission-drug-old').innerText = row.drugId_stage1 || 'Old';
            document.getElementById('fission-drug-new').innerText = row.drugId_stage2;
        }

        // 4. Update Button to "Complete" state
        btn.disabled = false;
        btn.innerHTML = `<i class="ri-check-double-line mr-1"></i> 完成`;
        btn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
        btn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
        
        // Change button action to close and refresh
        btn.onclick = () => {
            closeFissionModal();
            renderTable();
        };
        
    }, 1500);
}

/* ================= Process Enroll Modal Logic ================= */

function openProcessEnrollDrawer(name, doctor, age, indicator) {
    const modal = document.getElementById('process-enroll-modal');
    const backdrop = document.getElementById('process-enroll-backdrop');
    const panel = document.getElementById('process-enroll-panel');
    
    // Fill Data
    document.getElementById('pe-name').innerText = name;
    document.getElementById('pe-avatar').innerText = name.charAt(0);
    document.getElementById('pe-doctor').innerText = doctor;
    document.getElementById('pe-age').innerText = age;
    document.getElementById('pe-indicator').innerText = indicator;
    
    // Reset Reject Area
    const rejectContainer = document.getElementById('reject-reason-container');
    if (rejectContainer) rejectContainer.classList.add('hidden');
    const rejectText = document.getElementById('reject-reason-text');
    if (rejectText) rejectText.value = '';
    
    // Show Modal
    modal.classList.remove('hidden');
    setTimeout(() => {
        backdrop.classList.remove('opacity-0');
        panel.classList.remove('opacity-0', 'translate-y-4', 'sm:translate-y-0', 'sm:scale-95');
    }, 10);
}

function closeProcessEnrollDrawer() {
    const modal = document.getElementById('process-enroll-modal');
    const backdrop = document.getElementById('process-enroll-backdrop');
    const panel = document.getElementById('process-enroll-panel');
    
    backdrop.classList.add('opacity-0');
    panel.classList.add('opacity-0', 'translate-y-4', 'sm:translate-y-0', 'sm:scale-95');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function confirmProcessEnroll() {
    alert("已确认预约并锁定名额，分配筛选号！");
    closeProcessEnrollDrawer();
}

function quickEnrollProcess() {
    closeProcessEnrollDrawer();
    
    // Simulate delay for smooth transition
    setTimeout(() => {
        openEnrollDrawer();
        
        // Fill with current processing data
        const name = document.getElementById('pe-name').innerText;
        const age = document.getElementById('pe-age').innerText.replace('岁', '');
        const indicator = document.getElementById('pe-indicator').innerText.replace('D', '');
        
        const nameInput = document.getElementById('input-name');
        if (nameInput) nameInput.value = name;
        const ageInput = document.getElementById('input-age');
        if (ageInput) ageInput.value = age;
        const myopiaInput = document.getElementById('input-myopia');
        if (myopiaInput) myopiaInput.value = indicator;
        
        alert("已转入正式录入流程，请补全剩余信息。");
    }, 350);
}

function toggleRejectReason() {
    const container = document.getElementById('reject-reason-container');
    if (container) container.classList.toggle('hidden');
}

function submitRejectProcess() {
    const reasonText = document.getElementById('reject-reason-text');
    const reason = reasonText ? reasonText.value : '';
    
    if (!reason.trim()) {
        alert("请填写无法入组的原因");
        return;
    }
    
    alert(`已拒绝入组。\n原因：${reason}\n已通知推荐医生，分配筛选号。`);
    closeProcessEnrollDrawer();
}

/* ================= CRC Task Notification Logic ================= */

function handleCRCTaskNotification(taskId) {
    // 1. Close Notification Drawer
    closeNotificationDrawer();
    
    // 2. Navigate to Project Detail (Mock navigation)
    // In a real app, this would route to the specific project. 
    // Here we assume we are already on or navigating to the project detail view.
    switchTab('project-detail');
    
    // 3. Open Enroll Drawer
    openEnrollDrawer();
    
    // 4. Pre-fill Data (Mock Data based on task ID)
    // Assuming task 102 corresponds to Wang Fang
    if (taskId === '102') {
        document.getElementById('enroll-source').value = '门诊'; // Mock source
        
        // Fill Patient Info
        document.getElementById('input-name').value = '王芳'; // Mock name
        document.getElementById('input-gender').value = 'female'; // Mock gender
        document.getElementById('input-phone').value = '13912346789'; // Mock phone
        document.getElementById('input-age').value = '9'; // Mock age
        document.getElementById('input-myopia').value = '-1.25'; // Mock myopia
        
        // Pre-select Doctor (Simulate selection)
        // Note: In a real scenario, we need to ensure options are loaded first.
        // For this demo, we might need a timeout or direct manipulation if options exist.
        const centerSelect = document.getElementById('enroll-center');
        if (centerSelect) {
             centerSelect.value = 'center_sh'; // Mock Center: Shanghai
             updateEnrollDoctors(); // Trigger doctor list update
             
             // Wait for doctor list to populate
             setTimeout(() => {
                 const doctorSelect = document.getElementById('enroll-doctor');
                 if (doctorSelect) doctorSelect.value = '李医生';
             }, 100);
        }
        
        // Simulate 'Other' fields if necessary (not needed for this case)
        
        // Show a toast or message indicating data pre-filled
        // alert("已自动填入待处理患者信息"); // Optional
    }
}

/* ================= Blind Mode Toggle ================= */
let isBlindMode = false;

function toggleBlindMode() {
    isBlindMode = !isBlindMode;
    const wrapper = document.getElementById('data-table-wrapper');
    const btnIcon = document.querySelector('#blind-toggle-btn i');
    const btnText = document.querySelector('#blind-toggle-btn span');
    
    // Toggle Group/Drug Info in Overview Panel
    const overviewContainer = document.querySelector('#view-project-detail .bg-white.rounded-2xl.px-10.py-12'); // Select the top card
    
    // Toggle Group Info in Group Grid
    const expInfo = document.getElementById('exp-group-info');
    const ctrlInfo = document.getElementById('ctrl-group-info');

    if (isBlindMode) {
        // Enable Blind Mode
        
        // 1. Table Columns
        wrapper.classList.add('blind-mode-active');
        
        // 2. Button State
        btnIcon.classList.remove('ri-eye-line');
        btnIcon.classList.add('ri-eye-off-line');
        btnText.innerText = "退出盲态";

        // 3. Hide Info in Overview
        if (overviewContainer) {
            overviewContainer.classList.add('blind-mode-active');
        }

        // 4. Mask Group Info
        if (expInfo) {
            expInfo.setAttribute('data-original', expInfo.innerHTML);
            expInfo.innerHTML = `
                <h4 class="font-bold text-slate-800">***</h4>
                <p class="text-xs text-slate-500">***</p>
            `;
        }
        if (ctrlInfo) {
            ctrlInfo.setAttribute('data-original', ctrlInfo.innerHTML);
            ctrlInfo.innerHTML = `
                <h4 class="font-bold text-slate-800">***</h4>
                <p class="text-xs text-slate-500">***</p>
            `;
        }

    } else {
        // Disable Blind Mode
        
        // 1. Table Columns
        wrapper.classList.remove('blind-mode-active');
        
        // 2. Button State
        btnIcon.classList.remove('ri-eye-off-line');
        btnIcon.classList.add('ri-eye-line');
        btnText.innerText = "盲态切换";

        // 3. Show Info in Overview
        if (overviewContainer) {
            overviewContainer.classList.remove('blind-mode-active');
        }

        // 4. Restore Group Info
        if (expInfo && expInfo.hasAttribute('data-original')) {
            expInfo.innerHTML = expInfo.getAttribute('data-original');
        }
        if (ctrlInfo && ctrlInfo.hasAttribute('data-original')) {
            ctrlInfo.innerHTML = ctrlInfo.getAttribute('data-original');
        }
    }
}
