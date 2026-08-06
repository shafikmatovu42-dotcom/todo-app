// UP Corporations - Interactive Client-Side Application Logic

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initSimulator();
  initRoiCalculator();
  initPosDemo();
  initContactForm();
  initApiKeyCopy();
  initSmoothScroll();
  initAuthSystem();
});

/* 1. Real-Time System Clock (Matches UPShop Enterprise Header) */
function initLiveClock() {
  const clockElements = document.querySelectorAll('.live-clock');
  if (!clockElements.length) return;

  function updateClock() {
    const now = new Date();
    const optionsDate = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };

    const dateStr = now.toLocaleDateString('en-US', optionsDate);
    const timeStr = now.toLocaleTimeString('en-US', optionsTime);
    const fullFormatted = `${dateStr} | ${timeStr}`;

    clockElements.forEach(el => {
      el.textContent = fullFormatted;
    });
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* 2. Interactive Software Simulator Tabs */
function initSimulator() {
  const tabs = document.querySelectorAll('.sim-tab');
  const views = document.querySelectorAll('.sim-view');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetViewId = tab.getAttribute('data-tab');

      // Deactivate all
      tabs.forEach(t => t.classList.remove('active'));
      views.forEach(v => v.classList.remove('active'));

      // Activate clicked
      tab.classList.add('active');
      const targetView = document.getElementById(`view-${targetViewId}`);
      if (targetView) {
        targetView.classList.add('active');
      }
    });
  });
}

/* 3. Interactive ROI & Business Efficiency Calculator */
function initRoiCalculator() {
  const txSlider = document.getElementById('calc-transactions');
  const outletsSlider = document.getElementById('calc-outlets');
  const staffSlider = document.getElementById('calc-staff');

  const txVal = document.getElementById('val-transactions');
  const outletsVal = document.getElementById('val-outlets');
  const staffVal = document.getElementById('val-staff');

  const hoursSavedEl = document.getElementById('roi-hours-saved');
  const revGrowthEl = document.getElementById('roi-rev-growth');
  const efficiencyEl = document.getElementById('roi-efficiency');

  if (!txSlider || !outletsSlider || !staffSlider) return;

  function recalculate() {
    const tx = parseInt(txSlider.value, 10);
    const outlets = parseInt(outletsSlider.value, 10);
    const staff = parseInt(staffSlider.value, 10);

    txVal.textContent = tx.toLocaleString();
    outletsVal.textContent = outlets;
    staffVal.textContent = staff;

    // Mathematical model for efficiency gain with UPShop Enterprise
    const hoursSaved = Math.round((tx * 0.08 + staff * 12) * outlets);
    const revGrowth = Math.round((tx * 2.5 * outlets * 30));
    const efficiencyPct = Math.min(98, Math.round(45 + (outlets * 5) + (tx / 50)));

    hoursSavedEl.textContent = `${hoursSaved} hrs/mo`;
    revGrowthEl.textContent = `$${revGrowth.toLocaleString()}`;
    efficiencyEl.textContent = `+${efficiencyPct}%`;
  }

  txSlider.addEventListener('input', recalculate);
  outletsSlider.addEventListener('input', recalculate);
  staffSlider.addEventListener('input', recalculate);

  recalculate();
}

