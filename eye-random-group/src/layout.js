function hideAllViews() {
  const vd = document.getElementById("view-dashboard");
  if (vd) vd.classList.add("hidden");
  const vedc = document.getElementById("view-edc");
  if (vedc) vedc.classList.add("hidden");
  document.getElementById("view-projects").classList.add("hidden");
  document.getElementById("view-project-detail").classList.add("hidden");
  document.getElementById("view-dimensions").classList.add("hidden");
  document.getElementById("view-departments").classList.add("hidden");
  document.getElementById("view-roles").classList.add("hidden");
  document.getElementById("view-centers").classList.add("hidden");
  document.getElementById("view-center-detail").classList.add("hidden");
  document.getElementById("view-users").classList.add("hidden");

  document
    .querySelectorAll(".nav-item")
    .forEach((el) =>
      el.classList.remove(
        "active",
        "bg-brand-50",
        "text-brand-600"
      )
    );
}

const routeConfig = {
  dashboard: {
    title: "系统总览",
    description: "项目、中心与受试者关键指标概览",
    permissions: [{ text: "所有角色", color: "slate" }]
  },
  edc: {
    title: "惟爱医疗软件服务",
    description: "系统导航树",
    permissions: [{ text: "导航页", color: "slate" }]
  },
  projects: {
    title: "项目管理",
    description: "管理所有临床研究项目",
    permissions: [
      { text: "所有角色", color: "slate" }
    ]
  },
  dimensions: {
    title: "维度管理",
    description: "定义全局可用的随机化分层因素",
    permissions: [
      { text: "开发者账户", color: "indigo" },
      { text: "超级管理员", color: "purple" },
      { text: "中心管理员", color: "emerald" }
    ]
  },
  departments: {
    title: "科室管理",
    description: "定义项目关联的临床科室",
    permissions: [
      { text: "开发者账户", color: "indigo" },
      { text: "超级管理员", color: "purple" }
    ]
  },
  roles: {
    title: "角色权限控制",
    description: "管理系统角色与功能权限",
    permissions: [
      { text: "开发者账户", color: "indigo" },
      { text: "超级管理员", color: "purple" }
    ]
  },
  centers: {
    title: "中心管理",
    description: "管理多中心临床试验的各个分中心信息",
    permissions: [
      { text: "开发者账户", color: "indigo" },
      { text: "超级管理员", color: "purple" },
      { text: "中心管理员", color: "emerald" }
    ]
  },
  users: {
    title: "用户管理",
    description: "维护系统用户、组织归属与角色权限",
    permissions: [
      { text: "开发者账户", color: "indigo" },
      { text: "超级管理员", color: "purple" }
    ]
  }
};

function updateHeader(config) {
  // Update Title
  document.getElementById("page-title").innerText = config.title || "";
  
  // Update Description
  const descEl = document.getElementById("page-description");
  if (config.description) {
    descEl.innerText = config.description;
    descEl.classList.remove("hidden");
  } else {
    descEl.classList.add("hidden");
  }
  
  // Update Permissions
  const permContainer = document.getElementById("page-permissions");
  permContainer.innerHTML = ""; // Clear existing
  if (config.permissions && config.permissions.length > 0) {
    config.permissions.forEach(perm => {
      const span = document.createElement("span");
      span.className = `px-2 py-0.5 text-xs font-normal rounded bg-${perm.color}-100 text-${perm.color}-700`;
      span.innerText = perm.text;
      permContainer.appendChild(span);
    });
  }
}

