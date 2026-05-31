import * as THREE from 'three';

export function speedByRadiusProgress(
  ballRadius: number,
  initialBallRadius: number,
  maxBallRadius: number,
  initialSpeed: number,
  targetSpeed: number,
): number {
  const progress = (ballRadius - initialBallRadius) / (maxBallRadius - initialBallRadius);
  return initialSpeed + (targetSpeed - initialSpeed) * Math.min(progress, 1);
}

export function speedByHitProgress(
  hitCount: number,
  totalHits: number,
  initialSpeed: number,
  targetSpeed: number,
): number {
  const progress = Math.min(hitCount / totalHits, 1);
  return initialSpeed + (targetSpeed - initialSpeed) * progress;
}

export function speedByTime(
  elapsed: number,
  duration: number,
  startSpeed: number,
  endSpeed: number,
): number {
  const progress = Math.min(elapsed / duration, 1);
  return startSpeed + (endSpeed - startSpeed) * progress;
}

export function createCirclePoints(segments: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0));
  }
  return points;
}

export function predictTotalHits(
  initialBallRadius: number,
  maxBallRadius: number,
  growthRate: number,
): number {
  return Math.ceil(Math.log(maxBallRadius / initialBallRadius) / Math.log(growthRate));
}
