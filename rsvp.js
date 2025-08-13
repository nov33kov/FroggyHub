import { state, saveState } from './state.js';
import { croak } from './audio.js';
import { renderGuestWishlist, renderAdmin } from './wishlist.js';
import {
  setScene,
  renderPads,
  frogJumpToPad,
  withTransition,
  showSlide,
  stepsCreate,
} from './scene.js';

let currentGuestName = '';

export function initRSVP() {
  const joinCodeBtn = document.getElementById('joinCodeBtn');
  const joinCodeInput = document.getElementById('joinCodeInput');
  const guestNameInput = document.getElementById('guestName');
  const toGuestWishlist = document.getElementById('toGuestWishlist');
  const skipWishlist = document.getElementById('skipWishlist');
  const toGuestFinal = document.getElementById('toGuestFinal');

  joinCodeBtn.onclick = () => {
    const v = (joinCodeInput.value || '').trim();
    if (!v) {
      alert('Введите код');
      return;
    }
    if (!state.code) {
      alert('Код ещё не создан');
      return;
    }
    if (v === state.code) {
      withTransition(() => {
        showSlide('join-1');
        renderPads(3);
        frogJumpToPad(1, false);
      });
    } else alert('Неверный код');
  };

  document.querySelectorAll('[data-rsvp]').forEach((b) =>
    b.addEventListener('click', (e) => {
      const code = e.currentTarget.dataset.rsvp;
      const name = (guestNameInput.value || '').trim();
      if (!name) {
        alert('Введите имя');
        return;
      }
      currentGuestName = name;
      const ex = state.guests.find(
        (g) => g.name.toLowerCase() === name.toLowerCase(),
      );
      if (ex) ex.rsvp = code;
      else state.guests.push({ name, rsvp: code });
      saveState();
      croak();
    }),
  );

  toGuestWishlist.onclick = () => {
    const name = (guestNameInput.value || '').trim();
    if (!name) {
      alert('Введите имя и статус');
      return;
    }
    currentGuestName = name;
    withTransition(() => {
      showSlide('join-wishlist');
      renderGuestWishlist(currentGuestName);
      frogJumpToPad(2, false);
    });
  };

  skipWishlist.onclick = () => withTransition(() => toFinalScene());
  toGuestFinal.onclick = () => withTransition(() => toFinalScene());
}

export function toFinalScene() {
  setScene('final');
  const frog = document.getElementById('frog');
  frog.style.left = '50%';
  frog.style.top = '42%';
  croak();
  const q = encodeURIComponent(state.address || '');
  const addr = state.address
    ? `<a style="color:#fff" href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener">${state.address}</a>`
    : '—';
  const chosenCount = state.wishlist.filter((i) => i.claimedBy).length;
  const totalWishes = state.wishlist.filter((i) => i.title || i.url).length;
  const freeCount = totalWishes - chosenCount;
  const speech = document.getElementById('speech');
  const speechText = document.getElementById('speechText');
  speech.style.display = 'block';
  speechText.innerHTML = `<strong>${state.title || 'Событие'}</strong><br>📅 ${state.date || '—'} • ⏰ ${state.time || '—'} • 📍 ${addr}<br>👗 ${state.dress || '—'} • 🧺 ${state.bring || '—'}<br>🎁 Пожелания: занято ${chosenCount} • свободно ${freeCount}<br>До начала: <span id="countdown">—</span>`;
  document.getElementById('speechActions').innerHTML =
    `<button class="pill secondary" id="backToPond">Назад</button>`;
  document.getElementById('backToPond').onclick = () =>
    withTransition(() => {
      setScene('pond');
      showSlide('admin');
      renderPads(stepsCreate.length);
      frogJumpToPad(3, true);
      renderAdmin();
    });
  function tick() {
    const out = document.getElementById('countdown');
    if (!state.date || !state.time) {
      out.textContent = '—';
      return;
    }
    const t = new Date(`${state.date}T${state.time}`) - new Date();
    if (t <= 0) {
      out.textContent = 'началось!';
      return;
    }
    const d = Math.floor(t / 86400000);
    const h = Math.floor((t % 86400000) / 3600000);
    const m = Math.floor((t % 3600000) / 60000);
    const s = Math.floor((t % 60000) / 1000);
    out.textContent = `${d}д ${h}ч ${m}м ${s}с`;
  }
  tick();
  clearInterval(window._final_cd);
  window._final_cd = setInterval(tick, 1000);
}
