/**
 * The Fallen Kingdom - Core Game Types
 */

export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'LEVEL_UP' | 'CHEST' | 'GAME_OVER' | 'VICTORY';

export interface GameSettings {
  soundEnabled: boolean;
  masterVolume: number; // 0.0 a 1.0
  sfxVolume: number;
  bgmVolume: number;
  mouseAim: boolean;
  highPerformanceMode: boolean;
  screenShake: boolean;
  damageNumbers: boolean;
}

export interface RunStats {
  kills: number;
  goldCollected: number;
  etherCollected: number;
  timeAlive: number;
  damageDealt: number;
  damageTaken: number;
  levelReached: number;
  hyperModeActive: boolean;
  curseModeActive: boolean;
  classId: string;
}

export interface InputState {
  keys: Record<string, boolean>;
  pointerX: number;
  pointerY: number;
  pointerScreenX: number;
  pointerScreenY: number;
  isPointerDown: boolean;
  joystickActive: boolean;
  joystickVector: { x: number; y: number };
}

export interface GameModeModifiers {
  hyper: {
    playerSpeedMultiplier: number;
    enemySpeedMultiplier: number;
    goldMultiplier: number;
  };
  curse: {
    enemyHpMultiplier: number;
    enemySpeedMultiplier: number;
    enemySpawnRateMultiplier: number;
    etherMultiplier: number;
  };
}

