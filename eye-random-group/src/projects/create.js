
// src/projects/create.js

// Wizard State
let currentWizStep = 1;
let WIZ_FACTORS = [];
let isFissionMode = false;
let fissionRules = {}; // { groupId: { trigger: 'manual', threshold: 180, strategy: 'simple', subgroups: [{name:'B1', ratio:50}, {name:'B2', ratio:50}] } }

// Blind Config Data
const BLIND_CONFIG_DATA = [
    {
        title: "项目简介",
        items: [
            { id: "blind-code", label: "项目码", checked: false },
            { id: "blind-leader", label: "负责人", checked: false },
            { id: "blind-doctors", label: "协作医生", checked: false },
            { id: "blind-crc", label: "CRC和关联中心", checked: false },
            { id: "blind-criteria", label: "纳入标准和排除标准", checked: false }
        ]
    },
    {
        title: "分组与维度概览",
        items: [
            { id: "blind-group-info", label: "组别信息", checked: true, disabled: true }, // 默认选中且不可取消
            { id: "blind-enroll-count", label: "入组人数", checked: false },
            { id: "blind-dimension-info", label: "维度信息", checked: false },
            { id: "blind-factor-detail", label: "因子详情", checked: false }
        ]
    },
    {
        title: "受试者详细名录",
        items: [
            { id: "blind-screen-id", label: "筛选号", checked: true, disabled: false }, // 默认选中
            { id: "blind-subject-id", label: "受试者编号", checked: true, disabled: false }, // 默认选中
            { id: "blind-random-id", label: "随机号", checked: false },
            { id: "blind-indicator", label: "维度指标", checked: false },
            { id: "blind-subject-group", label: "分组", checked: true, disabled: true }, // 默认选中且不可取消
            { id: "blind-tags", label: "维度标签", checked: false },
            { id: "blind-stage", label: "阶段", checked: false }
        ]
    }
];

// Entry Point
function openNewProjectWizard() {
  // Permission check
  const allowedRoles = ['dev', 'admin', 'center_admin'];
  if (typeof currentUserRole !== 'undefined' && !allowedRoles.includes(currentUserRole)) {
      alert("您没有权限创建项目");
      return;
  }

  // Update Header to "创建项目"
  updateHeader({
      title: "创建项目",
      permissions: [
          { text: "开发者账户", color: "indigo" },
          { text: "超级管理员", color: "purple" },
          { text: "中心管理员", color: "emerald" }
      ]
  });

  // Hide View Projects
  document.getElementById('view-projects').classList.add('hidden');
  // Show Wizard
  const wiz = document.getElementById('create-project-wizard');
  wiz.classList.remove('hidden');
  // Ensure flex layout is active (in case it was removed)
  if (!wiz.classList.contains('flex')) wiz.classList.add('flex');
  
  wizReset();
  wizGoToStep(1);
}

function cancelWizard() {
  // Hide Wizard
  const wiz = document.getElementById('create-project-wizard');
  wiz.classList.add('hidden');
  // Remove flex to avoid CSS conflict if 'flex' overrides 'hidden'
  wiz.classList.remove('flex');

  // Show View Projects
  document.getElementById('view-projects').classList.remove('hidden');

  // Restore Header to "项目管理"
  if (typeof routeConfig !== 'undefined' && routeConfig.projects) {
      updateHeader(routeConfig.projects);
  }
}

function wizReset() {
  // Step 1 Reset (Auto-fill for testing)
  document.getElementById('wiz-np-name').value = '儿童近视防控临床研究';
  document.getElementById('wiz-np-code').value = 'CODE_2024';
  document.getElementById('wiz-np-desc').value = '这是一个用于测试的默认项目描述。';

  // Reset doctors first
  wizDisableDoctorSelectors();
  
  // Default Center
  const defaultCenter = "徐州眼视光中心";
  document.querySelectorAll('#wiz-center-dropdown input').forEach(el => el.checked = (el.value === defaultCenter));
  wizUpdateCenterDisplay();

  // Default Leader & CRC
  wizSelectLeader("王强", defaultCenter);
  wizToggleCrc("张玲", defaultCenter);

  // Default Share
  document.getElementById('wiz-np-share-switch').checked = true;
  wizToggleShareSwitch();
  
  // Reset Blind Switch
  document.getElementById('wiz-np-blind-switch').checked = false;
  wizToggleBlindSwitch();

  // Default Criteria
  document.getElementById('wiz-inclusion-list').innerHTML = `
    <div class="flex items-center gap-2 animate-fade-in">
        <input type="text" class="flex-1 rounded-lg border bg-emerald-50 border-emerald-300 focus:border-emerald-500 px-3 py-2.5 text-sm transition-colors" value="年龄 6-12 岁" placeholder="请输入纳入标准">
        <button type="button" class="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" onclick="this.parentElement.remove()"><i class="ri-delete-bin-line"></i></button>
    </div>`;
  document.getElementById('wiz-exclusion-list').innerHTML = `
    <div class="flex items-center gap-2 animate-fade-in">
        <input type="text" class="flex-1 rounded-lg border bg-red-50 border-red-300 focus:border-red-500 px-3 py-2.5 text-sm transition-colors" value="有其他眼部疾病" placeholder="请输入排除标准">
        <button type="button" class="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" onclick="this.parentElement.remove()"><i class="ri-delete-bin-line"></i></button>
    </div>`;
  
  // Step 2 Reset
  document.querySelector('input[name="wizMatchMode"][value="random"]').checked = true;
  document.querySelectorAll('input[name="wizDims"]').forEach(el => el.checked = false);
  document.getElementById('wiz-dims-config-container').innerHTML = '';
  wizToggleMatchMode();

  // Step 3 Reset
  document.getElementById('wiz-fission-toggle').checked = false;
  isFissionMode = false;
  fissionRules = {};
  wizToggleFissionMode(); // Reset UI
  
  wizInitDefaultGroups();
}