function switchTab(tabName) {
  hideAllViews();
  
  // Ensure create-project-wizard is hidden when switching tabs
  if (typeof cancelWizard === 'function') {
    // Only call if wizard is visible to avoid unnecessary DOM updates
    const wiz = document.getElementById('create-project-wizard');
    if (wiz && !wiz.classList.contains('hidden')) {
        cancelWizard();
    }
  } else {
    // Fallback if cancelWizard is not available (e.g. not loaded yet)
    const wiz = document.getElementById('create-project-wizard');
    if (wiz) {
        wiz.classList.add('hidden');
        wiz.classList.remove('flex');
    }
  }

  const config = routeConfig[tabName];
  if (config) {
    updateHeader(config);
  } else {
     // Fallback or specific pages not in config
  }

  // 清除所有导航项的激活状态
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove("active", "bg-brand-50", "text-brand-600");
  });

  const navItem = document.getElementById("nav-" + tabName);
  if (navItem) {
    navItem.classList.add("active", "bg-brand-50", "text-brand-600");
  }
  
  // 如果是二级页面，也要让对应的一级菜单高亮
  if (tabName === 'projects' || tabName === 'dimensions') {
    const parentMenu = document.getElementById("nav-iwrs");
    if (parentMenu) {
      // parentMenu.classList.add("active", "bg-brand-50", "text-brand-600");
      // 确保IWRS子菜单是展开的
      document.getElementById("iwrs-submenu").classList.remove("hidden");
      document.getElementById("nav-iwrs-arrow").style.transform = "rotate(180deg)";
    }
  } else if (tabName === 'edc-projects' || tabName === 'edc-templates') {
    const parentMenu = document.getElementById("nav-edc");
    if (parentMenu) {
      // parentMenu.classList.add("active", "bg-brand-50", "text-brand-600");
      // 确保EDC子菜单是展开的
      document.getElementById("edc-submenu").classList.remove("hidden");
      document.getElementById("nav-edc-arrow").style.transform = "rotate(180deg)";
    }
  }
  
  const viewItem = document.getElementById("view-" + tabName);
  if (viewItem) {
      viewItem.classList.remove("hidden");
  }

  if (tabName === "dashboard" && typeof initDashboardCharts === "function") {
    initDashboardCharts();
  }

  if (tabName === "roles") {
    renderRoleList(); // Initialize
  }
}

function openProjectDetail(isFission = false) {
  hideAllViews();
  document
    .getElementById("view-project-detail")
    .classList.remove("hidden");
  document
    .getElementById("nav-projects")
    .classList.add("active", "bg-brand-50", "text-brand-600"); // 保持项目管理高亮
  
  updateHeader({ title: "项目详情" });
  window.scrollTo(0, 0);

  // Toggle Fission Content
  const fissionContent = document.querySelectorAll('.fission-content');
  const normalContent = document.querySelectorAll('.normal-content');
  const projectTitle = document.querySelector('#view-project-detail h2');
  
  if (isFission) {
      fissionContent.forEach(el => el.classList.remove('hidden'));
      normalContent.forEach(el => el.classList.add('hidden'));
      if(projectTitle) projectTitle.innerText = "冠心病介入治疗术后心脏康复分级干预策略的多中心随机对照研究";
      
      // Switch Data Source
      if (typeof switchProjectType === 'function') {
        switchProjectType('FISSION');
      }

      // Reset Fission Group View to default state
      if (typeof resetFissionGroupView === 'function') {
        resetFissionGroupView();
      }
  } else {
      fissionContent.forEach(el => el.classList.add('hidden'));
      normalContent.forEach(el => el.classList.remove('hidden'));
      if(projectTitle) projectTitle.innerText = "光刻微结构近视管理镜片在儿童青少年近视防控中的有效性及佩戴安全舒适性的随机对照临床研究";
      
      // Switch Data Source
      if (typeof switchProjectType === 'function') {
        switchProjectType('NORMAL');
      }

      // Reset Normal Group View to default state (2 groups)
      if (typeof toggleGroupView === 'function') {
        toggleGroupView(2);
        // Reset radio button UI if needed
        const radios = document.getElementsByName('group');
        if (radios && radios.length > 0) radios[0].checked = true;
      }
  }
}

