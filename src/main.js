// UP Corporations - Interactive Client-Side Application Logic

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initSimulator();
  initRoiCalculator();
  initPosDemo();
  initContactForm();
  initSmoothScroll();
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