/* 4. POS Interactive Terminal Demo (Inside Simulator) */
function initPosDemo() {
  const items = [
    { id: 1, name: 'EnterprisePOS License', price: 450, code: 'SKU-101' },
    { id: 2, name: 'Cloud Sync Hardware Module', price: 120, code: 'SKU-102' },
    { id: 3, name: 'Thermal Receipt Printer', price: 85, code: 'SKU-103' },
    { id: 4, name: 'Barcode Scanner Pro', price: 65, code: 'SKU-104' }
  ];

  let cart = [
    { id: 1, name: 'EnterprisePOS License', price: 450, qty: 1 }
  ];

  const posItemsContainer = document.getElementById('pos-items-grid');
  const cartTableBody = document.getElementById('pos-cart-body');
  const cartSubtotalEl = document.getElementById('pos-subtotal');
  const checkoutBtn = document.getElementById('pos-checkout-btn');

  if (!posItemsContainer || !cartTableBody) return;

  function renderPosItems() {
    posItemsContainer.innerHTML = items.map(item => `
      <div class="pos-item-card" onclick="window.addPosItem(${item.id})">
        <div style="font-weight:700; color:#f8fafc;">${item.name}</div>
        <div style="font-size:0.8rem; color:#94a3b8;">${item.code}</div>
        <div style="font-size:0.9rem; font-weight:700; color:#38bdf8; margin-top:0.3rem;">$${item.price}.00</div>
      </div>
    `).join('');
  }

  function renderCart() {
    if (cart.length === 0) {
      cartTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#64748b; padding:1rem;">Cart is empty</td></tr>`;
      cartSubtotalEl.textContent = '$0.00';
      return;
    }

    let subtotal = 0;
    cartTableBody.innerHTML = cart.map(item => {
      const itemTotal = item.price * item.qty;
      subtotal += itemTotal;
      return `
        <tr>
          <td style="padding:0.5rem 0; color:#e2e8f0; font-size:0.85rem;">${item.name}</td>
          <td style="padding:0.5rem 0; color:#94a3b8; font-size:0.85rem;">x${item.qty}</td>
          <td style="padding:0.5rem 0; color:#38bdf8; font-weight:600; font-size:0.85rem;">$${itemTotal}</td>
          <td style="padding:0.5rem 0; text-align:right;">
            <button onclick="window.removePosItem(${item.id})" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:0.8rem;">✕</button>
          </td>
        </tr>
      `;
    }).join('');

    cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  }

  window.addPosItem = function(id) {
    const existing = cart.find(c => c.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      const item = items.find(i => i.id === id);
      if (item) {
        cart.push({ ...item, qty: 1 });
      }
    }
    renderCart();
  };

  window.removePosItem = function(id) {
    cart = cart.filter(c => c.id !== id);
    renderCart();
  };

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your POS cart is empty!');
        return;
      }
      showToast('POS Transaction Processed Successfully! Receipt Generated.');
      cart = [];
      renderCart();
    });
  }

  renderPosItems();
  renderCart();
}

/* 5. Contact Form Handler & Toast Notifications */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;

      showToast(`Thank you, ${name}! Your inquiry has been dispatched to UP Corporations.`);
      contactForm.reset();
    });
  }
}

function showToast(message) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div style="width:24px; height:24px; border-radius:50%; background:#10b981; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:0.8rem;">✓</div>
    <div>${message}</div>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 50);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* 6. Smooth Scroll for Nav Links */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* 7. API Key Clipboard Copy Handler */
function initApiKeyCopy() {
  const copyBtn = document.getElementById('copy-api-key-btn');
  const inputEl = document.getElementById('api-key-input');

  if (!copyBtn || !inputEl) return;

  copyBtn.addEventListener('click', () => {
    const key = inputEl.value;
    if (key.includes('Log in as Admin') || key.includes('No active API keys')) {
      showToast('Please Sign In as Admin to configure & copy active API keys.');
      openModal('auth-modal');
      return;
    }

    navigator.clipboard.writeText(key).then(() => {
      showToast('API Key copied to clipboard! Ready to paste in UPshop settings.');
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '✓ Copied!';
      copyBtn.style.background = '#059669';
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.background = '';
      }, 2500);
    }).catch(() => {
      inputEl.select();
      document.execCommand('copy');
      showToast('API Key copied to clipboard!');
    });
  });
}

/* ==========================================================================
   8. Web Application State, Authentication & Admin API Key Vault
   ========================================================================== */

function getStoredUsers() {
  const users = localStorage.getItem('up_app_users');
  if (users) return JSON.parse(users);

  const defaultUsers = [
    { id: 'u1', name: 'System Admin', email: 'admin@upcorp.com', password: 'admin123', role: 'admin', joinedAt: '2026-08-01' },
    { id: 'u2', name: 'Enterprise Client', email: 'customer@upcorp.com', password: 'customer123', role: 'customer', joinedAt: '2026-08-05' }
  ];
  localStorage.setItem('up_app_users', JSON.stringify(defaultUsers));
  return defaultUsers;
}

function getCurrentUser() {
  const user = localStorage.getItem('up_current_user');
  return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('up_current_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('up_current_user');
  }
  updateNavAuthUI();
  syncPublicApiKeyDisplay();
}

function getStoredApiKeys() {
  const keys = localStorage.getItem('up_api_keys');
  if (keys) return JSON.parse(keys);

  const defaultKeys = [
    { id: 'k1', name: 'JAHWI Gemini AI Key', provider: 'Google Cloud Engine', value: 'KEY_VAULT_GEMINI_V2_PRO_AUTHENTICATED', active: true, createdAt: '2026-08-06' }
  ];
  localStorage.setItem('up_api_keys', JSON.stringify(defaultKeys));
  return defaultKeys;
}

