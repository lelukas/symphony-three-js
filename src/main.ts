import { scene, camera, renderer } from './setup';
import { config } from './config';
import * as innerCircle from './innerCircle';
import * as outerCircle from './outerCircle';
import * as bgPlane from './bgPlane';
import * as audio from './audio';
import * as ripple from './ripple';
import * as gifPlane from './gifPlane';
import { create, createRestartButton } from './overlay';
import { events } from './events';

outerCircle.init(scene, config.bigRadius, config.segments);
innerCircle.init(scene, config.bigRadius, config.segments);
bgPlane.init(scene);
ripple.init(scene);
gifPlane.init(scene);
audio.init();

renderer.render(scene, camera);

let rafId = 0;

function startLoop() {
  let prevTime = performance.now();
  function animate(time: number) {
    rafId = requestAnimationFrame(animate);

    const deltaMs = Math.min(time - prevTime, 50);
    const frameDuration = 16.667;
    const dtCap = 3;
    const dt = Math.min(deltaMs / frameDuration, dtCap);
    prevTime = time;

    innerCircle.update(dt, deltaMs);
    outerCircle.update(deltaMs);
    bgPlane.update(deltaMs);
    ripple.update(deltaMs);
    gifPlane.update(deltaMs);
    audio.update(deltaMs);

    renderer.render(scene, camera);
  }
  animate(performance.now());
}

function restart() {
  cancelAnimationFrame(rafId);
  innerCircle.reset();
  outerCircle.reset();
  bgPlane.reset();
  ripple.reset();
  gifPlane.reset();
  audio.reset();
  startLoop();
}

events.on('complete', () => {
  createRestartButton().then(restart);
});

create().then(() => {
  audio.prime();
  startLoop();
});
