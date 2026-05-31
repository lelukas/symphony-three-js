import * as THREE from 'three';
import { events } from './events';
import { config } from './config';
import { speedByRadiusProgress, speedByHitProgress, speedByTime, predictTotalHits } from './utils';

const { innerCircle: cfg } = config;

const initialBallRadius = cfg.initialRadius;
let ballRadius = initialBallRadius;
let maxBallRadius = 0;
const growthRate = cfg.growthRate;
const growthCooldownFrames = cfg.growthCooldownFrames;
let growthCooldown = 0;
const initialSpeed = cfg.initialSpeed;
const targetSpeed = cfg.targetSpeed;
const gravity = cfg.gravity;

const pos = new THREE.Vector3(0, 0, 0);
const vel = new THREE.Vector3(cfg.initialSpeed, 0, 0);
let ball: THREE.Mesh;
let gradientBall: THREE.Mesh;
let gradientMaterial: THREE.MeshBasicMaterial;
let bigRadius = 0;
let hitCount = 0;
let totalHits = 0;
let ongoingElapsed = 0;
let wasAtMaxSize = false;

function createGradientTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  for (let x = 0; x < size; x++) {
    const hue = (x / size) * 360;
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(x, 0, 1, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

export function init(scene: THREE.Scene, radius: number, segments: number) {
  bigRadius = radius;
  maxBallRadius = radius * cfg.maxBallRatio;
  totalHits = predictTotalHits(initialBallRadius, maxBallRadius, growthRate);

  ball = new THREE.Mesh(
    new THREE.CircleGeometry(initialBallRadius, segments),
    new THREE.MeshBasicMaterial({ color: cfg.color })
  );
  scene.add(ball);

  gradientMaterial = new THREE.MeshBasicMaterial({
    map: createGradientTexture(),
    transparent: true,
    opacity: 0,
  });
  gradientBall = new THREE.Mesh(
    new THREE.CircleGeometry(initialBallRadius, segments),
    gradientMaterial
  );
  scene.add(gradientBall);
}

export function reset() {
  pos.set(0, 0, 0);
  vel.set(cfg.initialSpeed, 0, 0);
  ballRadius = initialBallRadius;
  ball.scale.set(1, 1, 1);
  gradientBall.scale.set(1, 1, 1);
  hitCount = 0;
  growthCooldown = 0;
  ongoingElapsed = 0;
  wasAtMaxSize = false;
  gradientMaterial.opacity = 0;
  gradientMaterial.map!.offset.x = 0;
}

export function update(dt: number, deltaMs: number) {
  vel.y -= gravity * dt;
  pos.x += vel.x * dt;
  pos.y += vel.y * dt;

  const maxDist = bigRadius - ballRadius;
  const dist = pos.length();

  if (dist > maxDist) {
    const inward = pos.clone().normalize().multiplyScalar(-1);
    vel.reflect(inward);

    pos.copy(inward.clone().multiplyScalar(-(bigRadius - ballRadius)));

    const baseSpeed = speedByHitProgress(hitCount, totalHits, initialSpeed, targetSpeed);
    const currentTarget = wasAtMaxSize
      ? speedByTime(ongoingElapsed, cfg.ongoingSpeedTransition, baseSpeed, cfg.ongoingSpeed)
      : baseSpeed;

    vel.normalize().multiplyScalar(currentTarget);

    events.emit('hit');

    if (growthCooldown <= 0) {
      ballRadius = Math.min(ballRadius * growthRate, maxBallRadius);
      const scale = ballRadius / initialBallRadius;
      ball.scale.set(scale, scale, 1);
      gradientBall.scale.set(scale, scale, 1);
      hitCount++;
      growthCooldown = growthCooldownFrames;
    }
  }

  if (growthCooldown > 0) growthCooldown--;

  if (ballRadius >= maxBallRadius) {
    if (!wasAtMaxSize) {
      wasAtMaxSize = true;
      events.emit('ongoing');
    }
    ongoingElapsed += deltaMs;
    gradientMaterial.opacity = Math.min(ongoingElapsed / cfg.ongoingSpeedTransition, 1);
  }

  ball.position.copy(pos);
  gradientBall.position.copy(pos);
  if (wasAtMaxSize) {
    gradientMaterial.map!.offset.x -= 0.005;
  }
}