function saveStoredApiKeys(keys) {
  localStorage.setItem('up_api_keys', JSON.stringify(keys));
  renderAdminApiVault();
  syncPublicApiKeyDisplay();
}

function syncPublicApiKeyDisplay() {
  const inputEl = document.getElementById('api-key-input');
  const statusText = document.getElementById('public-api-status-text');
  if (!inputEl) return;

  const keys = getStoredApiKeys();
  const activeKey = keys.find(k => k.active);

  if (activeKey) {
    inputEl.value = activeKey.value;
    if (statusText) statusText.textContent = `API Status: Active (${activeKey.name})`;
  } else {
    inputEl.value = 'No active API keys configured in Admin Vault';
    if (statusText) statusText.textContent = 'API Status: Vault Empty';
  }
}

// Modal Helpers
function openModal(id) {
  closeAllModals();
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
}

function updateNavAuthUI() {
  const navActions = document.getElementById('user-auth-nav');
  if (!navActions) return;

  const user = getCurrentUser();

  if (user) {
    const isAdmin = user.role === 'admin';
    navActions.innerHTML = `
      <div class="status-badge">
        <div class="pulse-dot"></div>
        <span>Systems Online</span>
      </div>
      <div class="dash-user-badge" id="open-my-dashboard-btn">
        <div class="user-avatar ${isAdmin ? 'admin-badge-icon' : ''}">
          ${isAdmin ? '👑' : '👤'}
        </div>
        <span style="font-size:0.88rem; font-weight:600; color:white;">${user.name || user.email}</span>
        <span style="font-size:0.75rem; color:${isAdmin ? '#f59e0b' : '#38bdf8'}; font-weight:700; text-transform:uppercase;">[${user.role}]</span>
      </div>
    `;

    document.getElementById('open-my-dashboard-btn').addEventListener('click', () => {
      if (user.role === 'admin') {
        openAdminDashboard();
      } else {
        openCustomerDashboard();
      }
    });
  } else {
    navActions.innerHTML = `
      <div class="status-badge">
        <div class="pulse-dot"></div>
        <span>Systems Online</span>
      </div>
      <button id="nav-signin-btn" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.88rem;">
        Sign In
      </button>
      <button id="nav-signup-btn" class="btn btn-primary" style="padding: 0.5rem 1.1rem; font-size: 0.88rem;">
        Sign Up
      </button>
    `;

    document.getElementById('nav-signin-btn').addEventListener('click', () => openAuthModal('signin'));
    document.getElementById('nav-signup-btn').addEventListener('click', () => openAuthModal('signup'));
  }
}

// Authentication Modal Logic
let currentAuthMode = 'signin'; // 'signin' or 'signup'
let selectedRole = 'customer';  // 'customer' or 'admin'

function openAuthModal(mode = 'signin') {
  currentAuthMode = mode;
  const tabSignin = document.getElementById('tab-signin-btn');
  const tabSignup = document.getElementById('tab-signup-btn');
  const fullnameGroup = document.getElementById('signup-fullname-group');
  const submitBtn = document.getElementById('auth-submit-btn');

  if (mode === 'signup') {
    tabSignin.classList.remove('active');
    tabSignup.classList.add('active');
    fullnameGroup.style.display = 'block';
    submitBtn.textContent = 'Create New Account';
  } else {
    tabSignup.classList.remove('active');
    tabSignin.classList.add('active');
    fullnameGroup.style.display = 'none';
    submitBtn.textContent = 'Sign In to Account';
  }

  openModal('auth-modal');
}

