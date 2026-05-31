import * as THREE from 'three';

type EventMap = {
  hit: { type: 'hit' };
  fadeStart: { type: 'fadeStart' };
  fadeEnd: { type: 'fadeEnd' };
  complete: { type: 'complete' };
  ongoing: { type: 'ongoing' };
};

const dispatcher = new THREE.EventDispatcher<EventMap>();

export const events = {
  on<K extends keyof EventMap>(type: K, fn: (e: EventMap[K]) => void) {
    dispatcher.addEventListener(type, fn);
  },
  emit<K extends keyof EventMap>(type: K) {
    dispatcher.dispatchEvent({ type } as EventMap[keyof EventMap]);
  },
};
