import { state, saveState } from './state.js';
import { withTransition, frogJumpToPad, showSlide } from './scene.js';

const wlGrid = document.getElementById('wlGrid');
const editor = document.getElementById('cellEditor');
const cellTitle = document.getElementById('cellTitle');
const cellUrl = document.getElementById('cellUrl');
let currentCellId = null;

export function renderGrid() {
  wlGrid.innerHTML = '';
  wlGrid.style.gridTemplateColumns = `repeat(5,1fr)`;
  state.wishlist.forEach((cell) => {
    const div = document.createElement('div');
    div.className = 'cell' + (cell.claimedBy ? ' taken' : '');
    div.dataset.id = cell.id;
    div.innerHTML = `${cell.claimedBy ? '<div class="status">Занято</div>' : '<div class="status" style="background:#d8ffdb">Свободно</div>'}
                   <div class="label">${cell.title || ''}</div>
                   <div class="action">${cell.url ? `<a href="${cell.url}" target="_blank" rel="noopener">Открыть</a>` : ''}</div>`;
    div.addEventListener('click', () => openEditor(cell.id));
    wlGrid.appendChild(div);
  });
}

export function openEditor(id) {
  currentCellId = id;
  const c = state.wishlist.find((x) => x.id === id);
  cellTitle.value = c.title || '';
  cellUrl.value = c.url || '';
  editor.showModal ? editor.showModal() : editor.setAttribute('open', '');
}

export function initWishlist() {
  document.getElementById('saveCell').onclick = () => {
    const c = state.wishlist.find((x) => x.id === currentCellId);
    c.title = cellTitle.value.trim();
    c.url = cellUrl.value.trim();
    saveState();
    renderGrid();
  };
  document.getElementById('clearWL').onclick = () => {
    state.wishlist.forEach((c) => {
      c.title = '';
      c.url = '';
      c.claimedBy = '';
    });
    saveState();
    renderGrid();
  };
  document.getElementById('addItem').onclick = () => {
    const nextId = state.wishlist.length
      ? Math.max(...state.wishlist.map((i) => i.id)) + 1
      : 1;
    state.wishlist.push({ id: nextId, title: '', url: '', claimedBy: '' });
    saveState();
    renderGrid();
  };
  document.getElementById('toDetails').onclick = () => {
    withTransition(() => {
      frogJumpToPad(2, true);
      showSlide('create-details');
    });
  };
  editor.addEventListener('click', (e) => {
    const r = editor.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      editor.close();
  });
}

const guestGifts = document.getElementById('guestGifts');
export function renderGuestWishlist(currentGuestName) {
  const items = state.wishlist.filter((i) => i.title || i.url);
  guestGifts.innerHTML = items
    .map((item) => {
      const me =
        item.claimedBy &&
        item.claimedBy.toLowerCase() === currentGuestName.toLowerCase();
      const taken = !!item.claimedBy && !me;
      const status = taken
        ? `<span class="pill-mini takenTag">Занято</span>`
        : me
          ? `<span class="pill-mini" style="background:#d8ffdb;color:#0b3b22">Вы выбрали</span>`
          : `<span class="pill-mini" style="background:#fff8c6;color:#614a00">Свободно</span>`;
      const chooseBtn = taken
        ? ''
        : me
          ? `<button data-id="${item.id}" class="pill-mini unchoose">Снять выбор</button>`
          : `<button data-id="${item.id}" class="pill-mini choose">Выбрать</button>`;
      const link = item.url
        ? ` • <a href="${item.url}" target="_blank" rel="noopener">ссылка</a>`
        : '';
      return `<div class="giftcard"><div><strong>${item.title || 'Подарок'}</strong><span class="meta">${link}</span></div><div class="gift-actions">${status}${chooseBtn}</div></div>`;
    })
    .join('');
  guestGifts.querySelectorAll('.choose').forEach((b) =>
    b.addEventListener('click', (e) => {
      const id = +e.currentTarget.dataset.id;
      const it = state.wishlist.find((x) => x.id === id);
      if (
        it.claimedBy &&
        it.claimedBy.toLowerCase() !== currentGuestName.toLowerCase()
      ) {
        alert('Этот подарок уже выбрали');
        return;
      }
      state.wishlist.forEach((x) => {
        if (
          x.claimedBy &&
          x.claimedBy.toLowerCase() === currentGuestName.toLowerCase()
        )
          x.claimedBy = '';
      });
      it.claimedBy = currentGuestName;
      saveState();
      renderGuestWishlist(currentGuestName);
    }),
  );
  guestGifts.querySelectorAll('.unchoose').forEach((b) =>
    b.addEventListener('click', (e) => {
      const id = +e.currentTarget.dataset.id;
      const it = state.wishlist.find((x) => x.id === id);
      if (
        it.claimedBy &&
        it.claimedBy.toLowerCase() === currentGuestName.toLowerCase()
      ) {
        it.claimedBy = '';
        saveState();
        renderGuestWishlist(currentGuestName);
      }
    }),
  );
}

export function renderAdmin() {
  document.getElementById('eventCode').textContent = state.code || '—';
  const html = state.wishlist
    .filter((i) => i.title || i.url)
    .map(
      (i) =>
        `${i.title || 'Подарок'} — ${i.claimedBy ? '🔒 занято' : '🟢 свободно'} ${
          i.url ? `• <a href="${i.url}" target="_blank">ссылка</a>` : ''
        }`,
    )
    .map((s) => `<li>${s}</li>`)
    .join('');
  document.getElementById('adminGifts').innerHTML =
    html || '<li>Вишлист пуст</li>';
}