function wizGoToStep(step) {
  if (step < 1 || step > 3) return;
  
  // Validation when moving forward
  if (step > currentWizStep) {
     if (currentWizStep === 1) {
         const name = document.getElementById('wiz-np-name').value.trim();
         const code = document.getElementById('wiz-np-code').value.trim();
         if (!name) { alert("请填写项目名称"); return; }
         if (!code) { alert("请填写项目编码"); return; }
         if (SELECTED_CENTERS.length === 0) { alert("请至少选择一个研究中心"); return; }
         if (!leaderSelected) { alert("请选择项目负责人"); return; }
         if (crcSelected.size === 0) { alert("请至少选择一位 CRC"); return; }
     }
     // Step 2 validation (dimensions)
     if (currentWizStep === 2) {
         const checkedDims = document.querySelectorAll('input[name="wizDims"]:checked');
         if (checkedDims.length === 0) { alert("请至少选择一个分层维度"); return; }
         
         // Initialize Step 3 data when leaving Step 2
         wizInitDefaultGroups();
     }
  }

  currentWizStep = step;

  // Update Header Indicators
  for (let i = 1; i <= 3; i++) {
      const ind = document.getElementById(`wiz-step-indicator-${i}`);
      const bar = document.getElementById(`wiz-step-bar-${i}`); // i is bar index? No, bars are 1 and 2.
      const title = document.getElementById(`wiz-step-title-${i}`);
      
      if (i === step) {
         // Active
         ind.className = "w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-brand-500/30 transition-all ring-4 ring-brand-50 transform scale-110";
         title.className = "text-sm font-bold text-slate-800";
      } else if (i < step) {
         // Completed
         ind.className = "w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-md transition-all ring-4 ring-white";
         ind.innerHTML = '<i class="ri-check-line"></i>';
         title.className = "text-sm font-bold text-slate-800";
      } else {
         // Inactive
         ind.className = "w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-lg transition-all ring-4 ring-white";
         ind.innerHTML = i;
         title.className = "text-sm font-bold text-slate-500";
      }
  }

  // Update Bars
  if (step >= 2) document.getElementById('wiz-step-bar-1').classList.remove('w-0');
  else document.getElementById('wiz-step-bar-1').classList.add('w-0');
  
  if (step >= 3) document.getElementById('wiz-step-bar-1').classList.remove('w-0'); // Bar 1 also filled
  if (step >= 3) document.getElementById('wiz-step-bar-2').classList.remove('w-0');
  else document.getElementById('wiz-step-bar-2').classList.add('w-0');


  // Update Content Visibility
  for (let i = 1; i <= 3; i++) {
      const content = document.getElementById(`wiz-step-content-${i}`);
      if (i === step) {
          content.classList.remove('hidden');
      } else {
          content.classList.add('hidden');
      }
  }

  // Update Footer Buttons
  const btnPrev = document.getElementById('wiz-btn-prev');
  const btnNext = document.getElementById('wiz-btn-next');

  if (step === 1) {
      btnPrev.classList.add('hidden');
      btnNext.innerHTML = '下一步 <i class="ri-arrow-right-line"></i>';
      btnNext.onclick = wizNext;
  } else if (step === 2) {
      btnPrev.classList.remove('hidden');
      btnNext.innerHTML = '下一步 <i class="ri-arrow-right-line"></i>';
      btnNext.onclick = wizNext;
  } else if (step === 3) {
      btnPrev.classList.remove('hidden');
      btnNext.innerHTML = '<i class="ri-check-double-line mr-1"></i> 完成创建';
      btnNext.onclick = wizCreateProject;
  }
}

function wizNext() {
   wizGoToStep(currentWizStep + 1);
}

function wizPrev() {
   wizGoToStep(currentWizStep - 1);
}

function wizCreateProject() {
    // Validation for Step 3
    const total = parseInt(document.getElementById('wiz-total-count').value) || 0;
    const inputs = document.querySelectorAll('.wiz-group-total-input');
    let sum = 0;
    inputs.forEach(input => sum += (parseInt(input.value) || 0));
    
    if (sum !== total) {
        alert(`分组人数之和 (${sum}) 不等于项目总人数 (${total})，请调整。`);
        return;
    }

    // Collect Medicine Data
    const groupsData = [];
    document.querySelectorAll('.wiz-group-card').forEach(card => {
         // Assuming first text input is name, drug input has specific class
         const nameInput = card.querySelector('input[type="text"]'); 
         const drugInput = card.querySelector('.wiz-group-drug-input');
         const countInput = card.querySelector('.wiz-group-total-input');
         
         if (nameInput && drugInput && countInput) {
             groupsData.push({ 
                 id: card.id,
                 name: nameInput.value, 
                 medicine: drugInput.value, 
                 count: countInput.value 
             });
         }
    });
    console.log("New Project Groups Data:", groupsData);
    
    if (isFissionMode) {
        console.log("Fission Rules:", fissionRules);
    }

    // Success
    alert("项目创建成功！" + (isFissionMode ? " (含裂变配置)" : ""));
    cancelWizard();
}

/* ================= Wizard Step 1 Logic ================= */
function wizToggleShareSwitch() {
    const isChecked = document.getElementById('wiz-np-share-switch').checked;
    const label = document.getElementById('wiz-np-share-label');
    
    if (isChecked) {
        label.innerText = '共享';
        label.classList.remove('text-slate-500');
        label.classList.add('text-brand-600');
    } else {
        label.innerText = '不共享';
        label.classList.remove('text-brand-600');
        label.classList.add('text-slate-500');
    }
    
    document.querySelector('input[name="wiz-np-share"][value="yes"]').checked = isChecked;
    document.querySelector('input[name="wiz-np-share"][value="no"]').checked = !isChecked;
}

function wizToggleBlindSwitch() {
    const isChecked = document.getElementById('wiz-np-blind-switch').checked;
    const label = document.getElementById('wiz-np-blind-label');
    const configBtn = document.getElementById('wiz-blind-config-btn');
    
    if (isChecked) {
        label.innerText = '开启';
        label.classList.remove('text-slate-500');
        label.classList.add('text-brand-600');
        configBtn.classList.remove('hidden');
    } else {
        label.innerText = '不开启';
        label.classList.remove('text-brand-600');
        label.classList.add('text-slate-500');
        configBtn.classList.add('hidden');
    }
}

/* ================= Blind Config Drawer Logic ================= */

function wizOpenBlindConfig() {
    const drawer = document.getElementById('wiz-blind-drawer');
    const panel = document.getElementById('wiz-blind-panel');
    
    drawer.classList.remove('hidden');
    wizRenderBlindConfig();
    
    setTimeout(() => {
        panel.classList.remove('translate-x-full');
    }, 10);
}

function wizCloseBlindConfig() {
    const drawer = document.getElementById('wiz-blind-drawer');
    const panel = document.getElementById('wiz-blind-panel');
    
    panel.classList.add('translate-x-full');
    
    setTimeout(() => {
        drawer.classList.add('hidden');
    }, 300);
}

function wizRenderBlindConfig() {
    const container = document.getElementById('wiz-blind-config-list');
    container.innerHTML = '';
    
    BLIND_CONFIG_DATA.forEach(category => {
        const catDiv = document.createElement('div');
        catDiv.className = "space-y-3";
        
        let itemsHtml = '';
        category.items.forEach(item => {
            const isChecked = item.checked ? 'checked' : '';
            const isDisabled = item.disabled ? 'disabled' : '';
            const opacity = item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50';
            const badge = item.disabled ? '<span class="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold ml-2">必选</span>' : '';
            
            itemsHtml += `
                <label class="flex items-center justify-between p-3 border border-slate-200 rounded-lg ${opacity}">
                    <div class="flex items-center">
                        <span class="text-sm text-slate-700 font-medium">${item.label}</span>
                        ${badge}
                    </div>
                    <input type="checkbox" data-id="${item.id}" ${isChecked} ${isDisabled} class="rounded text-brand-600 border-slate-300 focus:ring-brand-500 w-5 h-5 transition-colors">
                </label>
            `;
        });
        
        catDiv.innerHTML = `
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">${category.title}</h4>
            <div class="space-y-2">
                ${itemsHtml}
            </div>
        `;
        
        container.appendChild(catDiv);
    });
}

