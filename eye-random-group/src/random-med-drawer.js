
/* ================= 随机号/产品号清单 Drawer Logic ================= */

let currentMedStage = 1;

function openRandomMedDrawer(type) {
  const drawer = document.getElementById('random-med-drawer');
  const backdrop = document.getElementById('random-med-backdrop');
  const panel = document.getElementById('random-med-panel');
  const title = document.getElementById('random-med-title');
  const content = document.getElementById('random-med-content');

  // Update Title
  title.innerText = type === 'random' ? '随机号清单' : '产品号清单';
  
  // Check Project Type for Fission features
  const isFission = (typeof window.currentProjectType !== 'undefined' && window.currentProjectType === 'FISSION');
  
  // Inject Toggle if Fission Project and Type is Med
  const headerContainer = title.parentElement;
  let toggleContainer = document.getElementById('med-stage-toggle');
  
  if (type === 'med' && isFission) {
      if (!toggleContainer) {
          toggleContainer = document.createElement('div');
          toggleContainer.id = 'med-stage-toggle';
          toggleContainer.className = "mt-2 flex bg-slate-100 p-1 rounded-lg w-fit";
          toggleContainer.innerHTML = `
            <button onclick="switchMedStage(1)" id="btn-med-stage-1" class="px-3 py-1 text-xs font-bold rounded-md shadow-sm bg-white text-indigo-600 transition-all">裂变前 (Stage 1)</button>
            <button onclick="switchMedStage(2)" id="btn-med-stage-2" class="px-3 py-1 text-xs font-bold rounded-md text-slate-500 hover:text-slate-700 transition-all">裂变后 (Stage 2)</button>
          `;
          headerContainer.appendChild(toggleContainer);
      } else {
          toggleContainer.classList.remove('hidden');
      }
      // Reset to Stage 1
      switchMedStage(1); 
  } else {
      if (toggleContainer) toggleContainer.classList.add('hidden');
      currentMedStage = 1; // Default
  }

  // Generate and Render Content
  renderRandomMedList(type, content);

  // Show Drawer
  drawer.classList.remove('hidden');
  setTimeout(() => {
    backdrop.classList.remove('opacity-0');
    panel.classList.remove('translate-x-full');
  }, 10);
}

function switchMedStage(stage) {
    currentMedStage = stage;
    
    // Update UI
    const btn1 = document.getElementById('btn-med-stage-1');
    const btn2 = document.getElementById('btn-med-stage-2');
    
    if (stage === 1) {
        btn1.className = "px-3 py-1 text-xs font-bold rounded-md shadow-sm bg-white text-indigo-600 transition-all";
        btn2.className = "px-3 py-1 text-xs font-bold rounded-md text-slate-500 hover:text-slate-700 transition-all";
    } else {
        btn1.className = "px-3 py-1 text-xs font-bold rounded-md text-slate-500 hover:text-slate-700 transition-all";
        btn2.className = "px-3 py-1 text-xs font-bold rounded-md shadow-sm bg-white text-indigo-600 transition-all";
    }
    
    // Re-render list
    const content = document.getElementById('random-med-content');
    renderRandomMedList('med', content);
}

function closeRandomMedDrawer() {
  const drawer = document.getElementById('random-med-drawer');
  const backdrop = document.getElementById('random-med-backdrop');
  const panel = document.getElementById('random-med-panel');

  backdrop.classList.add('opacity-0');
  panel.classList.add('translate-x-full');

  setTimeout(() => {
    drawer.classList.add('hidden');
  }, 300);
}

