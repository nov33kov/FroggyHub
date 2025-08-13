import { state, saveState } from './state.js';
import {
  setScene,
  renderPads,
  frogJumpToPad,
  withTransition,
  showSlide,
  stepsCreate,
} from './scene.js';
import { initWishlist, renderGrid, renderAdmin } from './wishlist.js';
import { initRSVP, toFinalScene } from './rsvp.js';

const speechText = document.getElementById('speechText');
const speechActions = document.getElementById('speechActions');

// Intro scene setup
setScene('intro');
speechText.innerHTML =
  '<strong>Фрогги:</strong> Привет! Создать событие или присоединиться?';
speechActions.innerHTML = `<button class="pill" data-next="create">🧪 Создать</button><button class="pill secondary" data-next="join">🎉 Присоединиться</button>`;
speechActions.onclick = (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  withTransition(() => {
    if (btn.dataset.next === 'create') {
      setScene('pond');
      renderPads(stepsCreate.length);
      frogJumpToPad(0, true);
      showSlide('create-1');
    } else {
      setScene('pond');
      renderPads(3);
      frogJumpToPad(0, false);
      showSlide('join-code');
    }
  });
};

// Create form
const formCreate = document.getElementById('formCreate');
const eventTitle = document.getElementById('eventTitle');
const eventDate = document.getElementById('eventDate');
const eventTime = document.getElementById('eventTime');
const eventAddress = document.getElementById('eventAddress');
formCreate.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = eventTitle.value.trim();
  const date = eventDate.value;
  const time = eventTime.value;
  const address = eventAddress.value.trim();
  if (!title || !date || !time) {
    alert('Заполни название, дату и время');
    return;
  }
  Object.assign(state, { title, date, time, address });
  saveState();
  withTransition(() => {
    frogJumpToPad(1, true);
    showSlide('create-wishlist');
    renderGrid();
  });
});

// Wishlist and details
initWishlist();

const formDetails = document.getElementById('formDetails');
const eventDress = document.getElementById('eventDress');
const eventBring = document.getElementById('eventBring');
const eventNotes = document.getElementById('eventNotes');
formDetails.addEventListener('submit', (e) => {
  e.preventDefault();
  Object.assign(state, {
    dress: eventDress.value.trim(),
    bring: eventBring.value.trim(),
    notes: eventNotes.value.trim(),
  });
  state.code = Math.floor(100000 + Math.random() * 900000).toString();
  saveState();
  withTransition(() => {
    frogJumpToPad(3, true);
    showSlide('admin');
    renderAdmin();
  });
});

document.getElementById('finishCreate').onclick = () =>
  withTransition(() => toFinalScene());

// RSVP and guest flow
initRSVP();

// Initial pads
function initIntro() {
  renderPads(3);
}
initIntro();
window.addEventListener('resize', () => {
  if (document.body.classList.contains('scene-pond'))
    renderPads(document.querySelectorAll('#pads .pad').length);
});
