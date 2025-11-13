const membershipButton = document.getElementById('cta-membership');
const bookingButton = document.getElementById('cta-booking');
const memberSection = document.getElementById('members-flow');
const renterSection = document.getElementById('renters-flow');
const bookButtons = document.querySelectorAll('.book-button');
const yearElement = document.getElementById('year');

function smoothScrollTo(element) {
  if (!element) return;
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

if (membershipButton) {
  membershipButton.addEventListener('click', () => {
    smoothScrollTo(memberSection);
    // TODO: Trigger owner onboarding modal when available
  });
}

if (bookingButton) {
  bookingButton.addEventListener('click', () => {
    smoothScrollTo(renterSection);
    // TODO: Open booking discovery view instead of scroll once implemented
  });
}

bookButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const slotName = button.dataset.slot;
    console.log(`TODO: open booking modal for ${slotName}`);
    alert(`TODO: open booking modal for ${slotName}`);
    // TODO: Initiate booking flow with selected slot id
    // TODO: Show QR code after booking
  });
});

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// TODO: Implement login/sign-up functionality
// TODO: Add filtering by location and time
// TODO: Replace hardcoded slots with data from backend
