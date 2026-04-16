const ADD_DEPT_LIST = [
  { name: "心内科", icon: "ri-heart-pulse-line", color: "red" },
  { name: "眼科", icon: "ri-eye-line", color: "amber" },
  { name: "检验科", icon: "ri-microscope-line", color: "indigo" },
  { name: "药学部", icon: "ri-capsule-line", color: "emerald" },
  { name: "内科", icon: "ri-hospital-line", color: "slate" },
  { name: "外科", icon: "ri-hospital-line", color: "slate" },
  { name: "神经内科", icon: "ri-hospital-line", color: "purple" },
  { name: "呼吸与危重症医学科", icon: "ri-hospital-line", color: "orange" },
  { name: "妇产科", icon: "ri-hospital-line", color: "pink" },
  { name: "急诊医学科", icon: "ri-hospital-line", color: "teal" }
];

function openAddDeptDrawer() {
  console.log('openAddDeptDrawer called');
  const drawer = document.getElementById('add-dept-drawer');
  const backdrop = document.getElementById('add-dept-backdrop');
  const panel = document.getElementById('add-dept-panel');
  const listContainer = document.getElementById('dept-selection-list');

  if (!drawer || !backdrop || !panel || !listContainer) {
      console.error('Elements not found');
      return;
  }

  // Render list
  listContainer.innerHTML = ADD_DEPT_LIST.map((dept, index) => `
      <label class="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-all group">
          <input type="checkbox" name="dept-select" value="${dept.name}" class="w-5 h-5 text-brand-600 rounded focus:ring-brand-500 border-slate-300 mr-4">
          <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-${dept.color}-50 text-${dept.color}-600 flex items-center justify-center">
                  <i class="${dept.icon} text-xl"></i>
              </div>
              <span class="font-bold text-slate-700">${dept.name}</span>
          </div>
      </label>
  `).join('');

  drawer.classList.remove('hidden');
  // Small delay to allow display:block to apply before transition
  setTimeout(() => {
      backdrop.classList.remove('opacity-0');
      panel.classList.remove('translate-x-full');
  }, 50);
}

function closeAddDeptDrawer() {
  const drawer = document.getElementById('add-dept-drawer');
  const backdrop = document.getElementById('add-dept-backdrop');
  const panel = document.getElementById('add-dept-panel');

  backdrop.classList.add('opacity-0');
  panel.classList.add('translate-x-full');

  setTimeout(() => {
      drawer.classList.add('hidden');
  }, 300);
}

function confirmAddDept() {
  const selected = document.querySelectorAll('input[name="dept-select"]:checked');
  if (selected.length === 0) {
      alert("请至少选择一个科室");
      return;
  }
  closeAddDeptDrawer();
  setTimeout(() => {
      alert("添加成功");
  }, 300);
}

function switchDeptVerticalTab(el, deptId) {
  // Reset all tabs
  document.querySelectorAll('.dept-tab').forEach(tab => {
      tab.classList.remove('active', 'bg-white', 'shadow-sm', 'text-brand-600', 'border-brand-100');
      tab.classList.add('text-slate-600', 'border-transparent', 'hover:bg-white', 'hover:shadow-sm', 'hover:border-slate-100');
  });

  // Activate clicked tab
  el.classList.add('active', 'bg-white', 'shadow-sm', 'text-brand-600', 'border-brand-100');
  el.classList.remove('text-slate-600', 'border-transparent', 'hover:bg-white', 'hover:shadow-sm', 'hover:border-slate-100');

  // Here you would typically load different content for the right side table based on deptId
  // For this demo, we'll just keep the static table
  console.log("Switched to department:", deptId);
}

function toggleDeptAddPanel() {
  const p = document.getElementById('dept-add-panel');
  p.classList.toggle('hidden');
}

function toggleDeptIconDropdown() {
  const d = document.getElementById('dept-icon-dropdown');
  d.classList.toggle('hidden');
}

function setDeptIcon(icon) {
  const preview = document.getElementById('dept-icon-preview');
  preview.innerHTML = `<i class="${icon} text-lg"></i>`;
  document.getElementById('dept-icon-dropdown').classList.add('hidden');
  preview.setAttribute('data-icon', icon);
}

/**
 * 添加科室卡片
 */
function addDepartment() {
  const grid = document.getElementById('dept-grid');
  const label = document.getElementById('dept-label-input').value.trim();
  const preview = document.getElementById('dept-icon-preview');
  const icon = preview.getAttribute('data-icon') || 'ri-hospital-line';
  if (!label) return;

  const card = document.createElement('div');
  card.className = "bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all";
  card.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="p-3 bg-slate-50 text-slate-600 rounded-xl"><i class="${icon} text-xl"></i></div>
      <h4 class="text-lg font-bold text-slate-800">${label}</h4>
    </div>
  `;
  grid.appendChild(card);

  document.getElementById('dept-label-input').value = "";
  document.getElementById('dept-add-panel').classList.add('hidden');
}