function backToProjects() {
  switchTab("projects");
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const headerContent = document.getElementById('sidebar-header-content');
  const navTexts = document.querySelectorAll('.nav-text');
  const versionInfo = document.getElementById('sidebar-version-info');
  const footer = document.getElementById('sidebar-footer');
  const toggleBtnIcon = document.querySelector('#sidebar-toggle-btn i');
  const refreshContainer = document.getElementById('sidebar-refresh-container');
  
  const isExpanded = sidebar.classList.contains('w-72');
  
  if (isExpanded) {
    // Collapse
    sidebar.classList.replace('w-72', 'w-20');
    
    headerContent.classList.add('opacity-0', 'w-0');
    
    navTexts.forEach(t => t.classList.add('opacity-0', 'w-0'));
    
    versionInfo.classList.add('opacity-0', 'w-0');
    
    if (refreshContainer) refreshContainer.classList.add('hidden');
    
    footer.classList.replace('px-6', 'px-2');
    footer.classList.replace('flex-row', 'flex-col'); 
    footer.classList.replace('justify-between', 'justify-center');
    footer.classList.add('gap-4');
    
    toggleBtnIcon.classList.replace('ri-menu-fold-line', 'ri-menu-unfold-line');
  } else {
    // Expand
    sidebar.classList.replace('w-20', 'w-72');
    
    headerContent.classList.remove('opacity-0', 'w-0');
    
    navTexts.forEach(t => t.classList.remove('opacity-0', 'w-0'));
    
    versionInfo.classList.remove('opacity-0', 'w-0');
    
    if (refreshContainer) refreshContainer.classList.remove('hidden');
    
    footer.classList.replace('px-2', 'px-6');
    footer.classList.replace('flex-col', 'flex-row');
    footer.classList.replace('justify-center', 'justify-between');
    footer.classList.remove('gap-4');

    toggleBtnIcon.classList.replace('ri-menu-unfold-line', 'ri-menu-fold-line');
  }
}

// ================= Notification Drawer Logic =================
function toggleNotificationDrawer() {
  const drawer = document.getElementById('notification-drawer');
  const backdrop = document.getElementById('notification-backdrop');
  const panel = document.getElementById('notification-panel');
  
  if (drawer.classList.contains('hidden')) {
    drawer.classList.remove('hidden');
    // Trigger reflow
    void drawer.offsetWidth;
    
    backdrop.classList.remove('opacity-0');
    panel.classList.remove('translate-x-full');
  } else {
    closeNotificationDrawer();
  }
}

function closeNotificationDrawer() {
  const drawer = document.getElementById('notification-drawer');
  const backdrop = document.getElementById('notification-backdrop');
  const panel = document.getElementById('notification-panel');
  
  backdrop.classList.add('opacity-0');
  panel.classList.add('translate-x-full');
  
  setTimeout(() => {
    drawer.classList.add('hidden');
  }, 300);
}

// ================= Settings Drawer Logic =================

function toggleSettingsDrawer() {
  const drawer = document.getElementById('settings-drawer');
  const backdrop = document.getElementById('settings-backdrop');
  const panel = document.getElementById('settings-panel');
  
  if (drawer.classList.contains('hidden')) {
    drawer.classList.remove('hidden');
    // Trigger reflow
    void drawer.offsetWidth;
    
    backdrop.classList.remove('opacity-0');
    panel.classList.remove('translate-x-full');
  } else {
    closeSettingsDrawer();
  }
}

function closeSettingsDrawer() {
  const drawer = document.getElementById('settings-drawer');
  const backdrop = document.getElementById('settings-backdrop');
  const panel = document.getElementById('settings-panel');
  
  backdrop.classList.add('opacity-0');
  panel.classList.add('translate-x-full');
  
  setTimeout(() => {
    drawer.classList.add('hidden');
  }, 300);
}

// 1. Theme
function setTheme(theme) {
    // Only light mode fully supported now, update UI selection
    const btnLight = document.getElementById('theme-light');
    const btnDark = document.getElementById('theme-dark');
    
    if (theme === 'light') {
        btnLight.classList.add('border-brand-500', 'bg-slate-50');
        btnLight.classList.remove('border-transparent', 'hover:border-slate-300');
        btnLight.querySelector('div.absolute').classList.remove('hidden');
        
        btnDark.classList.remove('border-brand-500');
        btnDark.classList.add('border-transparent', 'hover:border-slate-300');
        // Mocking dark mode disabled or "coming soon"
    } else {
        // Just for demo interaction
        // btnDark.classList.add('border-brand-500');
        // btnLight.classList.remove('border-brand-500');
        alert('暗黑模式正在开发中，敬请期待！');
    }
}