function wizSaveBlindConfig() {
    // In a real app, we would collect the checked states and save them
    // For now, we just close the drawer and show a success message
    // We can update the BLIND_CONFIG_DATA based on user input for persistence within session
    
    BLIND_CONFIG_DATA.forEach(category => {
        category.items.forEach(item => {
            // Skip disabled items as they are fixed
            if (!item.disabled) {
                const checkbox = document.querySelector(`input[data-id="${item.id}"]`);
                if (checkbox) {
                    item.checked = checkbox.checked;
                }
            }
        });
    });
    
    alert("盲态隐藏配置已保存");
    wizCloseBlindConfig();
}

function wizToggleCenterSelect() {
    document.getElementById('wiz-center-dropdown').classList.toggle('hidden');
}

function wizUpdateCenterDisplay() {
  const checked = Array.from(document.querySelectorAll('#wiz-center-dropdown input:checked')).map(el => el.value);
  const displaySpan = document.getElementById('wiz-center-display-text');

  if (checked.length === 0) {
    displaySpan.innerText = "请选择参与中心...";
    displaySpan.classList.add('text-slate-500');
    displaySpan.classList.remove('text-slate-800');
    SELECTED_CENTERS = [];
    wizDisableDoctorSelectors();
  } else {
    displaySpan.innerText = `已选择 ${checked.length} 个中心`;
    displaySpan.classList.remove('text-slate-500');
    displaySpan.classList.add('text-slate-800');
    SELECTED_CENTERS = checked;
    wizEnableDoctorSelectors();
    wizRenderDoctorOptions();
  }
}

function wizDisableDoctorSelectors() {
    const triggers = ['wiz-leader-trigger', 'wiz-collab-trigger', 'wiz-crc-trigger'];
    triggers.forEach(id => {
        const el = document.getElementById(id);
        el.classList.add('pointer-events-none', 'opacity-50');
    });
    document.getElementById('wiz-leader-display').innerText = '需先选中心';
    document.getElementById('wiz-collab-display').innerText = '需先选中心';
    document.getElementById('wiz-crc-display').innerText = '需先选中心';
    leaderSelected = null;
    collabSelected = new Set();
    crcSelected = new Set();
}

function wizEnableDoctorSelectors() {
    const triggers = ['wiz-leader-trigger', 'wiz-collab-trigger', 'wiz-crc-trigger'];
    triggers.forEach(id => {
        const el = document.getElementById(id);
        el.classList.remove('pointer-events-none', 'opacity-50');
    });
    // Reset text if it was "Need to select..."
    if (document.getElementById('wiz-leader-display').innerText === '需先选中心') {
         document.getElementById('wiz-leader-display').innerText = '请选择负责人...';
    }
    if (document.getElementById('wiz-collab-display').innerText === '需先选中心') {
         document.getElementById('wiz-collab-display').innerText = '请选择协作医生...';
    }
    if (document.getElementById('wiz-crc-display').innerText === '需先选中心') {
         document.getElementById('wiz-crc-display').innerText = '请选择 CRC...';
    }
}

function wizRenderDoctorOptions() {
  // Reusing GLOBAL DATA: DOCTOR_DATA, CRC_DATA
  const leaderDD = document.getElementById('wiz-leader-dropdown');
  const collabDD = document.getElementById('wiz-collab-dropdown');
  const crcDD = document.getElementById('wiz-crc-dropdown');
  
  let leaderHtml = '';
  let collabHtml = '';
  let crcHtml = '';

  SELECTED_CENTERS.forEach(center => {
    (DOCTOR_DATA[center] || []).forEach(name => {
      const id = `${center}-${name}`;
      leaderHtml += `<button type="button" class="w-full flex justify-between items-center px-3 py-2 rounded hover:bg-slate-50 text-sm" onclick="wizSelectLeader('${name}','${center}')"><span class="text-slate-700">${name}</span><span class="flex items-center gap-1 text-slate-500"><i class="ri-hospital-line"></i>${center}</span></button>`;
      
      const checked = collabSelected.has(id) ? 'checked' : '';
      collabHtml += `<label class="w-full flex justify-between items-center px-3 py-2 rounded hover:bg-slate-50 text-sm cursor-pointer"><span class="flex items-center gap-2"><input type="checkbox" ${checked} onchange="wizToggleCollab('${name}','${center}')" class="rounded text-brand-600 border-slate-300 focus:ring-brand-500"><span class="text-slate-700">${name}</span></span><span class="flex items-center gap-1 text-slate-500"><i class="ri-hospital-line"></i>${center}</span></label>`;
    });
    
    (CRC_DATA[center] || []).forEach(name => {
      const id = `${center}-${name}`;
      const checked = crcSelected.has(id) ? 'checked' : '';
      crcHtml += `<label class="w-full flex justify-between items-center px-3 py-2 rounded hover:bg-slate-50 text-sm cursor-pointer"><span class="flex items-center gap-2"><input type="checkbox" ${checked} onchange="wizToggleCrc('${name}','${center}')" class="rounded text-brand-600 border-slate-300 focus:ring-brand-500"><span class="text-slate-700">${name}</span></span><span class="flex items-center gap-1 text-slate-500"><i class="ri-hospital-line"></i>${center}</span></label>`;
    });
  });

  leaderDD.innerHTML = leaderHtml || `<div class="px-3 py-2 text-xs text-slate-500">无数据</div>`;
  collabDD.innerHTML = collabHtml || `<div class="px-3 py-2 text-xs text-slate-500">无数据</div>`;
  crcDD.innerHTML = crcHtml || `<div class="px-3 py-2 text-xs text-slate-500">无数据</div>`;
}

function wizToggleLeaderDropdown() { document.getElementById('wiz-leader-dropdown').classList.toggle('hidden'); }
function wizToggleCollabDropdown() { document.getElementById('wiz-collab-dropdown').classList.toggle('hidden'); }
function wizToggleCrcDropdown() { document.getElementById('wiz-crc-dropdown').classList.toggle('hidden'); }

function wizSelectLeader(name, center) {
    leaderSelected = { name, center };
    document.getElementById('wiz-leader-display').innerText = `${name} (${center})`;
    document.getElementById('wiz-leader-dropdown').classList.add('hidden');
}

