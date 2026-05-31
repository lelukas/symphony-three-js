import { events } from './events';
import { config } from './config';

let audio: HTMLAudioElement;
let volumeFadeTimer = -1;
let finished = false;

export function prime() {
  audio.play().then(() => {
    audio.pause();
    audio.currentTime = 0;
  });
}

export function init() {
  audio = new Audio('/symphony.m4a');
  audio.loop = false;
  audio.addEventListener('ended', () => {
    finished = true;
    events.emit('complete');
  });

  events.on('hit', () => {
    if (finished) return;
    if (audio.paused) audio.play();
    audio.volume = 1;
    volumeFadeTimer = -1;
  });

  events.on('fadeStart', () => {
    volumeFadeTimer = 0;
  });

  events.on('fadeEnd', () => {
    audio.volume = 0;
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 1;
  });
}

export function reset() {
  audio.pause();
  audio.currentTime = 0;
  audio.volume = 1;
  volumeFadeTimer = -1;
  finished = false;
}

export function update(deltaMs: number) {
  if (volumeFadeTimer >= 0) {
    volumeFadeTimer += deltaMs;
    audio.volume = Math.max(0, 1 - volumeFadeTimer / config.fadeOutDuration);
  }
}
