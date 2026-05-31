import * as THREE from 'three';
import { config } from './config';

const scene = new THREE.Scene();
scene.background = new THREE.Color(config.scene.background);

const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(
  aspect > 1 ? -aspect : -1,
  aspect > 1 ? aspect : 1,
  aspect > 1 ? 1 : 1 / aspect,
  aspect > 1 ? -1 : -1 / aspect,
  0.1, 10
);
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  const aspect = window.innerWidth / window.innerHeight;
  if (aspect > 1) {
    camera.left = -aspect;
    camera.right = aspect;
  } else {
    camera.top = 1 / aspect;
    camera.bottom = -1 / aspect;
  }
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

export { scene, camera, renderer };
