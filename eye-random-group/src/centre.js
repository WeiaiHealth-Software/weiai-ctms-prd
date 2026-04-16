let SELECTED_CENTERS = [];

const DOCTOR_DATA = {
  "徐州眼视光中心": ["王强", "李敏", "赵林"],
  "上海眼科中心": ["陈洁", "周宁", "黄俊"],
  "北京同仁医院": ["吴海", "孙越", "刘磊"]
};

const CRC_DATA = {
  "徐州眼视光中心": ["张玲", "高越"],
  "上海眼科中心": ["林慧", "周倩"],
  "北京同仁医院": ["李娜", "王珂"]
};

function openCenterDetail() {
  hideAllViews();
  document.getElementById("view-center-detail").classList.remove("hidden");
  document.getElementById("nav-centers").classList.add("active", "bg-brand-50", "text-brand-600");
  
  updateHeader({ title: "中心详情" });
  window.scrollTo(0, 0);
  
  // Default to overview tab
  switchCenterTab('overview');
}

function backToCenters() {
  switchTab("centers");
}

function switchCenterTab(tabName) {
    const overviewTab = document.getElementById('tab-center-overview');
    const deptsTab = document.getElementById('tab-center-depts');
    const overviewContent = document.getElementById('content-center-overview');
    const deptsContent = document.getElementById('content-center-depts');
    const crcTab = document.getElementById('tab-center-crc');
    const crcContent = document.getElementById('content-center-crc');

    if (tabName === 'overview') {
        // Activate Overview
        overviewTab.classList.add('text-brand-600', 'border-b-2', 'border-brand-600', 'bg-brand-50/50');
        overviewTab.classList.remove('text-slate-500', 'hover:text-slate-700');
        
        deptsTab.classList.remove('text-brand-600', 'border-b-2', 'border-brand-600', 'bg-brand-50/50');
        deptsTab.classList.add('text-slate-500', 'hover:text-slate-700');
        
        crcTab.classList.remove('text-brand-600', 'border-b-2', 'border-brand-600', 'bg-brand-50/50');
        crcTab.classList.add('text-slate-500', 'hover:text-slate-700');

        overviewContent.classList.remove('hidden');
        crcContent.classList.add('hidden');
        deptsContent.classList.add('hidden');
    } else if (tabName === 'depts') {
        // Activate Depts
        deptsTab.classList.add('text-brand-600', 'border-b-2', 'border-brand-600', 'bg-brand-50/50');
        deptsTab.classList.remove('text-slate-500', 'hover:text-slate-700');

        overviewTab.classList.remove('text-brand-600', 'border-b-2', 'border-brand-600', 'bg-brand-50/50');
        overviewTab.classList.add('text-slate-500', 'hover:text-slate-700');

        crcTab.classList.remove('text-brand-600', 'border-b-2', 'border-brand-600', 'bg-brand-50/50');
        crcTab.classList.add('text-slate-500', 'hover:text-slate-700');

        overviewContent.classList.add('hidden');
        crcContent.classList.add('hidden');
        deptsContent.classList.remove('hidden');
    } else if (tabName === 'crc') {
        // Activate CRC
        crcTab.classList.add('text-brand-600', 'border-b-2', 'border-brand-600', 'bg-brand-50/50');
        crcTab.classList.remove('text-slate-500', 'hover:text-slate-700');

        overviewTab.classList.remove('text-brand-600', 'border-b-2', 'border-brand-600', 'bg-brand-50/50');
        overviewTab.classList.add('text-slate-500', 'hover:text-slate-700');

        deptsTab.classList.remove('text-brand-600', 'border-b-2', 'border-brand-600', 'bg-brand-50/50');
        deptsTab.classList.add('text-slate-500', 'hover:text-slate-700');

        overviewContent.classList.add('hidden');
        deptsContent.classList.add('hidden');
        crcContent.classList.remove('hidden');
    }
}
