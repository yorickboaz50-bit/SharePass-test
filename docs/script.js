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

  const navToggle = document.querySelector('[data-nav-toggle]');
  const primaryNav = document.querySelector('[data-primary-nav]');
  const navLinks = primaryNav ? Array.from(primaryNav.querySelectorAll('a')) : [];
  const navMediaQuery = window.matchMedia ? window.matchMedia('(min-width: 901px)') : null;

  const closePrimaryNav = ({ restoreFocus = false } = {}) => {
    if (!primaryNav || !navToggle) {
      return false;
    }

    if (primaryNav.dataset.open !== 'true') {
      return false;
    }

    primaryNav.dataset.open = 'false';
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');

    if (restoreFocus && typeof navToggle.focus === 'function') {
      navToggle.focus();
    }

    return true;
  };

  const openPrimaryNav = () => {
    if (!primaryNav || !navToggle) {
      return;
    }

    primaryNav.dataset.open = 'true';
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  };

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      if (primaryNav.dataset.open === 'true') {
        closePrimaryNav();
      } else {
        openPrimaryNav();
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closePrimaryNav();
      });
    });

    const handleDocumentClick = (event) => {
      if (!primaryNav || primaryNav.dataset.open !== 'true') {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (primaryNav.contains(target) || navToggle.contains(target)) {
        return;
      }

      closePrimaryNav();
    };

    document.addEventListener('click', handleDocumentClick);

    if (navMediaQuery) {
      navMediaQuery.addEventListener('change', (event) => {
        if (event.matches) {
          primaryNav.dataset.open = 'false';
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('nav-open');
        }
      });
    }
  }

  const radioCards = form ? Array.from(form.querySelectorAll('[data-radio-card]')) : [];

  const bookingModal = document.querySelector('[data-booking-modal]');
  const bookingOverlay = bookingModal ? bookingModal.querySelector('[data-booking-overlay]') : null;
  const bookingCloseButton = bookingModal ? bookingModal.querySelector('[data-booking-close]') : null;
  const bookingTitle = bookingModal ? bookingModal.querySelector('[data-booking-title]') : null;
  const bookingLocation = bookingModal ? bookingModal.querySelector('[data-booking-location]') : null;
  const bookingTime = bookingModal ? bookingModal.querySelector('[data-booking-time]') : null;
  const bookingPrice = bookingModal ? bookingModal.querySelector('[data-booking-price]') : null;
  let lastActiveElement = null;

  const closeBookingModal = () => {
    if (!bookingModal) {
      return;
    }

    bookingModal.hidden = true;
    document.body.classList.remove('modal-open');

    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  };

  const openBookingModal = ({ title, location, time, price }) => {
    if (!bookingModal) {
      return;
    }

    if (bookingTitle) {
      bookingTitle.textContent = title;
    }

    if (bookingLocation) {
      if (location) {
        bookingLocation.textContent = location;
        bookingLocation.hidden = false;
      } else {
        bookingLocation.hidden = true;
      }
    }

    if (bookingTime) {
      bookingTime.textContent = time;
    }

    if (bookingPrice) {
      bookingPrice.textContent = price;
    }

    lastActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    bookingModal.hidden = false;
    document.body.classList.add('modal-open');

    if (bookingCloseButton) {
      bookingCloseButton.focus();
    }
  };

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

  if (bookingCloseButton) {
    bookingCloseButton.addEventListener('click', () => {
      closeBookingModal();
    });
  }

  if (bookingOverlay) {
    bookingOverlay.addEventListener('click', () => {
      closeBookingModal();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    const navWasClosed = closePrimaryNav({ restoreFocus: true });
    if (navWasClosed) {
      return;
    }

    if (bookingModal && !bookingModal.hidden) {
      closeBookingModal();
    }
  });

  const slotButtons = document.querySelectorAll('[data-slot]');
  slotButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.slot-card');
      const title = card ? card.querySelector('.slot-card__header h3') : null;
      const detail = card ? card.querySelector('.slot-card__header p') : null;
      const time = card ? card.querySelector('.slot-card__time') : null;
      const price = card ? card.querySelector('.slot-card__price') : null;

      hideToast(toast);
      window.clearTimeout(toastTimeoutId);

      openBookingModal({
        title: title ? title.textContent.trim() : 'SharePass tijdslot',
        location: detail ? detail.textContent.trim() : '',
        time: time ? time.textContent.trim() : 'Binnenkort beschikbaar',
        price: price ? price.textContent.trim() : '€0',
      });
    });
  });

  toggleActiveCard();
});
