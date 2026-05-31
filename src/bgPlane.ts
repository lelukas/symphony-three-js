import * as THREE from 'three';
import { events } from './events';
import { config } from './config';

const { bgPlane: cfg } = config;

const debounceDuration = config.debounceDuration;
const fadeOutDuration = config.fadeOutDuration;
let debounceTimer = 0;
let fadeTimer = -1;

let bgMaterial: THREE.MeshBasicMaterial;

export function init(scene: THREE.Scene) {
  bgMaterial = new THREE.MeshBasicMaterial({
    color: cfg.color,
    transparent: true,
    opacity: 0,
  });
  const bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), bgMaterial);
  bgPlane.position.z = -0.01;
  scene.add(bgPlane);

  events.on('hit', () => {
    debounceTimer = debounceDuration;
    fadeTimer = -1;
    bgMaterial.opacity = 1;
  });
}

export function reset() {
  debounceTimer = 0;
  fadeTimer = -1;
  bgMaterial.opacity = 0;
}

export function update(deltaMs: number) {
  if (debounceTimer > 0) {
    debounceTimer -= deltaMs;
    if (debounceTimer <= 0) {
      fadeTimer = 0;
      events.emit('fadeStart');
    }
  }

  if (fadeTimer >= 0) {
    fadeTimer += deltaMs;
    const prevOpacity = bgMaterial.opacity;
    bgMaterial.opacity = Math.max(0, 1 - fadeTimer / fadeOutDuration);
    if (prevOpacity > 0 && bgMaterial.opacity <= 0) {
      events.emit('fadeEnd');
    }
  }
}
