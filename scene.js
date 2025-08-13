import { croak } from './audio.js';

const body = document.body;
const pond = document.getElementById('pond');
const frog = document.getElementById('frog');
const frogImg = document.getElementById('frogImg');
const padsWrap = document.getElementById('pads');
const root = document.getElementById('root');
const speech = document.getElementById('speech');

export const stepsCreate = [
  'create-1',
  'create-wishlist',
  'create-details',
  'admin',
];

const FROG_IDLE = 'assets/frog_idle.png';
const FROG_JUMP = 'assets/frog_jump.png';

export function setScene(scene) {
  body.classList.remove('scene-intro', 'scene-pond', 'scene-final');
  body.classList.add(`scene-${scene}`);
  document.getElementById('slides').style.display =
    scene === 'pond' ? 'block' : 'none';
  speech.style.display = scene === 'pond' ? 'none' : 'block';
}

export function renderPads(total) {
  padsWrap.innerHTML = '';
  const H = pond.getBoundingClientRect().height || 480;
  const baseY = H * 0.7;
  for (let i = 0; i < total; i++) {
    const pad = document.createElement('div');
    pad.className = 'pad';
    const x = 12 + i * (75 / (total - 1 || 1));
    pad.style.left = x + '%';
    pad.style.top = (i % 2 ? baseY - 60 : baseY) + 'px';
    padsWrap.appendChild(pad);
  }
}

export function withTransition(next) {
  root.classList.add('fading');
  setTimeout(() => {
    if (next) next();
    root.classList.remove('fading');
  }, 450);
}

export function frogJumpToPad(index, faceRight = true) {
  const pad = padsWrap.children[index];
  if (!pad) return;
  const rect = pad.getBoundingClientRect();
  const stage = document.body.getBoundingClientRect();
  frog.style.left = rect.left + rect.width / 2 - stage.left + 'px';
  frog.style.top = rect.top + rect.height * 0.52 - stage.top + 'px';
  frog.classList.remove('turn-left');
  if (!faceRight) frog.classList.add('turn-left');
  frogImg.src = FROG_JUMP;
  frog.classList.remove('jump');
  void frog.offsetWidth;
  frog.classList.add('jump');
  croak();
  setTimeout(() => {
    frogImg.src = FROG_IDLE;
  }, 550);
}

export function showSlide(id) {
  document
    .querySelectorAll('#slides > section')
    .forEach((s) => (s.hidden = true));
  document.getElementById('slide-' + id).hidden = false;
}
