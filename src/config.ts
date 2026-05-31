export const config = {
  segments: 80,
  bigRadius: 0.9,

  debounceDuration: 400,
  fadeOutDuration: 200,

  outerCircle: {
    hitColor: 0xff5533,
    restColor: 0x888888,
    linewidth: 3,
  },

  innerCircle: {
    initialRadius: 0.04,
    color: 0xffffff,
    gradientColor: 0x3355ff,
    gravity: 0.0009,
    maxBallRatio: 0.95,
    growthRate: 1.04,
    growthCooldownFrames: 10,
    maxSizeThreshold: 0.99,
    initialSpeed: 0.05,
    targetSpeed: 0.02,
    ongoingSpeed: 0.06,
    ongoingSpeedTransition: 1000,
  },

  bgPlane: {
    color: 0x111122,
  },

  gifSprite: {
    frameCols: 11,
    frameRows: 4,
    fps: 33.33,
    scale: 0.3,
  },

  ripple: {
    maxActive: 30,
    duration: 1000,
    expandTo: 1.5,
    transitionEvery: 5,
  },

  scene: {
    background: 0x000000,
  },
};
