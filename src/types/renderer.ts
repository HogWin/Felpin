/**
 * The Fallen Kingdom - 3D & 2D Renderer Types
 */

import type * as THREE from 'three';

export interface RendererConfig {
  antialias: boolean;
  shadows: boolean;
  pixelRatio: number;
  highPerformance: boolean;
}

export interface FloatingDamageNumber {
  x: number;
  y: number;
  value: number;
  isCrit: boolean;
  color: string;
  lifetime: number;
  maxLifetime: number;
}

export interface ScreenEffect {
  type: 'vignette' | 'flash' | 'distortion';
  intensity: number;
  colorHex?: number;
  duration: number;
}

export interface IGameRenderer {
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  resize(): void;
  render(dt: number): void;
  destroy(): void;
}