function initAuthSystem() {
  getStoredUsers();
  getStoredApiKeys();
  updateNavAuthUI();
  syncPublicApiKeyDisplay();

  // Close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => closeAllModals());
  });

  // Open Vault button in #apikeys section
  const openVaultBtn = document.getElementById('open-admin-vault-btn');
  if (openVaultBtn) {
    openVaultBtn.addEventListener('click', () => {
      const user = getCurrentUser();
      if (user && user.role === 'admin') {
        openAdminDashboard();
      } else {
        showToast('Please Sign In as Admin to open the API Vault.');
        openAuthModal('signin');
      }
    });
  }

  // Tab switches in Auth Modal
  const tabSignin = document.getElementById('tab-signin-btn');
  const tabSignup = document.getElementById('tab-signup-btn');

  if (tabSignin) tabSignin.addEventListener('click', () => openAuthModal('signin'));
  if (tabSignup) tabSignup.addEventListener('click', () => openAuthModal('signup'));

  // Role Pills
  document.querySelectorAll('.role-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.role-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedRole = pill.getAttribute('data-role');
    });
  });

  // Demo Fill Helpers
  const fillAdmin = document.getElementById('fill-admin-demo');
  const fillCust = document.getElementById('fill-customer-demo');

  if (fillAdmin) {
    fillAdmin.addEventListener('click', () => {
      openAuthModal('signin');
      document.getElementById('auth-email').value = 'admin@upcorp.com';
      document.getElementById('auth-password').value = 'admin123';
      document.querySelectorAll('.role-pill').forEach(p => p.classList.remove('active'));
      document.querySelector('.role-pill[data-role="admin"]').classList.add('active');
      selectedRole = 'admin';
    });
  }

  if (fillCust) {
    fillCust.addEventListener('click', () => {
      openAuthModal('signin');
      document.getElementById('auth-email').value = 'customer@upcorp.com';
      document.getElementById('auth-password').value = 'customer123';
      document.querySelectorAll('.role-pill').forEach(p => p.classList.remove('active'));
      document.querySelector('.role-pill[data-role="customer"]').classList.add('active');
      selectedRole = 'customer';
    });
  }

  // Auth Form Submit
  const authForm = document.getElementById('auth-form');
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email').value.trim();
      const password = document.getElementById('auth-password').value.trim();
      const fullname = document.getElementById('auth-fullname').value.trim();

      const users = getStoredUsers();

      if (currentAuthMode === 'signup') {
        const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existing) {
          showToast('An account with this email already exists!');
          return;
        }

        const newUser = {
          id: 'u_' + Date.now(),
          name: fullname || email.split('@')[0],
          email: email,
          password: password,
          role: selectedRole,
          joinedAt: new Date().toISOString().split('T')[0]
        };

        users.push(newUser);
        localStorage.setItem('up_app_users', JSON.stringify(users));
        setCurrentUser(newUser);

        showToast(`Welcome, ${newUser.name}! Account created as ${selectedRole.toUpperCase()}.`);
        closeModal('auth-modal');

        if (newUser.role === 'admin') openAdminDashboard();
        else openCustomerDashboard();
      } else {
        // Sign In
        const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

        if (!matched) {
          showToast('Invalid email or password!');
          return;
        }

        setCurrentUser(matched);
        showToast(`Signed in successfully as ${matched.name || matched.email}`);
        closeModal('auth-modal');

        if (matched.role === 'admin') openAdminDashboard();
        else openCustomerDashboard();
      }
    });
  }

  // Logout Buttons
  const custLogout = document.getElementById('cust-logout-btn');
  const adminLogout = document.getElementById('admin-logout-btn');

  if (custLogout) {
    custLogout.addEventListener('click', () => {
      setCurrentUser(null);
      closeAllModals();
      showToast('Logged out of Customer Portal.');
    });
  }

  if (adminLogout) {
    adminLogout.addEventListener('click', () => {
      setCurrentUser(null);
      closeAllModals();
      showToast('Logged out of Admin Command Center.');
    });
  }

  // Admin Add Key Form
  const addKeyForm = document.getElementById('admin-add-key-form');
  if (addKeyForm) {
    addKeyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const serviceName = document.getElementById('key-service-name').value.trim();
      const provider = document.getElementById('key-provider').value.trim();
      const keyValue = document.getElementById('key-value').value.trim();

      if (!serviceName || !provider || !keyValue) {
        showToast('Please complete all API key fields!');
        return;
      }

      const keys = getStoredApiKeys();
      const newKey = {
        id: 'k_' + Date.now(),
        name: serviceName,
        provider: provider,
        value: keyValue,
        active: true,
        createdAt: new Date().toISOString().split('T')[0]
      };

      // Set previous keys to inactive if desired, or keep new as active
      keys.forEach(k => k.active = false);
      keys.unshift(newKey);
      saveStoredApiKeys(keys);

      showToast(`API Key "${serviceName}" added to Admin Vault and set as Active!`);
      addKeyForm.reset();
    });
  }

  // Customer Request Key Button
  const custReqKeyBtn = document.getElementById('cust-request-key-btn');
  if (custReqKeyBtn) {
    custReqKeyBtn.addEventListener('click', () => {
      const user = getCurrentUser();
      const keysList = document.getElementById('cust-keys-list');
      const newKeyVal = `CLIENT_${(user ? user.name : 'CUST').toUpperCase().replace(/\s+/g, '_')}_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      if (keysList) {
        keysList.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; background:#090e1a; padding:0.75rem 1rem; border-radius:8px; border:1px solid rgba(56,189,248,0.3); margin-top:0.5rem;">
            <div>
              <strong style="color:white;">Dedicated Enterprise API Key</strong>
              <div class="key-code" style="margin-top:0.25rem;">${newKeyVal}</div>
            </div>
            <button class="btn btn-outline btn-sm" onclick="navigator.clipboard.writeText('${newKeyVal}'); alert('Key copied!');">Copy</button>
          </div>
        `;
      }
      showToast('New Dedicated Client API Key generated!');
    });
  }
}