// 2. Layout
function setLayoutMode(mode) {
    const btnSidebar = document.getElementById('layout-sidebar');
    const btnTop = document.getElementById('layout-top');
    const checkIcon = '<div class="absolute top-2 right-2 w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center text-white text-[10px] shadow-sm"><i class="ri-check-line"></i></div>';
    
    // Remove checks
    const existingCheck = btnSidebar.querySelector('.absolute.top-2.right-2') || btnTop.querySelector('.absolute.top-2.right-2');
    if(existingCheck) existingCheck.remove();

    if (mode === 'sidebar') {
        btnSidebar.classList.add('border-brand-500', 'bg-slate-50');
        btnSidebar.classList.remove('border-transparent', 'hover:border-slate-300', 'bg-white');
        btnSidebar.insertAdjacentHTML('beforeend', checkIcon);
        
        btnTop.classList.remove('border-brand-500', 'bg-slate-50');
        btnTop.classList.add('border-transparent', 'hover:border-slate-300', 'bg-white');
        
        // Logic to switch layout (Mock)
        // document.getElementById('app-container').classList.remove('flex-col');
        // document.getElementById('sidebar').classList.remove('hidden');
    } else {
        btnTop.classList.add('border-brand-500', 'bg-slate-50');
        btnTop.classList.remove('border-transparent', 'hover:border-slate-300', 'bg-white');
        btnTop.insertAdjacentHTML('beforeend', checkIcon);
        
        btnSidebar.classList.remove('border-brand-500', 'bg-slate-50');
        btnSidebar.classList.add('border-transparent', 'hover:border-slate-300', 'bg-white');
        
        // Logic to switch layout (Mock)
        alert('上下布局模式需要调整整体DOM结构，当前为演示效果。');
    }
}

// 3. Content Width
function setContentWidth(width) {
    const btnFluid = document.getElementById('width-fluid');
    const btnFixed = document.getElementById('width-fixed');
    const mainContent = document.querySelector('main > div'); // Adjust selector based on actual structure

    if (width === 'fluid') {
        btnFluid.className = "flex-1 py-1.5 text-xs font-bold rounded shadow-sm bg-white text-slate-800 transition-all";
        btnFixed.className = "flex-1 py-1.5 text-xs font-bold rounded text-slate-500 hover:text-slate-700 transition-all";
        
        if(mainContent) mainContent.classList.remove('max-w-7xl', 'mx-auto');
    } else {
        btnFluid.className = "flex-1 py-1.5 text-xs font-bold rounded text-slate-500 hover:text-slate-700 transition-all";
        btnFixed.className = "flex-1 py-1.5 text-xs font-bold rounded shadow-sm bg-white text-slate-800 transition-all";
        
        if(mainContent) mainContent.classList.add('max-w-7xl', 'mx-auto');
    }
}

// 4. Font Size
function setFontSize(size) {
    const html = document.documentElement;
    const display = document.getElementById('font-size-display');
    
    // Reset base classes
    html.classList.remove('text-xs', 'text-sm', 'text-base', 'text-lg');
    
    let label = '标准 (14px)';
    if (size == 12) {
        html.style.fontSize = '14px'; // Tailwind base is usually 16px, setting root font size scales rem
        // But tailwind uses rem. 
        // Let's just update the display for demo, real implementation might involve scaling rem or specific classes
        label = '小 (12px)';
        // document.body.style.zoom = 0.9; 
    } else if (size == 14) {
        // document.body.style.zoom = 1;
        label = '标准 (14px)';
    } else if (size == 16) {
        // document.body.style.zoom = 1.1;
        label = '大 (16px)';
    } else {
        label = `自定义 (${size}px)`;
    }
    
    display.innerText = label;
}

// 5. Reset
function resetSettings() {
    setTheme('light');
    setLayoutMode('sidebar');
    setContentWidth('fluid');
    document.getElementById('font-size-slider').value = 14;
    setFontSize(14);
    
    alert('已恢复默认设置');
}
