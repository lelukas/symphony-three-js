import * as THREE from 'three';
import { config } from './config';
import { events } from './events';

const { gifSprite: cfg } = config;

let mesh: THREE.Mesh;
let texture: THREE.Texture;
let paused = false;
let frame = 0;
const totalFrames = cfg.frameCols * cfg.frameRows;
const frameDuration = 1000 / cfg.fps;

export function init(scene: THREE.Scene) {
  const loader = new THREE.TextureLoader();
  texture = loader.load('/spritesheet.png');
  texture.repeat.set(1 / cfg.frameCols, 1 / cfg.frameRows);

  const geometry = new THREE.PlaneGeometry(cfg.scale, cfg.scale * (480 / 270));
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });

  mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = 0.01;
  scene.add(mesh);

  events.on('fadeStart', () => {
    frame = 0;
    paused = true;
    updateFrame();
  });
  events.on('hit', () => { paused = false; });
}

export function reset() {
  frame = 0;
  paused = false;
  updateFrame();
}

export function update(deltaMs: number) {
  if (paused) return;

  frame += deltaMs / frameDuration;
  if (frame >= totalFrames) frame = 0;
  updateFrame();
}

function updateFrame() {
  const col = Math.floor(frame) % cfg.frameCols;
  const row = Math.floor(frame / cfg.frameCols);
  texture.offset.set(col / cfg.frameCols, 1 - (row + 1) / cfg.frameRows);
}
