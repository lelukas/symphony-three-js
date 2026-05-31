import * as THREE from 'three';
import { events } from './events';
import { config } from './config';
import { createCirclePoints } from './utils';

const { ripple: cfg } = config;

const sharedGeometry = new THREE.BufferGeometry().setFromPoints(
  createCirclePoints(config.segments)
);

interface Ripple {
  mesh: THREE.LineLoop;
  material: THREE.LineBasicMaterial;
  elapsed: number;
}

const active: Ripple[] = [];
let hitCount = 0;
let ongoing = false;

const colors = [0xff3333, 0xff8833, 0xffdd33, 0x33ff55, 0x33ddff, 0x3355ff, 0x8833ff];

export function init(scene: THREE.Scene) {
  events.on('ongoing', () => { ongoing = true; });

  events.on('hit', () => {
    if (active.length >= cfg.maxActive) return;
    const color = ongoing
      ? colors[Math.floor(hitCount / cfg.transitionEvery) % colors.length]
      : 0xff5533;
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 1,
    });
    hitCount++;    

    const mesh = new THREE.LineLoop(sharedGeometry, material);
    mesh.scale.set(config.bigRadius, config.bigRadius, 1);
    scene.add(mesh);

    active.push({ mesh, material, elapsed: 0 });
  });
}

export function reset() {
  hitCount = 0;
  ongoing = false;
  for (const r of active) {
    r.mesh.parent?.remove(r.mesh);
    r.material.dispose();
  }
  active.length = 0;
}

export function update(deltaMs: number) {
  for (let i = active.length - 1; i >= 0; i--) {
    const r = active[i];
    r.elapsed += deltaMs;

    const progress = Math.min(r.elapsed / cfg.duration, 1);
    const s = config.bigRadius * (1 + (cfg.expandTo - 1) * progress);
    r.mesh.scale.set(s, s, 1);
    r.material.opacity = 1 - progress;

    if (r.elapsed >= cfg.duration) {
      r.mesh.parent?.remove(r.mesh);
      r.material.dispose();
      active.splice(i, 1);
    }
  }
}
