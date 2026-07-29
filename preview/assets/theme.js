/**
 * HOME ESSENTIALS — theme interactions
 * Vanilla JS, no build step. Progressive enhancement only —
 * every control here already works as a plain form element without this file.
 */

document.addEventListener('DOMContentLoaded', () => {
  initChipFilters();
  initSwatches();
  initPillOptions();
  initQtySteppers();
  initAddToCart();
  initCartRemove();
});

/* ---- Category chip row: single active chip, purely presentational filter ---- */
function initChipFilters() {
  document.querySelectorAll('.chip-row').forEach((row) => {
    row.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      row.querySelectorAll('.chip').forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
    });
  });
}

/* ---- Color / scent swatches on PDP ---- */
function initSwatches() {
  document.querySelectorAll('.swatch-row').forEach((row) => {
    row.addEventListener('click', (e) => {
      const swatch = e.target.closest('.swatch');
      if (!swatch) return;
      row.querySelectorAll('.swatch').forEach((s) => s.classList.remove('is-selected'));
      swatch.classList.add('is-selected');
      const label = row.closest('.option-group')?.querySelector('.value');
      if (label && swatch.dataset.label) label.textContent = swatch.dataset.label;
    });
  });
}

/* ---- Size / vessel pill options on PDP ---- */
function initPillOptions() {
  document.querySelectorAll('.pill-row').forEach((row) => {
    row.addEventListener('click', (e) => {
      const pill = e.target.closest('.pill-option');
      if (!pill) return;
      row.querySelectorAll('.pill-option').forEach((p) => p.classList.remove('is-selected'));
      pill.classList.add('is-selected');
      const priceEl = document.querySelector('[data-pdp-price]');
      if (priceEl && pill.dataset.price) priceEl.textContent = pill.dataset.price;
    });
  });
}

/* ---- Quantity steppers (PDP sticky bar + cart line items) ---- */
function initQtySteppers() {
  document.querySelectorAll('.qty-stepper').forEach((stepper) => {
    const input = stepper.querySelector('input');
    const min = parseInt(input?.min || '1', 10);
    const max = parseInt(input?.max || '99', 10);

    stepper.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn || !input) return;
      let value = parseInt(input.value || '1', 10);
      value = btn.dataset.step === 'increase' ? value + 1 : value - 1;
      value = Math.max(min, Math.min(max, value));
      input.value = value;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      updateLineTotal(stepper);
    });
  });
}

function updateLineTotal(stepper) {
  const item = stepper.closest('.cart-item');
  if (!item) return;
  const qty = parseInt(stepper.querySelector('input').value, 10);
  const unit = parseFloat(item.dataset.unitPrice || '0');
  const priceEl = item.querySelector('.cart-item__price');
  if (priceEl) priceEl.textContent = formatMoney(unit * qty);
  updateSubtotal();
}

function updateSubtotal() {
  const items = document.querySelectorAll('.cart-item');
  let subtotal = 0;
  items.forEach((item) => {
    const qty = parseInt(item.querySelector('.qty-stepper input')?.value || '1', 10);
    const unit = parseFloat(item.dataset.unitPrice || '0');
    subtotal += qty * unit;
  });
  const subtotalEl = document.querySelector('[data-cart-subtotal]');
  if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
  const echoEl = document.querySelector('[data-cart-subtotal-echo]');
  if (echoEl) echoEl.textContent = formatMoney(subtotal);
  const totalEl = document.querySelector('.summary-row.total .amount');
  if (totalEl) totalEl.textContent = formatMoney(subtotal);
}

function formatMoney(amount) {
  return '$' + amount.toFixed(2);
}

/* ---- Add to cart: bumps the header cart badge, no backend wired here ---- */
function initAddToCart() {
  document.querySelectorAll('[data-add-to-cart]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const badge = document.querySelector('.cart-count');
      if (badge) {
        const current = parseInt(badge.textContent || '0', 10);
        badge.textContent = current + 1;
      }
      btn.classList.add('is-added');
      const label = btn.querySelector('[data-add-label]');
      if (label) {
        const original = label.textContent;
        label.textContent = 'Added';
        setTimeout(() => { label.textContent = original; btn.classList.remove('is-added'); }, 1400);
      }
    });
  });
}

/* ---- Remove line item from cart ---- */
function initCartRemove() {
  document.querySelectorAll('.cart-item__remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.cart-item');
      item?.remove();
      updateSubtotal();
      const badge = document.querySelector('.cart-count');
      if (badge) {
        const current = parseInt(badge.textContent || '0', 10);
        badge.textContent = Math.max(0, current - 1);
      }
    });
  });
}
