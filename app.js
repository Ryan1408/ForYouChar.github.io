// Change this to set the landing page password
const CORRECT_PASSWORD = '211125';

const form = document.getElementById('pw-form');
const passwordInput = document.getElementById('password');
const modal = document.getElementById('wrong-modal');
const closeModalBtn = document.getElementById('close-modal');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = passwordInput.value.trim();
  if (val === CORRECT_PASSWORD) {
    // go to the new page
    window.location.href = 'main.html';
  } else {
    // show modal
    modal.classList.remove('hidden');
    passwordInput.value = '';
    passwordInput.focus();
  }
});

closeModalBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// allow pressing Escape to close modal
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') modal.classList.add('hidden');
});