function wizToggleCollab(name, center) {
    const id = `${center}-${name}`;
    if (collabSelected.has(id)) collabSelected.delete(id);
    else collabSelected.add(id);
    const count = collabSelected.size;
    document.getElementById('wiz-collab-display').innerText = count ? `已选择 ${count} 人` : '请选择协作医生...';
}

function wizToggleCrc(name, center) {
    const id = `${center}-${name}`;
    if (crcSelected.has(id)) crcSelected.delete(id);
    else crcSelected.add(id);
    const count = crcSelected.size;
    document.getElementById('wiz-crc-display').innerText = count ? `已选择 ${count} 人` : '请选择 CRC...';
}

function wizAddCriteria(type) {
    const list = document.getElementById(type === 'inclusion' ? 'wiz-inclusion-list' : 'wiz-exclusion-list');
    const row = document.createElement('div');
    const color = type === 'inclusion' ? 'bg-emerald-50 border-emerald-300 focus:border-emerald-500' : 'bg-red-50 border-red-300 focus:border-red-500';
    row.className = 'flex items-center gap-2 animate-fade-in';
    row.innerHTML = `<input type="text" class="flex-1 rounded-lg border ${color} px-3 py-2.5 text-sm transition-colors" placeholder="${type==='inclusion'?'请输入纳入标准':'请输入排除标准'}"><button type="button" class="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" onclick="this.parentElement.remove()"><i class="ri-delete-bin-line"></i></button>`;
    list.appendChild(row);
    row.querySelector('input').focus();
}

 function wizRenderSelectedDimensions() {
     const container = document.getElementById('wiz-dims-config-container');
     container.innerHTML = '';
     
     const selectedDims = document.querySelectorAll('input[name="wizDims"]:checked');
     
     selectedDims.forEach(checkbox => {
         const val = checkbox.value;
         const label = checkbox.closest('label').querySelector('.block').innerText;
         
         // Define default segments for each type
         let segmentsHtml = '';
         let editHtml = '';
         
         if (val === 'gender') {
             segmentsHtml = `
                <div class="flex h-10 w-full rounded-lg overflow-hidden font-bold text-white text-sm shadow-sm">
                    <div class="flex-1 bg-emerald-500 flex items-center justify-center">男</div>
                    <div class="flex-1 bg-indigo-500 flex items-center justify-center">女</div>
                </div>
             `;
         } else if (val === 'age') {
             segmentsHtml = `
                <div class="flex h-10 w-full rounded-lg overflow-hidden font-bold text-white text-sm shadow-sm">
                    <div class="flex-1 bg-emerald-500 flex items-center justify-center">4-7岁</div>
                    <div class="flex-1 bg-indigo-500 flex items-center justify-center">8-10岁</div>
                </div>
             `;
         } else if (val === 'diopter') {
             segmentsHtml = `
                <div class="flex h-10 w-full rounded-lg overflow-hidden font-bold text-white text-sm shadow-sm">
                    <div class="flex-1 bg-emerald-300 flex items-center justify-center">中度近视</div>
                    <div class="flex-1 bg-indigo-500 flex items-center justify-center">轻度近视</div>
                    <div class="flex-1 bg-purple-200 flex items-center justify-center">正视</div>
                </div>
             `;
             
             // Show edit panel for diopter as example
             editHtml = `
                <div class="mt-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm relative animate-fade-in">
                    <div class="flex justify-between items-center mb-4">
                        <div class="flex items-center gap-2">
                            <span class="bg-brand-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">正在配置选项</span>
                            <span class="font-bold text-slate-800">轻度近视</span>
                        </div>
                        <div class="flex gap-3 text-xs font-bold">
                            <button class="text-red-500 flex items-center gap-1 hover:text-red-600"><i class="ri-delete-bin-line"></i> 删除此段</button>
                            <button class="text-slate-400 hover:text-brand-600">收起</button>
                        </div>
                    </div>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-400 mb-1.5">选项展示名称</label>
                            <input type="text" value="轻度近视" class="w-full text-sm border-slate-200 rounded-lg focus:border-brand-500 focus:ring-1 focus:ring-brand-500">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-400 mb-1.5">数值起始 (Min)</label>
                                <div class="relative">
                                    <input type="number" value="-1.50" class="w-full text-sm border-slate-200 rounded-lg focus:border-brand-500 focus:ring-1 focus:ring-brand-500 pr-8">
                                    <span class="absolute right-2 top-2 text-xs text-slate-400 font-bold bg-slate-100 px-1 rounded">D</span>
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-400 mb-1.5">数值截止 (Max)</label>
                                <div class="relative">
                                    <input type="number" value="-0.51" class="w-full text-sm border-slate-200 rounded-lg focus:border-brand-500 focus:ring-1 focus:ring-brand-500 pr-8">
                                    <span class="absolute right-2 top-2 text-xs text-slate-400 font-bold bg-slate-100 px-1 rounded">D</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             `;
         }
         
         const div = document.createElement('div');
         div.className = "animate-fade-in";
         div.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                    <span class="bg-indigo-50 text-indigo-600 text-[10px] px-2 py-0.5 rounded font-bold border border-indigo-100">维度名称</span>
                    <h4 class="font-bold text-slate-800">${label}</h4>
                </div>
                <button class="text-slate-300 hover:text-red-500 transition-colors"><i class="ri-delete-bin-line text-lg"></i></button>
            </div>
            ${segmentsHtml}
            ${editHtml}
         `;
         container.appendChild(div);
     });
 }

 function wizToggleMatchMode() {
    // Just visual updates or logic if needed
    // Currently mode is just a selection
    // Also refresh Step 3 state if needed
    const mode = document.querySelector('input[name="wizMatchMode"]:checked').value;
    // Refresh inputs state
    const groups = document.querySelectorAll('.wiz-group-card');
    groups.forEach(g => {
         const total = parseInt(g.querySelector('.wiz-group-total-input').value) || 0;
         wizDistributeGroupFactors(g.id, total);
    });
}

/* ================= Wizard Step 3 Logic ================= */

function wizInitDefaultGroups() {
    const container = document.getElementById('wiz-group-container');
    container.innerHTML = '';
    
    // Prepare Factors (Cartesian Product)
    WIZ_FACTORS = wizGetCartesianProduct();
    
    // Initial Groups
    wizCreateGroupCard('实验组', 'ri-flask-line', 'indigo', 50);
    wizCreateGroupCard('对照组', 'ri-shield-check-line', 'emerald', 50);
    
    // Initial Distribution
    wizOnTotalChange();
}

function wizGetCartesianProduct() {
    const dims = [];
    // Checkboxes in Step 2
    if (document.querySelector('input[value="gender"]').checked) dims.push(['男', '女']);
    if (document.querySelector('input[value="age"]').checked) dims.push(['4-7', '8-10']);
    if (document.querySelector('input[value="diopter"]').checked) dims.push(['-1.0~-0.5', '-0.4~0']);
    
    if (dims.length === 0) return ['默认']; // Fallback
    
    // Generate product
    return dims.reduce((acc, curr) => {
        const res = [];
        acc.forEach(a => {
            curr.forEach(b => {
                res.push(a + ' ' + b); // Using space separator
            });
        });
        return res;
    });
}

function wizCreateGroupCard(name, icon, colorTheme, initialCount) {
    const container = document.getElementById('wiz-group-container');
    const groupId = 'wiz-group-' + Date.now() + Math.random().toString(36).substr(2, 5);
    
    // Extended Themes (5 colors)
    const themes = {
        indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', hover: 'hover:text-indigo-600', active: 'bg-indigo-100' },
        emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', hover: 'hover:text-emerald-600', active: 'bg-emerald-100' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', hover: 'hover:text-amber-600', active: 'bg-amber-100' },
        sky: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-100', hover: 'hover:text-sky-600', active: 'bg-sky-100' },
        rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', hover: 'hover:text-rose-600', active: 'bg-rose-100' },
        slate: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100', hover: 'hover:text-slate-600', active: 'bg-slate-100' }
    };
    
    const theme = themes[colorTheme] || themes.slate;

    const div = document.createElement('div');
    div.id = groupId;
    div.className = `wiz-group-card rounded-2xl border ${theme.border} ${theme.bg} overflow-hidden transition-all shadow-sm hover:shadow-md`;
    
    // Factors HTML
    let factorsHtml = '';
    WIZ_FACTORS.forEach((f, idx) => {
        const chips = f.split(' ').map(s => `<span class="bg-white/60 px-1.5 py-0.5 rounded text-slate-500 border border-slate-200/50">${s}</span>`).join('');
        
        factorsHtml += `
            <div class="flex items-center justify-between gap-4 p-3 bg-white/50 rounded-xl border border-white/60">
                <div class="flex flex-wrap gap-1 text-[10px] font-medium leading-none">
                    ${chips}
                </div>
                <input type="number" 
                    class="wiz-factor-input w-16 text-center text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-lg py-1 focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                    value="0" 
                    min="0"
                    data-group-id="${groupId}"
                    oninput="wizOnFactorChange('${groupId}')"
                >
            </div>
        `;
    });

    div.innerHTML = `
        <!-- Header -->
        <div class="p-4 flex items-center justify-between border-b ${theme.border} bg-white/30 backdrop-blur-sm">
            <!-- Left: Icon + Name + Medicine -->
            <div class="flex items-center gap-4 flex-1 mr-4">
                <div class="relative group/icon cursor-pointer shrink-0" onclick="wizRotateGroupIcon(this, '${groupId}')" title="点击切换图标">
                    <i class="${icon} ${theme.text} text-3xl transition-transform group-hover/icon:scale-110"></i>
                </div>
                <div class="flex flex-col gap-1.5 flex-1 w-full">
                     <input type="text" value="${name}" class="bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-brand-500 focus:ring-0 text-slate-800 font-bold text-base w-full transition-colors px-0 py-0.5 placeholder-slate-400" placeholder="分组名称">
                     <div class="flex items-center gap-2 w-full">
                        <span class="text-xs font-bold text-slate-500 whitespace-nowrap">产品:</span>
                        <input type="text" class="wiz-group-drug-input bg-white/50 rounded border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-xs text-slate-700 w-2/3 px-2 py-1 transition-colors placeholder-slate-400" placeholder="0.02%阿托品滴眼液">
                    </div>
                </div>
            </div>

            <!-- Right: Count + Collapse -->
            <div class="flex items-center gap-2 shrink-0">
                 <div class="relative">
                    <input type="number" 
                        class="wiz-group-total-input w-20 text-center font-bold text-sm rounded-lg border-0 bg-white shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500 py-1.5 text-slate-700"
                        value="${initialCount}"
                        min="${WIZ_FACTORS.length}"
                        oninput="wizOnGroupTotalChange('${groupId}')"
                    >
                 </div>
                 <button onclick="wizToggleGroupCollapse('${groupId}')" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/50 text-slate-400 transition-colors">
                    <i class="ri-arrow-down-s-line transition-transform duration-300 transform" id="icon-${groupId}"></i>
                 </button>
            </div>
        </div>
        
        <!-- Content (Factors) - Default Collapsed (hidden) -->
        <div id="content-${groupId}" class="hidden p-4 space-y-2 max-h-[320px] overflow-y-auto custom-scrollbar">
            ${factorsHtml}
        </div>
    `;
    
    container.appendChild(div);
}

function wizRotateGroupIcon(el, groupId) {
    const iconEl = el.querySelector('i');
    const currentClass = Array.from(iconEl.classList).find(c => c.startsWith('ri-'));
    let idx = ICON_LIST.indexOf(currentClass);
    if (idx === -1) idx = 0;
    let nextIdx = (idx + 1) % ICON_LIST.length;
    iconEl.classList.remove(currentClass);
    iconEl.classList.add(ICON_LIST[nextIdx]);
}

function wizAddNewGroup() {
    const count = document.querySelectorAll('.wiz-group-card').length;
    if (count >= 10) { alert("分组数量已达上限"); return; }
    
    // Cycle through themes for new groups
    const themes = ['amber', 'rose', 'sky', 'indigo', 'emerald'];
    const theme = themes[count % themes.length];
    
    wizCreateGroupCard(`分组 ${count + 1}`, 'ri-group-line', theme, 0);
    wizOnTotalChange(); // Redistribute total to include new group
}

function wizToggleGroupCollapse(groupId) {
    const content = document.getElementById(`content-${groupId}`);
    const icon = document.getElementById(`icon-${groupId}`);
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.classList.remove('rotate-180');
    } else {
        content.classList.add('hidden');
        icon.classList.add('rotate-180');
    }
}

function wizOnTotalChange() {
    const totalInput = document.getElementById('wiz-total-count');
    let total = parseInt(totalInput.value) || 0;
    
    // Enforce min total based on groups and factors
    const groups = document.querySelectorAll('.wiz-group-card');
    const minPerGroup = WIZ_FACTORS.length;
    const minTotal = groups.length * minPerGroup;
    
    if (total < minTotal) {
        // total = minTotal; 
        // totalInput.value = total;
        // Optionally warn or auto-correct? Let's just distribute what we have and let inputs clamp
    }

    // Distribute total evenly among groups
    if (groups.length === 0) return;
    
    const baseGroup = Math.floor(total / groups.length);
    let remainder = total % groups.length;
    
    groups.forEach((card, idx) => {
        const groupInput = card.querySelector('.wiz-group-total-input');
        let gCount = baseGroup;
        if (idx < remainder) gCount++;
        
        groupInput.value = gCount;
        wizDistributeGroupFactors(card.id, gCount);
    });
}

function wizOnGroupTotalChange(groupId) {
    // 1. Update this group's factors
    const card = document.getElementById(groupId);
    const groupInput = card.querySelector('.wiz-group-total-input');
    let val = parseInt(groupInput.value) || 0;
    
    // Min check
    if (val < WIZ_FACTORS.length) {
        val = WIZ_FACTORS.length;
        groupInput.value = val;
    }
    
    wizDistributeGroupFactors(groupId, val);
    
    // 2. Update Total Count
    wizUpdateProjectTotal();
}

function wizDistributeGroupFactors(groupId, totalCount) {
    const card = document.getElementById(groupId);
    const inputs = card.querySelectorAll('.wiz-factor-input');
    const count = inputs.length;
    if (count === 0) return;

    const base = Math.floor(totalCount / count);
    let rem = totalCount % count;
    
    inputs.forEach((inp, idx) => {
        let val = base;
        if (idx < rem) val++;
        inp.value = val;
    });
    
    // Handle Readonly state based on mode
    const mode = document.querySelector('input[name="wizMatchMode"]:checked').value;
    inputs.forEach(inp => {
        if (mode === 'random') {
            inp.disabled = true;
            inp.classList.add('bg-slate-100', 'text-slate-500');
            inp.classList.remove('bg-white', 'text-slate-700');
        } else {
            inp.disabled = false;
            inp.classList.remove('bg-slate-100', 'text-slate-500');
            inp.classList.add('bg-white', 'text-slate-700');
        }
    });
}

function wizOnFactorChange(groupId) {
    const card = document.getElementById(groupId);
    const inputs = card.querySelectorAll('.wiz-factor-input');
    let sum = 0;
    inputs.forEach(inp => sum += (parseInt(inp.value) || 0));
    
    // Update Group Total Input
    card.querySelector('.wiz-group-total-input').value = sum;
    
    // Update Project Total
    wizUpdateProjectTotal();
}

function wizUpdateProjectTotal() {
    const groupInputs = document.querySelectorAll('.wiz-group-total-input');
    let sum = 0;
    groupInputs.forEach(inp => sum += (parseInt(inp.value) || 0));
    document.getElementById('wiz-total-count').value = sum;
}

/* ================= Fission (Multi-stage) Logic ================= */

function wizToggleFissionMode() {
    const toggle = document.getElementById('wiz-fission-toggle');
    const isChecked = toggle.checked;
    
    if (isChecked) {
        // Prepare data for modal
        const mode = document.querySelector('input[name="wizMatchMode"]:checked').value;
        const modeText = (mode === 'random') ? '均匀分组 (Uniform)' : '自由分组 (Free)';
        document.getElementById('wiz-confirm-mode-display').innerText = modeText;
        
        const list = document.getElementById('wiz-confirm-group-list');
        list.innerHTML = '';
        
        // Collect groups
        const groups = [];
        document.querySelectorAll('.wiz-group-card').forEach(card => {
             const nameInput = card.querySelector('input[type="text"]'); 
             const drugInput = card.querySelector('.wiz-group-drug-input');
             const countInput = card.querySelector('.wiz-group-total-input');
             if (nameInput) {
                 groups.push({
                     name: nameInput.value,
                     medicine: drugInput ? drugInput.value : '',
                     count: countInput ? countInput.value : 0
                 });
             }
        });
        
        groups.forEach(g => {
            const div = document.createElement('div');
            div.className = "flex justify-between items-center text-xs p-2 bg-white rounded border border-slate-100";
            div.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="font-bold text-slate-700">${g.name}</span>
                    <span class="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">${g.medicine || '无产品'}</span>
                </div>
                <span class="font-bold text-slate-600">${g.count}人</span>
            `;
            list.appendChild(div);
        });

        // Show Modal
        document.getElementById('wiz-fission-confirm-modal').classList.remove('hidden');
    } else {
        _performFissionSwitch(false);
    }
}

