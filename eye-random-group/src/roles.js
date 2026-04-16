
    /* ================= 角色管理逻辑 (Roles) ================= */
    
    // Current Logged-in User Role (Simulated)
    let currentUserRole = 'dev'; // Default to 'dev' for development. Can be changed to test other roles.

    const PERMISSION_CONFIG = {
        "项目管理": ["查看", "新增", "编辑", "删除", "导入", "导出"],
        "维度管理": ["查看", "新增", "编辑", "删除"],
        "科室管理": ["查看", "新增", "删除"],
        "中心管理": ["查看", "新增", "编辑", "删除"],
        "用户管理": ["查看", "新增", "编辑", "重置密码"],
        "角色管理": ["查看", "新增", "编辑", "分配权限"]
    };

    let ROLES = [
        { id: 'admin', name: '超级管理员', desc: '拥有系统所有功能的操作权限', perms: 'all' },
        { id: 'dev', name: '开发者', desc: '系统维护与开发人员', perms: 'all' },
        { id: 'center_admin', name: '中心管理员', desc: '负责管理分中心事务与人员', perms: { "项目管理": ["查看", "新增"], "中心管理": ["查看", "编辑"], "用户管理": ["查看", "新增"] } },
        { id: 'pi', name: '主要研究者 (PI)', desc: '负责项目临床研究执行与管理', perms: { "项目管理": ["查看", "编辑"], "维度管理": ["查看"], "用户管理": ["查看"] } },
        { id: 'crc', name: 'CRC 协调员', desc: '协助研究者进行非医学性事务', perms: { "项目管理": ["查看"], "用户管理": ["查看"] } },
        { id: 'manufacturer', name: '厂家', desc: '配置厂家角色的账号不能登录 Web Admin 系统，只能登录小程序，小程序拥有厂家面板。', perms: 'mobile_only' }
    ];

    let currentRoleId = 'admin';
    let currentViewMode = 'dev'; // 'dev' or 'admin'
    let isEditing = false;

    function renderRoleList() {
        const container = document.getElementById('role-list-container');
        if (!container) return;
        container.innerHTML = ROLES.map(role => `
            <div onclick="selectRole('${role.id}')" 
                 class="p-3 rounded-lg cursor-pointer transition-all ${role.id === currentRoleId ? 'bg-brand-50 border border-brand-100' : 'hover:bg-slate-50 border border-transparent'}">
                <div class="flex items-center justify-between mb-1">
                    <span class="font-bold text-sm ${role.id === currentRoleId ? 'text-brand-700' : 'text-slate-700'}">${role.name}</span>
                    ${role.perms === 'all' ? '<i class="ri-shield-star-line text-amber-500"></i>' : ''}
                    ${role.perms === 'mobile_only' ? '<i class="ri-smartphone-line text-indigo-500"></i>' : ''}
                </div>
                <p class="text-xs text-slate-400 truncate">${role.desc}</p>
            </div>
        `).join('');
        
        renderRolePermissions();
    }

    function selectRole(id) {
        currentRoleId = id;
        renderRoleList();
    }

    function toggleViewMode() {
        currentViewMode = currentViewMode === 'dev' ? 'admin' : 'dev';
        const toggleBtn = document.getElementById('view-mode-toggle');
        const createBtn = document.getElementById('btn-create-role');
        const saveBtn = document.getElementById('btn-save-role-perms');

        if (currentViewMode === 'dev') {
            toggleBtn.innerHTML = '<i class="ri-refresh-line"></i> <span>切换为超级管理员</span>';
            createBtn.classList.remove('hidden');
            saveBtn.classList.remove('hidden');
        } else {
            toggleBtn.innerHTML = '<i class="ri-refresh-line"></i> <span>切换为开发者</span>';
            createBtn.classList.add('hidden');
            saveBtn.classList.add('hidden');
            if (isEditing) toggleEditMode(); 
        }
        renderRolePermissions();
    }

    function toggleEditMode() {
        isEditing = !isEditing;
        const btn = document.getElementById('btn-save-role-perms');
        
        if (isEditing) {
            btn.innerText = '保存编辑配置';
            btn.classList.add('bg-emerald-600', 'hover:bg-emerald-700', 'shadow-emerald-500/30');
            btn.classList.remove('bg-brand-600', 'hover:bg-brand-700', 'shadow-brand-500/30');
        } else {
            alert("角色权限编辑成功！");
            btn.innerText = '编辑权限配置';
            btn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700', 'shadow-emerald-500/30');
            btn.classList.add('bg-brand-600', 'hover:bg-brand-700', 'shadow-brand-500/30');
        }
        renderRolePermissions();
    }

    function renderRolePermissions() {
        const role = ROLES.find(r => r.id === currentRoleId);
        if (!role) return;

        document.getElementById('current-role-name').innerText = role.name;
        const container = document.getElementById('role-permission-container');
        
        if (role.perms === 'all') {
            container.innerHTML = `
                <div class="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <div class="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="ri-shield-star-line text-3xl text-amber-500"></i>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800 mb-2">最高权限账户</h3>
                    <p class="text-slate-500 text-sm">当前角色拥有系统的所有操作权限，无需单独配置。</p>
                </div>
            `;
            return;
        }

        if (role.perms === 'mobile_only') {
            container.innerHTML = `
                <div class="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <div class="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="ri-smartphone-line text-3xl text-indigo-500"></i>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800 mb-2">仅限移动端登录</h3>
                    <p class="text-slate-500 text-sm">此角色专用于厂家在小程序端查看数据。</p>
                    <p class="text-slate-400 text-xs mt-2">Web 管理后台无访问权限。</p>
                </div>
            `;
            return;
        }

        let html = '';
        for (const [module, actions] of Object.entries(PERMISSION_CONFIG)) {
            const userPerms = role.perms[module] || [];
            
            html += `
                <div>
                    <h4 class="font-bold text-slate-700 mb-3 flex items-center">
                        <span class="w-1 h-4 bg-brand-500 rounded-full mr-2"></span>
                        ${module}
                    </h4>
            `;

            if (currentViewMode === 'admin') {
                if (userPerms.length === 0) {
                    html += `<p class="text-sm text-slate-400 italic">无权限</p>`;
                } else {
                    html += `<div class="flex flex-wrap gap-2">`;
                    html += actions.filter(a => userPerms.includes(a)).map(action => `
                        <span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">${action}</span>
                    `).join('');
                    html += `</div>`;
                }
            } else {
                html += `<div class="grid grid-cols-2 md:grid-cols-4 gap-3">`;
                html += actions.map(action => {
                    const isChecked = userPerms.includes(action);
                    const isDisabled = !isEditing;
                    
                    return `
                        <label class="flex items-center p-2 rounded border ${isChecked ? 'bg-brand-50 border-brand-200' : 'bg-white border-slate-200'} ${isDisabled ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}">
                            <input type="checkbox" class="rounded text-brand-600 focus:ring-brand-500 border-slate-300 mr-2" 
                                ${isChecked ? 'checked' : ''} 
                                ${isDisabled ? 'disabled' : ''}
                                onchange="updateRolePerm('${module}', '${action}', this.checked)">
                            <span class="text-sm ${isChecked ? 'text-brand-700 font-medium' : 'text-slate-600'}">${action}</span>
                        </label>
                    `;
                }).join('');
                html += `</div>`;
            }
            
            html += `</div>`;
        }
        container.innerHTML = html;
    }

    function updateRolePerm(module, action, checked) {
        const role = ROLES.find(r => r.id === currentRoleId);
        if (role.perms === 'all' || role.perms === 'mobile_only') return;
        
        if (!role.perms[module]) role.perms[module] = [];
        
        if (checked) {
            if (!role.perms[module].includes(action)) role.perms[module].push(action);
        } else {
            role.perms[module] = role.perms[module].filter(a => a !== action);
        }
        
        renderRolePermissions();
    }

    /* ================= 新增角色抽屉逻辑 ================= */
    function openAddRoleDrawer() {
        const drawer = document.getElementById('add-role-drawer');
        const backdrop = document.getElementById('add-role-backdrop');
        const panel = document.getElementById('add-role-panel');
        
        drawer.classList.remove('hidden');
        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
            panel.classList.remove('translate-x-full');
        }, 10);

        document.getElementById('new-role-name').value = '';
        document.getElementById('new-role-desc').value = '';
        renderNewRolePerms();
    }

    function closeAddRoleDrawer() {
        const drawer = document.getElementById('add-role-drawer');
        const backdrop = document.getElementById('add-role-backdrop');
        const panel = document.getElementById('add-role-panel');
        
        backdrop.classList.add('opacity-0');
        panel.classList.add('translate-x-full');
        setTimeout(() => drawer.classList.add('hidden'), 300);
    }

    function renderNewRolePerms() {
        const container = document.getElementById('new-role-perm-list');
        let html = '';
        for (const [module, actions] of Object.entries(PERMISSION_CONFIG)) {
            html += `
                <div class="border border-slate-200 rounded-lg p-3">
                    <div class="flex items-center justify-between mb-2">
                        <span class="font-bold text-slate-700 text-sm">${module}</span>
                        <label class="text-xs text-brand-600 cursor-pointer hover:underline">
                            <input type="checkbox" class="hidden" onchange="toggleAllNewRolePerm('${module}', this.checked)"> 全选
                        </label>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        ${actions.map(action => `
                            <label class="flex items-center bg-slate-50 px-2 py-1 rounded border border-slate-200 hover:border-brand-300 cursor-pointer">
                                <input type="checkbox" name="new-role-perm" data-module="${module}" value="${action}" class="rounded text-brand-600 focus:ring-brand-500 border-slate-300 mr-1.5">
                                <span class="text-xs text-slate-600">${action}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        container.innerHTML = html;
    }

    function toggleAllNewRolePerm(module, checked) {
        const inputs = document.querySelectorAll(`input[name="new-role-perm"][data-module="${module}"]`);
        inputs.forEach(input => input.checked = checked);
    }

    function saveNewRole() {
        const name = document.getElementById('new-role-name').value.trim();
        const desc = document.getElementById('new-role-desc').value.trim();
        if (!name) { alert("请输入角色名称"); return; }
        
        const perms = {};
        document.querySelectorAll('input[name="new-role-perm"]:checked').forEach(input => {
            const module = input.getAttribute('data-module');
            const action = input.value;
            if (!perms[module]) perms[module] = [];
            perms[module].push(action);
        });

        const newId = 'role_' + Date.now();
        ROLES.push({
            id: newId,
            name: name,
            desc: desc || '自定义新角色',
            perms: perms
        });

        closeAddRoleDrawer();
        if (document.getElementById('view-roles').classList.contains('hidden') === false) {
            renderRoleList();
            selectRole(newId);
        }
        alert("新角色创建成功！");
    }

    // ================= Global Permission Logic =================
    function updateGlobalButtonPermissions() {
        const createBtn = document.getElementById('btn-create-project');
        if (createBtn) {
            // Check permissions based on currentUserRole
            const role = ROLES.find(r => r.id === currentUserRole);
            let canCreate = false;
            if (role) {
                if (role.perms === 'all') canCreate = true;
                else if (role.perms["项目管理"] && role.perms["项目管理"].includes("新增")) canCreate = true;
            }
            
            if (canCreate) createBtn.classList.remove('hidden');
            else createBtn.classList.add('hidden');
        }
    }

    // Initialize Permissions
    updateGlobalButtonPermissions();
