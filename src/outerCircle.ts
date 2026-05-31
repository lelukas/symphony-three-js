import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { config } from './config';
import { events } from './events';
import { createCirclePoints } from './utils';

const { outerCircle: cfg } = config;

const hitColor = new THREE.Color(cfg.hitColor);
const restColor = new THREE.Color(cfg.restColor as number);

let outerMaterial: LineMaterial;
let colorDebounce = 0;

export function init(scene: THREE.Scene, radius: number, segments: number) {
  const points = createCirclePoints(segments);
  const positions: number[] = points.flatMap(p => [p.x * radius, p.y * radius, 0]);

  const geometry = new LineGeometry();
  geometry.setPositions(positions);

  outerMaterial = new LineMaterial({
    color: cfg.restColor as number,
    linewidth: cfg.linewidth,
    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
  });

  const circle = new Line2(geometry, outerMaterial);
  scene.add(circle);

  events.on('hit', () => {
    outerMaterial.color.set(cfg.hitColor);
    colorDebounce = config.debounceDuration;
  });

  window.addEventListener('resize', () => {
    outerMaterial.resolution.set(window.innerWidth, window.innerHeight);
  });
}

export function reset() {
  outerMaterial.color.set(cfg.restColor);
  colorDebounce = 0;
}

export function update(deltaMs: number) {
  if (colorDebounce > 0) {
    colorDebounce -= deltaMs;
    if (colorDebounce <= 0) {
      outerMaterial.color.set(cfg.restColor);
    }
  }
}
