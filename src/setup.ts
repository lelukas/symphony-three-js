import * as THREE from 'three';
import { config } from './config';

const scene = new THREE.Scene();
scene.background = new THREE.Color(config.scene.background);

const renderer = new THREE.WebGLRenderer({ antialias: true });
document.body.appendChild(renderer.domElement);

const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(
  aspect > 1 ? -aspect : -1,
  aspect > 1 ? aspect : 1,
  aspect > 1 ? 1 : 1 / aspect,
  aspect > 1 ? -1 : -1 / aspect,
  0.1, 10
);
camera.position.z = 1;

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  const aspect = w / h;
  if (aspect > 1) {
    camera.left = -aspect;
    camera.right = aspect;
    camera.top = 1;
    camera.bottom = -1;
  } else {
    camera.left = -1;
    camera.right = 1;
    camera.top = 1 / aspect;
    camera.bottom = -1 / aspect;
  }
  camera.updateProjectionMatrix();
}

resize();
window.addEventListener('resize', resize);

export { scene, camera, renderer };
