// Rental calculator for equipment pages
(function () {
  'use strict';

  const numberFormatter = new Intl.NumberFormat('ru-RU');

  function formatRub(value) {
    const n = Math.max(0, Math.round(Number(value) || 0));
    return `${numberFormatter.format(n)} ₽`;
  }

  function clampMin(value, min) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, n);
  }

  function initCalculator(root) {
    const rateHour = Number(root.dataset.rateHour || 0);
    const rateShift = Number(root.dataset.rateShift || 0);
    const minHours = Number(root.dataset.minHours || 1);
    const shiftHours = Number(root.dataset.shiftHours || 8);

    const modeEl = root.querySelector('[data-rc-mode]');
    const hoursEl = root.querySelector('[data-rc-hours]');
    const shiftsEl = root.querySelector('[data-rc-shifts]');
    const deliveryEl = root.querySelector('[data-rc-delivery]');
    const discountEl = root.querySelector('[data-rc-discount]');

    const outSubtotalEl = root.querySelector('[data-rc-subtotal]');
    const outDeliveryEl = root.querySelector('[data-rc-delivery-out]');
    const outDiscountEl = root.querySelector('[data-rc-discount-out]');
    const outTotalEl = root.querySelector('[data-rc-total]');
    const outHintEl = root.querySelector('[data-rc-hint]');

    if (!modeEl || !hoursEl || !shiftsEl || !deliveryEl || !discountEl || !outTotalEl) return;

    // Defaults
    if (!deliveryEl.value) deliveryEl.value = root.dataset.deliveryDefault || '0';
    if (!discountEl.value) discountEl.value = '0';

    function setVisibility() {
      const mode = modeEl.value;
      const hoursRow = root.querySelector('[data-rc-row="hours"]');
      const shiftsRow = root.querySelector('[data-rc-row="shifts"]');
      if (hoursRow) hoursRow.style.display = mode === 'hour' ? '' : 'none';
      if (shiftsRow) shiftsRow.style.display = mode === 'shift' ? '' : 'none';
    }

    function calc() {
      const mode = modeEl.value;
      const delivery = clampMin(deliveryEl.value, 0);
      const discount = clampMin(discountEl.value, 0);

      let rentSubtotal = 0;
      let hint = '';

      if (mode === 'hour') {
        const hours = clampMin(hoursEl.value, minHours);
        hoursEl.value = String(hours);
        rentSubtotal = hours * rateHour;
        if (minHours > 1) hint = `Минимальный заказ: ${minHours} ч.`;
      } else {
        const shifts = clampMin(shiftsEl.value, 1);
        shiftsEl.value = String(shifts);
        rentSubtotal = shifts * rateShift;
        hint = `1 смена = ${shiftHours} часов (по умолчанию).`;
      }

      const discountRub = Math.min(rentSubtotal, discount);
      const total = Math.max(0, rentSubtotal - discountRub + delivery);

      if (outSubtotalEl) outSubtotalEl.textContent = formatRub(rentSubtotal);
      if (outDeliveryEl) outDeliveryEl.textContent = formatRub(delivery);
      if (outDiscountEl) outDiscountEl.textContent = `- ${formatRub(discountRub)}`;
      outTotalEl.textContent = formatRub(total);
      if (outHintEl) outHintEl.textContent = hint;
    }

    setVisibility();
    calc();

    root.addEventListener('input', (e) => {
      if (!(e.target instanceof HTMLElement)) return;
      if (e.target.matches('[data-rc-mode]')) {
        setVisibility();
      }
      calc();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.rental-calculator').forEach((el) => initCalculator(el));
  });
})();