function renderRandomMedList(type, container) {
  // Mock Data Generation
  // Assuming 2 Groups: Experiment (24/50 used), Control (26/50 used)
  // Total 100 items pre-generated

  const isStage2 = (type === 'med' && currentMedStage === 2);
  
  const groups = [
    {
      id: 'exp',
      name: '实验组 (高频)',
      color: 'indigo',
      total: 50,
      used: 24,
      prefix: type === 'random' ? 'R-' : (isStage2 ? 'D-S2-' : 'D-'), // R for Random, D for Drug
      start: isStage2 ? 8001 : 1001 // Different range for Stage 2
    },
    ...(isStage2 ? [
        {
          id: 'ctrl_f1',
          name: '对照组裂变1组',
          color: 'emerald',
          total: 25,
          used: 10,
          prefix: type === 'random' ? 'R-' : 'D-S2-',
          start: 9001
        },
        {
          id: 'ctrl_f2',
          name: '对照组裂变2组',
          color: 'emerald',
          total: 25,
          used: 16,
          prefix: type === 'random' ? 'R-' : 'D-S2-',
          start: 9026
        }
    ] : [
        {
          id: 'ctrl',
          name: '对照组 (低频)',
          color: 'emerald',
          total: 50,
          used: 26,
          prefix: type === 'random' ? 'R-' : 'D-',
          start: 2001
        }
    ])
  ];

  let html = `<div class="space-y-8 animate-fade-in">`;

  groups.forEach(g => {
    // Generate items for this group
    let itemsHtml = '';
    for (let i = 0; i < g.total; i++) {
      const isUsed = i < g.used;
      const num = g.prefix + (g.start + i);
      
      const styleClass = isUsed 
        ? "text-slate-300 line-through bg-slate-50 border-slate-100" 
        : `text-slate-700 font-mono font-medium bg-white border-slate-200 hover:border-${g.color}-300 hover:text-${g.color}-600 cursor-default`;

      itemsHtml += `
        <div class="px-3 py-2 rounded border text-center text-sm transition-colors ${styleClass}">
          ${num}
        </div>
      `;
    }

    // Card Header color
    const headerColor = g.color === 'indigo' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100';

    html += `
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-100 flex justify-between items-center ${headerColor}">
          <h4 class="font-bold">${g.name}</h4>
          <span class="text-xs font-bold bg-white/60 px-2 py-0.5 rounded border border-white/50">
            ${g.used} / ${g.total} 已分配
          </span>
        </div>
        <div class="p-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
          ${itemsHtml}
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}

function exportListToCSV() {
  const title = document.getElementById('random-med-title').innerText;
  const isRandom = title.includes('随机号');
  const type = isRandom ? 'random' : 'med';
  const isStage2 = (type === 'med' && currentMedStage === 2);
  
  // Reuse generation logic or get from DOM? 
  // Better to reuse generation logic for cleaner data.
  // Mock Data (same as render)
  const groups = [
    {
      id: 'exp',
      name: '实验组 (高频)',
      total: 50,
      prefix: type === 'random' ? 'R-' : (isStage2 ? 'D-S2-' : 'D-'),
      start: isStage2 ? 8001 : 1001
    },
    ...(isStage2 ? [
        {
          id: 'ctrl_f1',
          name: '对照组裂变1组',
          total: 25,
          prefix: type === 'random' ? 'R-' : 'D-S2-C1-',
          start: 9001
        },
        {
          id: 'ctrl_f2',
          name: '对照组裂变2组',
          total: 25,
          prefix: type === 'random' ? 'R-' : 'D-S2-C2-',
          start: 9026
        }
    ] : [
        {
          id: 'ctrl',
          name: '对照组 (低频)',
          total: 50,
          prefix: type === 'random' ? 'R-' : 'D-',
          start: 2001
        }
    ])
  ];

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "分组名称,编号,状态\n"; // Header

  groups.forEach(g => {
    for (let i = 0; i < g.total; i++) {
        const num = g.prefix + (g.start + i);
        // Mocking 'used' status logic again roughly (24 for exp, 26 for ctrl)
        const usedCount = g.id === 'exp' ? 24 : 26;
        const status = i < usedCount ? "已分配" : "未分配";
        csvContent += `${g.name},${num},${status}\n`;
    }
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  const stageSuffix = (type === 'med' && typeof window.currentProjectType !== 'undefined' && window.currentProjectType === 'FISSION') 
        ? (currentMedStage === 1 ? '_Stage1' : '_Stage2') 
        : '';
  const filename = isRandom ? "随机号清单.csv" : `产品号清单${stageSuffix}.csv`;
  link.setAttribute("download", filename);
  document.body.appendChild(link); // Required for FF
  
  // Show alert before download
  alert(`即将下载 ${filename} 到本地...`);
  
  link.click();
  document.body.removeChild(link);
}