function openCustomerDashboard() {
  const user = getCurrentUser();
  if (!user) return;

  document.getElementById('cust-dash-name').textContent = user.name || 'Customer Portal';
  document.getElementById('cust-dash-email').textContent = user.email;

  openModal('customer-dashboard-modal');
}

function openAdminDashboard() {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    showToast('Admin privilege required!');
    return;
  }

  document.getElementById('admin-dash-email').textContent = user.email;
  renderAdminApiVault();
  renderAdminUsersTable();

  openModal('admin-dashboard-modal');
}

function renderAdminApiVault() {
  const tbody = document.getElementById('admin-api-keys-tbody');
  const countEl = document.getElementById('api-keys-count');
  if (!tbody) return;

  const keys = getStoredApiKeys();

  if (countEl) countEl.textContent = `${keys.length} Key(s) Configured`;

  if (keys.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: #64748b; padding: 1.5rem;">
          No API keys configured yet. Use the form above to add your first key!
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = keys.map(k => `
    <tr>
      <td style="font-weight: 700; color: white;">${k.name}</td>
      <td style="color: #94a3b8;">${k.provider}</td>
      <td><span class="key-code">${k.value}</span></td>
      <td>
        ${k.active 
          ? '<span class="status-badge" style="background:rgba(16,185,129,0.15); border-color:rgba(16,185,129,0.3); color:#34d399;">Active</span>' 
          : '<span class="status-badge" style="background:rgba(100,116,139,0.15); border-color:rgba(100,116,139,0.3); color:#94a3b8;">Inactive</span>'
        }
      </td>
      <td style="text-align: right;">
        <button onclick="window.copyAdminKey('${k.id}')" class="btn btn-outline btn-sm" style="margin-right: 0.3rem;">📋 Copy</button>
        <button onclick="window.toggleAdminKey('${k.id}')" class="btn ${k.active ? 'btn-outline' : 'btn-success'} btn-sm" style="margin-right: 0.3rem;">
          ${k.active ? 'Disable' : 'Enable'}
        </button>
        <button onclick="window.deleteAdminKey('${k.id}')" class="btn btn-danger btn-sm">🗑️ Delete</button>
      </td>
    </tr>
  `).join('');
}

function renderAdminUsersTable() {
  const tbody = document.getElementById('admin-users-tbody');
  if (!tbody) return;

  const users = getStoredUsers();

  tbody.innerHTML = users.map(u => `
    <tr>
      <td style="font-weight: 600; color: white;">${u.name || 'N/A'}</td>
      <td style="color: #38bdf8;">${u.email}</td>
      <td>
        <span class="status-badge" style="${u.role === 'admin' ? 'background:rgba(245,158,11,0.15); border-color:rgba(245,158,11,0.3); color:#f59e0b;' : ''}">
          ${u.role.toUpperCase()}
        </span>
      </td>
      <td style="color: #94a3b8; font-size: 0.8rem;">${u.joinedAt || '2026-08-01'}</td>
    </tr>
  `).join('');
}

// Global Window Helpers for Admin Key Actions
window.copyAdminKey = function(keyId) {
  const keys = getStoredApiKeys();
  const target = keys.find(k => k.id === keyId);
  if (target) {
    navigator.clipboard.writeText(target.value).then(() => {
      showToast(`Copied ${target.name} API Key!`);
    });
  }
};

window.toggleAdminKey = function(keyId) {
  const keys = getStoredApiKeys();
  const target = keys.find(k => k.id === keyId);
  if (target) {
    target.active = !target.active;
    saveStoredApiKeys(keys);
    showToast(`${target.name} key set to ${target.active ? 'ACTIVE' : 'INACTIVE'}.`);
  }
};

window.deleteAdminKey = function(keyId) {
  let keys = getStoredApiKeys();
  const target = keys.find(k => k.id === keyId);
  if (target && confirm(`Delete API key "${target.name}"?`)) {
    keys = keys.filter(k => k.id !== keyId);
    saveStoredApiKeys(keys);
    showToast(`API Key "${target.name}" deleted.`);
  }
};