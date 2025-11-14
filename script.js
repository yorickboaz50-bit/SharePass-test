const EMAIL_PATTERN = /^(?:[^\s@]+@[^\s@]+\.[^\s@]{2,})$/i;

const showToast = (toastElement, message) => {
  if (!toastElement) return;
  const messageElement = toastElement.querySelector('[data-toast-message]');
  if (messageElement) {
    messageElement.textContent = message;
  }
  toastElement.hidden = false;
  toastElement.setAttribute('aria-live', 'polite');
};

const hideToast = (toastElement) => {
  if (!toastElement) return;
  toastElement.hidden = true;
  toastElement.removeAttribute('aria-live');
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('[data-signup-form]');
  const toast = document.querySelector('[data-toast]');
  const toastDismiss = toast ? toast.querySelector('[data-toast-dismiss]') : null;
  let toastTimeoutId;

  const radioCards = form ? Array.from(form.querySelectorAll('[data-radio-card]')) : [];

  const setFieldError = (field, message) => {
    if (!field) return;
    field.dataset.invalid = 'true';
    const errorElement = field.querySelector('[data-error]');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.hidden = false;
    }
  };

  const clearFieldError = (field) => {
    if (!field) return;
    delete field.dataset.invalid;
    const errorElement = field.querySelector('[data-error]');
    if (errorElement) {
      errorElement.hidden = true;
    }
  };

  const toggleActiveCard = () => {
    radioCards.forEach((card) => {
      const input = card.querySelector('input[type="radio"]');
      if (!input) return;
      if (input.checked) {
        card.classList.add('is-active');
      } else {
        card.classList.remove('is-active');
      }
    });
  };

  radioCards.forEach((card) => {
    const input = card.querySelector('input[type="radio"]');
    if (!input) return;
    card.addEventListener('click', () => {
      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    input.addEventListener('change', () => {
      toggleActiveCard();
      const field = card.closest('[data-field="user-type"]');
      if (field) {
        clearFieldError(field);
      }
    });
  });

  if (form) {
    const emailField = form.querySelector('[data-field="email"]');
    const emailInput = form.querySelector('input[type="email"]');
    const userTypeField = form.querySelector('[data-field="user-type"]');

    if (emailInput) {
      emailInput.addEventListener('input', () => {
        if (EMAIL_PATTERN.test(emailInput.value.trim())) {
          clearFieldError(emailField);
        }
      });
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let hasError = false;

      if (!emailInput || !emailField) {
        return;
      }

      const emailValue = emailInput.value.trim();
      if (!EMAIL_PATTERN.test(emailValue)) {
        setFieldError(emailField, 'Voer een geldig e-mailadres in.');
        if (!hasError) {
          emailInput.focus();
        }
        hasError = true;
      } else {
        clearFieldError(emailField);
      }

      const selectedType = form.querySelector('input[name="userType"]:checked');
      if (!selectedType) {
        setFieldError(userTypeField, 'Maak een keuze om verder te gaan.');
        if (!hasError && userTypeField) {
          userTypeField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        hasError = true;
      } else {
        clearFieldError(userTypeField);
      }

      if (hasError) {
        return;
      }

      form.reset();
      toggleActiveCard();
      clearFieldError(emailField);
      clearFieldError(userTypeField);

      hideToast(toast);
      window.clearTimeout(toastTimeoutId);
      showToast(toast, 'Bedankt voor je aanmelding! 🎉 We laten het je weten zodra we live gaan in jouw regio.');
      toastTimeoutId = window.setTimeout(() => {
        hideToast(toast);
      }, 5000);
    });
  }

  if (toastDismiss && toast) {
    toastDismiss.addEventListener('click', () => {
      window.clearTimeout(toastTimeoutId);
      hideToast(toast);
    });
  }

  const slotButtons = document.querySelectorAll('[data-slot]');
  slotButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const slotName = button.getAttribute('data-slot') || 'dit tijdslot';
      hideToast(toast);
      window.clearTimeout(toastTimeoutId);
      showToast(toast, `📅 ${slotName} staat klaar. Zodra SharePass live is kun je dit slot direct reserveren.`);
      toastTimeoutId = window.setTimeout(() => {
        hideToast(toast);
      }, 4500);
    });
  });

  toggleActiveCard();
});
