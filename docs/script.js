const currencyFormatter = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const oneDecimalFormatter = new Intl.NumberFormat('nl-NL', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const integerFormatter = new Intl.NumberFormat('nl-NL', {
  maximumFractionDigits: 0,
});

const formatCurrency = (value) => currencyFormatter.format(Math.max(0, Math.round(value)));

const formatBookings = (value) => {
  const safeValue = Math.max(0, value);
  if (safeValue < 10) {
    return oneDecimalFormatter.format(safeValue);
  }
  return integerFormatter.format(Math.round(safeValue));
};

document.addEventListener('DOMContentLoaded', () => {
  const slotInput = document.getElementById('demo-slots');
  const priceInput = document.getElementById('demo-price');
  const occupancyInput = document.getElementById('demo-occupancy');

  const slotOutput = document.getElementById('demo-slots-value');
  const priceOutput = document.getElementById('demo-price-value');
  const occupancyOutput = document.getElementById('demo-occupancy-value');

  const resultElements = {
    bookings: document.querySelector('[data-demo-result="bookings"]'),
    revenue: document.querySelector('[data-demo-result="revenue"]'),
    fee: document.querySelector('[data-demo-result="fee"]'),
    payout: document.querySelector('[data-demo-result="payout"]'),
    summary: document.querySelector('[data-demo-result="summary"]'),
  };

  const noteElement = document.querySelector('[data-demo-note]');
  const progressSegments = {
    owner: document.querySelector('[data-demo-progress="owner"]'),
    sharepass: document.querySelector('[data-demo-progress="sharepass"]'),
  };

  const leadForm = document.querySelector('.lead-form');
  const leadSuccess = leadForm ? leadForm.querySelector('[data-lead-success]') : null;
  const bookingButtons = document.querySelectorAll('.book-button');

  const weeksPerMonth = 4.3;
  const serviceFeeRate = 0.1;
  let noteTimeoutId;

  const updateProgress = (revenue, payout, fee) => {
    if (!progressSegments.owner || !progressSegments.sharepass) {
      return;
    }

    if (revenue <= 0) {
      progressSegments.owner.style.width = '0%';
      progressSegments.sharepass.style.width = '0%';
      return;
    }

    const ownerPercentage = Math.min(100, Math.max(0, (payout / revenue) * 100));
    const feePercentage = Math.min(100, Math.max(0, (fee / revenue) * 100));

    progressSegments.owner.style.width = `${ownerPercentage}%`;
    progressSegments.sharepass.style.width = `${feePercentage}%`;
  };

  const hideNote = () => {
    if (noteElement) {
      noteElement.hidden = true;
      noteElement.textContent = '';
    }
    if (noteTimeoutId) {
      window.clearTimeout(noteTimeoutId);
      noteTimeoutId = undefined;
    }
  };

  const showNote = (message) => {
    if (!noteElement) {
      return;
    }
    hideNote();
    noteElement.textContent = message;
    noteElement.hidden = false;
    noteTimeoutId = window.setTimeout(() => {
      hideNote();
    }, 4500);
  };

  const updateDemo = () => {
    if (!slotInput || !priceInput || !occupancyInput) {
      return;
    }

    hideNote();

    const slots = Number(slotInput.value);
    const price = Number(priceInput.value);
    const occupancy = Number(occupancyInput.value);

    if (slotOutput) {
      slotOutput.textContent = integerFormatter.format(slots);
    }
    if (priceOutput) {
      priceOutput.textContent = formatCurrency(price);
    }
    if (occupancyOutput) {
      occupancyOutput.textContent = `${occupancy}%`;
    }

    const bookings = slots * weeksPerMonth * (occupancy / 100);
    const revenue = bookings * price;
    const fee = revenue * serviceFeeRate;
    const payout = revenue - fee;

    if (resultElements.bookings) {
      resultElements.bookings.textContent = formatBookings(bookings);
    }
    if (resultElements.revenue) {
      resultElements.revenue.textContent = formatCurrency(revenue);
    }
    if (resultElements.fee) {
      resultElements.fee.textContent = formatCurrency(fee);
    }
    if (resultElements.payout) {
      resultElements.payout.textContent = formatCurrency(payout);
    }
    if (resultElements.summary) {
      resultElements.summary.textContent = `Met ${integerFormatter.format(slots)} vrije slots per week à ${formatCurrency(price)} en ${occupancy}% bezetting verdien je ongeveer ${formatCurrency(payout)} per maand. SharePass ontvangt ${formatCurrency(fee)} voor het faciliteren van de boekingen.`;
    }

    updateProgress(revenue, payout, fee);
  };

  [slotInput, priceInput, occupancyInput].forEach((input) => {
    if (input) {
      input.addEventListener('input', updateDemo);
    }
  });

  if (leadForm && leadSuccess) {
    leadForm.addEventListener('submit', (event) => {
      event.preventDefault();
      hideNote();
      leadSuccess.hidden = false;
      const emailField = leadForm.querySelector('input[type="email"]');
      if (emailField) {
        emailField.value = '';
        emailField.focus();
      }
      window.setTimeout(() => {
        leadSuccess.hidden = true;
      }, 4000);
    });
  }

  bookingButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const slotName = button.dataset.slot || 'dit tijdslot';
      showNote(`📅 ${slotName} staat klaar. Zodra SharePass live is kun je dit slot direct reserveren.`);
    });
  });

  updateDemo();
});
