
    /* ================= 用户管理逻辑 ================= */
    let passwordRule = "random";
    let fixedPassword = "Pass1234!";

    function generateRandomPassword(length) {
      const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const lower = "abcdefghijklmnopqrstuvwxyz";
      const digits = "0123456789";
      const special = "!@#$%^&*()_+[]{}";
      const all = upper + lower + digits + special;

      let result = "";
      result += upper[Math.floor(Math.random() * upper.length)];
      result += lower[Math.floor(Math.random() * lower.length)];
      result += digits[Math.floor(Math.random() * digits.length)];
      result += special[Math.floor(Math.random() * special.length)];

      for (let i = result.length; i < length; i++) {
        result += all[Math.floor(Math.random() * all.length)];
      }

      return result
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
    }

    function getDefaultPassword() {
      if (passwordRule === "fixed") {
        return fixedPassword;
      }
      return generateRandomPassword(12);
    }

    function openUserDrawer() {
      const drawer = document.getElementById("user-drawer");
      const backdrop = document.getElementById("user-backdrop");
      const panel = document.getElementById("user-panel");

      drawer.classList.remove("hidden");
      setTimeout(() => {
        backdrop.classList.remove("opacity-0");
        panel.classList.remove("translate-x-full");
      }, 10);

      document.getElementById("user-name-input").value = "";
      document.getElementById("user-account-input").value = "";
      document.getElementById("user-phone-input").value = "";
      document.getElementById("user-org-input").value = "";
      document.getElementById("user-role-input").value = "系统管理员";
      document.getElementById("user-password-input").value = getDefaultPassword();
    }

    function closeUserDrawer() {
      const drawer = document.getElementById("user-drawer");
      const backdrop = document.getElementById("user-backdrop");
      const panel = document.getElementById("user-panel");

      backdrop.classList.add("opacity-0");
      panel.classList.add("translate-x-full");

      setTimeout(() => {
        drawer.classList.add("hidden");
      }, 300);
    }

    function submitNewUser() {
      closeUserDrawer();
      alert("已创建新用户，并自动生成初始密码。");
    }

    function openPasswordRuleModal() {
      const modal = document.getElementById("password-rule-modal");
      const fixedRow = document.getElementById("fixed-password-row");
      const randomRadio = document.getElementById("password-rule-random");
      const fixedRadio = document.getElementById("password-rule-fixed");
      const input = document.getElementById("fixed-password-input");
      const hint = document.getElementById("password-rule-hint");

      if (passwordRule === "fixed") {
        fixedRadio.checked = true;
        fixedRow.classList.remove("hidden");
        input.value = fixedPassword;
        if (hint) {
          hint.textContent = "后续新增用户将统一使用此固定密码。";
        }
      } else {
        randomRadio.checked = true;
        fixedRow.classList.add("hidden");
        if (hint) {
          hint.textContent = "默认生成 12 位密码，包含大小写字母和特殊字符。";
        }
      }

      modal.classList.remove("hidden");
      modal.classList.add("flex");
    }

    function closePasswordRuleModal() {
      const modal = document.getElementById("password-rule-modal");
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }

    function savePasswordRuleConfig() {
      const randomRadio = document.getElementById("password-rule-random");
      const fixedRadio = document.getElementById("password-rule-fixed");
      const input = document.getElementById("fixed-password-input");
      const fixedRow = document.getElementById("fixed-password-row");

      if (fixedRadio.checked) {
        const value = input.value.trim();
        if (!value) {
          alert("请设置固定密码内容");
          fixedRow.classList.remove("hidden");
          return;
        }
        passwordRule = "fixed";
        fixedPassword = value;
      } else if (randomRadio.checked) {
        passwordRule = "random";
      }

      closePasswordRuleModal();
      alert("密码规则已更新，将应用于后续新增用户。");
    }

    document.addEventListener("change", function (e) {
      if (e.target && e.target.name === "password-rule") {
        const fixedRow = document.getElementById("fixed-password-row");
        const hint = document.getElementById("password-rule-hint");
        if (e.target.value === "fixed") {
          if (fixedRow) {
            fixedRow.classList.remove("hidden");
          }
          if (hint) {
            hint.textContent = "后续新增用户将统一使用此固定密码。";
          }
        } else {
          if (fixedRow) {
            fixedRow.classList.add("hidden");
          }
          if (hint) {
            hint.textContent = "默认生成 12 位密码，包含大小写字母和特殊字符。";
          }
        }
      }
    });

    function resetUserFilters() {
      document.getElementById("user-filter-org").value = "";
      document.getElementById("user-filter-name").value = "";
      document.getElementById("user-filter-phone").value = "";
      applyUserFilters();
    }

    function applyUserFilters() {
      const org = document.getElementById("user-filter-org").value.trim();
      const name = document.getElementById("user-filter-name").value.trim();
      const phone = document.getElementById("user-filter-phone").value.trim();

      const rows = document.querySelectorAll("#user-table-body tr");
      rows.forEach((row) => {
        const rowOrg = row.getAttribute("data-org") || "";
        const rowName = row.getAttribute("data-name") || "";
        const rowPhone = row.getAttribute("data-phone") || "";

        let visible = true;
        if (org && rowOrg.indexOf(org) === -1) {
          visible = false;
        }
        if (name && rowName.indexOf(name) === -1) {
          visible = false;
        }
        if (phone && rowPhone.indexOf(phone) === -1) {
          visible = false;
        }

        row.style.display = visible ? "" : "none";
      });
    }

    function toggleUserDropdown() {
      const dropdown = document.getElementById('user-dropdown');
      dropdown.classList.toggle('hidden');
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
      const dropdown = document.getElementById('user-dropdown');
      const profileTrigger = dropdown.previousElementSibling; // The profile div
      
      if (!dropdown.classList.contains('hidden') && 
          !dropdown.contains(event.target) && 
          profileTrigger &&
          !profileTrigger.contains(event.target)) {
        dropdown.classList.add('hidden');
      }
    });
