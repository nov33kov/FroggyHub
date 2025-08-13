const CROAK_URL = 'assets/croak.mp3';
let croakAudio = null;
try {
  croakAudio = new Audio(CROAK_URL);
  croakAudio.volume = 0.75;
} catch (e) {
  croakAudio = null;
}

export function croak() {
  if (!croakAudio) return;
  try {
    croakAudio.currentTime = 0;
    croakAudio.play();
  } catch (e) {
    // ignore
  }
}