function wizConfirmFissionMode() {
    document.getElementById('wiz-fission-confirm-modal').classList.add('hidden');
    _performFissionSwitch(true);
}

function wizCancelFissionMode() {
    document.getElementById('wiz-fission-confirm-modal').classList.add('hidden');
    document.getElementById('wiz-fission-toggle').checked = false;
    _performFissionSwitch(false);
}

function _performFissionSwitch(enable) {
    isFissionMode = enable;
    document.getElementById('wiz-fission-toggle').checked = enable;

    const simpleContainer = document.getElementById('wiz-mode-simple');
    const fissionContainer = document.getElementById('wiz-mode-fission');

    if (isFissionMode) {
        simpleContainer.classList.add('hidden');
        fissionContainer.classList.remove('hidden');
        
        // Reset Right Panel
        document.getElementById('wiz-config-panel-container').classList.remove('hidden');
        document.getElementById('wiz-config-placeholder').classList.remove('hidden');
        document.getElementById('wiz-config-content').classList.add('hidden');
        
        wizRenderFissionFlow();
    } else {
        simpleContainer.classList.remove('hidden');
        fissionContainer.classList.add('hidden');
        // Hide config panel
        document.getElementById('wiz-config-panel-container').classList.add('hidden');
    }
}

function wizRenderFissionFlow() {
    const stage1Col = document.getElementById('wiz-stage1-col');
    const stage2Col = document.getElementById('wiz-stage2-col');
    
    // Clear previous dynamic content but keep headers
    // Re-inject Headers to be safe or use querySelector to append
    stage1Col.innerHTML = `<h5 class="font-bold text-slate-700 border-b border-slate-200 pb-2">第一阶段 (Stage 1)</h5>`;
    stage2Col.innerHTML = `<h5 class="font-bold text-slate-700 border-b border-slate-200 pb-2">第二阶段 (Stage 2)</h5>`;
    
    // Get current groups from the Simple Mode (Source of Truth)
    const groups = [];
    document.querySelectorAll('.wiz-group-card').forEach(card => {
         const nameInput = card.querySelector('input[type="text"]'); 
         const countInput = card.querySelector('.wiz-group-total-input');
         if (nameInput) {
             groups.push({
                 id: card.id,
                 name: nameInput.value,
                 count: parseInt(countInput.value) || 0
             });
         }
    });

    const total = parseInt(document.getElementById('wiz-total-count').value) || 100;
    // document.getElementById('wiz-fission-total-display').innerText = total; // Removed display in tree

    // Render Stage 1 & Stage 2 Lists
    groups.forEach(g => {
        const ratio = Math.round((g.count / total) * 100);
        
        // --- Stage 1 Card (Read-only view) ---
        const div1 = document.createElement('div');
        div1.className = "bg-white border border-slate-200 rounded-xl p-4 shadow-sm opacity-80";
        div1.innerHTML = `
            <h4 class="font-bold text-slate-800 text-lg">${g.name}</h4>
            <div class="text-sm text-slate-500 mt-1">占比 ${ratio}% (${g.count}人)</div>
        `;
        stage1Col.appendChild(div1);

        // --- Stage 2 Card (Interactive) ---
        const rule = fissionRules[g.id];
        const hasRule = !!rule;
        
        let subGroupsHtml = '';
        if (hasRule && rule.subgroups) {
            subGroupsHtml = `
                <div class="mt-3 flex gap-2 pt-3 border-t border-slate-100 animate-fade-in">
                    ${rule.subgroups.map(sg => `
                        <div class="flex-1 bg-slate-50 border border-slate-200 rounded p-1.5 text-center">
                            <div class="font-bold text-slate-700 text-xs">${sg.name}</div>
                            <div class="text-[10px] text-slate-500">${sg.count}人</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        const div2 = document.createElement('div');
        // Highlight active config
        const badge = document.getElementById('wiz-config-target-badge');
        // Check if content is visible to determine active state
        const isContentVisible = !document.getElementById('wiz-config-content').classList.contains('hidden');
        const activeId = isContentVisible && badge ? badge.getAttribute('data-id') : null;
        const isActive = activeId === g.id;
        const activeClass = isActive ? 'ring-2 ring-brand-500 border-brand-200 bg-brand-50/30' : 'border-slate-200 hover:border-brand-300';

        div2.className = `bg-white border ${activeClass} rounded-xl p-4 shadow-sm transition-all relative`;
        
        div2.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-bold text-slate-800 text-lg">${g.name}</h4>
                    <div class="text-sm text-slate-500 mt-1">${hasRule ? '将裂变为:' : '维持原组'}</div>
                </div>
                <div>
                    ${hasRule ? 
                        `<span class="cursor-pointer inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 gap-1" onclick="wizOpenFissionConfig('${g.id}', '${g.name}')">
                            <i class="ri-flashlight-fill"></i> ${rule.trigger === 'manual' ? '主动' : '自动'}
                         </span>` : 
                        `<button class="text-sm text-brand-600 font-bold hover:underline transition-opacity flex items-center gap-1" onclick="wizOpenFissionConfig('${g.id}', '${g.name}')">
                            <i class="ri-settings-3-line"></i> 配置裂变
                         </button>`
                    }
                </div>
            </div>
            ${subGroupsHtml}
        `;
        stage2Col.appendChild(div2);
    });
}

function wizOpenFissionConfig(groupId, groupName) {
    // 1. Show Panel Content, Hide Placeholder
    document.getElementById('wiz-config-placeholder').classList.add('hidden');
    document.getElementById('wiz-config-content').classList.remove('hidden');

    // 2. Update Badge
    const badge = document.getElementById('wiz-config-target-badge');
    badge.innerText = `针对 ${groupName}`;
    badge.className = "px-2 py-1 bg-brand-100 text-brand-700 text-xs font-bold rounded animate-pulse-once";
    badge.setAttribute('data-id', groupId);

    // 3. Load Existing Rule or Default
    const rule = fissionRules[groupId] || {
        trigger: 'manual',
        threshold: '视功能指标大于 0.8',
        days: 180, // Default days
        strategy: 'simple',
        subgroups: [
            { name: '裂变1组', count: Math.floor(parseInt(document.getElementById('wiz-total-count').value) / 4) || 25 },
            { name: '裂变2组', count: Math.floor(parseInt(document.getElementById('wiz-total-count').value) / 4) || 25 }
        ]
    };

    // Data Migration for old structure where threshold was used for days in auto mode
    if (rule.trigger === 'auto' && !rule.days && !isNaN(rule.threshold)) {
        rule.days = rule.threshold;
        rule.threshold = ''; // Clear threshold as it was used for days
    }

    // Populate Form 
    // Set Balance Strategy
    wizSetBalanceStrategy(rule.strategy || 'simple');
    // Set Trigger Mode (this will toggle UI elements)
    wizSetTriggerMode(rule.trigger || 'manual');
    
    // Set Values
    document.getElementById('wiz-trigger-days-input').value = rule.days || 0;
    document.getElementById('wiz-trigger-input').value = rule.threshold || '视功能指标大于 0.8';

    // Render Subgroups
    wizRenderSubgroups(rule.subgroups);

    // Bind Save Button Action
    const form = document.getElementById('wiz-config-form');
    const saveBtn = form.querySelector('button.bg-brand-600');
    saveBtn.onclick = function() {
        wizSaveFissionRule(groupId, groupName);
    };
    
    // Re-render Flow to highlight selection
    wizRenderFissionFlow();
}

function wizRenderSubgroups(subgroups) {
    const container = document.getElementById('wiz-subgroups-container');
    container.innerHTML = '';
    
    subgroups.forEach((sg, idx) => {
        const div = document.createElement('div');
        div.className = "flex items-start gap-2 animate-fade-in border-b border-slate-50 pb-3 mb-3 last:border-0 last:mb-0 last:pb-0";
        div.innerHTML = `
            <div class="flex flex-col gap-2 flex-1">
                <input type="text" value="${sg.name}" class="wiz-subgroup-name w-full text-xs font-bold text-slate-600 border-slate-200 rounded-lg py-1.5 pl-2 focus:border-brand-500 focus:ring-1 focus:ring-brand-500" placeholder="子组名称">
                <div class="flex items-center gap-2">
                    <span class="text-[10px] text-slate-400 whitespace-nowrap"><i class="ri-capsule-fill mr-1"></i>产品</span>
                    <input type="text" value="${sg.medicine || ''}" class="wiz-subgroup-medicine flex-1 text-xs text-slate-600 border-slate-200 rounded-lg py-1.5 pl-2 focus:border-brand-500 focus:ring-1 focus:ring-brand-500" placeholder="产品名称">
                </div>
            </div>
            <div class="flex items-center gap-1 mt-0.5">
                <div class="relative w-20">
                    <input type="number" value="${sg.count}" class="wiz-subgroup-count w-full pl-2 pr-6 py-1.5 text-sm border-slate-200 rounded-lg text-center focus:border-brand-500 focus:ring-1 focus:ring-brand-500">
                    <span class="absolute right-2 top-1.5 text-xs text-slate-400">人</span>
                </div>
                ${subgroups.length > 2 ? `<button onclick="wizRemoveSubgroup(this)" class="text-slate-300 hover:text-red-500 w-8 h-8 flex items-center justify-center rounded hover:bg-red-50 transition-colors"><i class="ri-delete-bin-line"></i></button>` : `<div class="w-8"></div>`}
            </div>
        `;
        container.appendChild(div);
    });

    // Update Add Button State
    const btnAdd = document.getElementById('wiz-btn-add-subgroup');
    if (subgroups.length >= 3) {
        btnAdd.classList.add('opacity-50', 'cursor-not-allowed');
        btnAdd.disabled = true;
        btnAdd.innerText = "已达上限 (最多3个)";
    } else {
        btnAdd.classList.remove('opacity-50', 'cursor-not-allowed');
        btnAdd.disabled = false;
        btnAdd.innerText = "+ 增加子组 (最多3个)";
    }
}

function wizAddSubgroup() {
    const container = document.getElementById('wiz-subgroups-container');
    const currentCount = container.children.length;
    if (currentCount >= 3) return;
    
    // Get current data to re-render
    const subgroups = wizCollectSubgroupsData();
    subgroups.push({ name: `裂变${currentCount + 1}组`, medicine: '', count: 0 });
    
    wizRenderSubgroups(subgroups);
}

function wizRemoveSubgroup(btn) {
    const row = btn.closest('.animate-fade-in');
    row.remove();
    // Re-render to update UI state (buttons, etc.)
    const subgroups = wizCollectSubgroupsData();
    wizRenderSubgroups(subgroups);
}

function wizCollectSubgroupsData() {
    const container = document.getElementById('wiz-subgroups-container');
    const data = [];
    container.querySelectorAll('.animate-fade-in').forEach(row => {
        data.push({
            name: row.querySelector('.wiz-subgroup-name').value,
            medicine: row.querySelector('.wiz-subgroup-medicine').value,
            count: parseInt(row.querySelector('.wiz-subgroup-count').value) || 0
        });
    });
    return data;
}

function wizSetTriggerMode(mode) {
    const btnManual = document.getElementById('btn-trigger-manual');
    const btnAuto = document.getElementById('btn-trigger-auto');
    const hint = document.getElementById('wiz-trigger-hint');
    const group = document.getElementById('wiz-trigger-group');
    
    // UI Containers
    const manualContainer = document.getElementById('wiz-trigger-manual-container');
    const daysDesc = document.getElementById('wiz-trigger-days-desc');
    
    // Store mode
    group.setAttribute('data-value', mode);

    if (mode === 'manual') {
        btnManual.className = "flex-1 py-1.5 text-xs font-bold rounded shadow-sm bg-white text-slate-800 transition-all";
        btnAuto.className = "flex-1 py-1.5 text-xs font-bold rounded text-slate-500 hover:text-slate-700 transition-all";
        
        hint.innerHTML = '<i class="ri-information-line mr-1"></i> 当受试者符合裂变规则后，由工作人员主动点击裂变。';
        hint.className = "bg-indigo-50 text-indigo-700 text-xs p-2 rounded border border-indigo-100 leading-relaxed mb-3";
        
        // Manual Mode: Show both Days and Manual Description
        manualContainer.classList.remove('hidden');
        daysDesc.innerText = "受试者入组满此天数后，才允许进行裂变";
        
    } else {
        btnManual.className = "flex-1 py-1.5 text-xs font-bold rounded text-slate-500 hover:text-slate-700 transition-all";
        btnAuto.className = "flex-1 py-1.5 text-xs font-bold rounded shadow-sm bg-white text-slate-800 transition-all";
        
        hint.innerHTML = '<i class="ri-time-line mr-1"></i> 当受试者入组符合一定时间后，自动触发裂变逻辑。';
        hint.className = "bg-amber-50 text-amber-700 text-xs p-2 rounded border border-amber-100 leading-relaxed mb-3";
        
        // Auto Mode: Show Days only (Hide Manual Description)
        manualContainer.classList.add('hidden');
        daysDesc.innerText = "受试者入组满此天数后，系统将自动执行裂变分组";
    }
}

function wizSetBalanceStrategy(strategy) {
    const btnSimple = document.getElementById('btn-balance-simple');
    const btnInherit = document.getElementById('btn-balance-inherit');
    const btnManual = document.getElementById('btn-balance-manual');
    const hint = document.getElementById('wiz-balance-hint');
    
    // Store current strategy in a data attribute on the container for save logic
    const container = document.getElementById('wiz-balance-strategy-group');
    container.setAttribute('data-value', strategy);

    // Reset all buttons to inactive state
    const inactiveClass = "flex-1 py-1.5 text-xs font-bold rounded text-slate-500 hover:text-slate-700 transition-all";
    const activeClass = "flex-1 py-1.5 text-xs font-bold rounded shadow-sm bg-white text-slate-800 transition-all";
    
    btnSimple.className = inactiveClass;
    btnInherit.className = inactiveClass;
    btnManual.className = inactiveClass;

    if (strategy === 'simple') {
        btnSimple.className = activeClass;
        hint.innerHTML = '<i class="ri-information-line mr-1"></i> 简单随机算法分配，不保证原组维度的平衡。';
    } else if (strategy === 'inherit') {
        btnInherit.className = activeClass;
        hint.innerHTML = '<i class="ri-information-line mr-1"></i> 系统将在裂变子组间自动平衡原组的维度。';
    } else if (strategy === 'manual') {
        btnManual.className = activeClass;
        hint.innerHTML = '<i class="ri-information-line mr-1"></i> 由工作人员主动进行组别分配。';
    }
}

function wizSaveFissionRule(groupId, groupName) {
    // Get Strategy & Trigger
    const strategy = document.getElementById('wiz-balance-strategy-group').getAttribute('data-value') || 'simple';
    const trigger = document.getElementById('wiz-trigger-group').getAttribute('data-value') || 'manual';
    const thresholdVal = document.getElementById('wiz-trigger-input').value;
    const daysVal = document.getElementById('wiz-trigger-days-input').value;
    
    // Get Subgroups Data
    const subgroups = wizCollectSubgroupsData();

    // Mock saving form data
    fissionRules[groupId] = {
        trigger: trigger,
        threshold: thresholdVal,
        days: daysVal,
        strategy: strategy,
        subgroups: subgroups
    };
    
    wizRenderFissionFlow();
    
    // Show feedback
    const btn = document.querySelector('#wiz-config-form button.bg-brand-600');
    const originalText = btn.innerText;
    btn.innerText = "已保存";
    btn.classList.remove('bg-brand-600');
    btn.classList.add('bg-emerald-600');
    
    setTimeout(() => {
        // Restore button state
        btn.innerText = originalText;
        btn.classList.remove('bg-emerald-600');
        btn.classList.add('bg-brand-600');
        
        // Hide config panel, show placeholder
        document.getElementById('wiz-config-content').classList.add('hidden');
        document.getElementById('wiz-config-placeholder').classList.remove('hidden');
        
        // Clear active selection in flow
        wizRenderFissionFlow();
    }, 500);
}
