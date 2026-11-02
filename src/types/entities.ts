/**
 * The Fallen Kingdom - Entity & Combat Types
 */

export interface IVector2D {
  x: number;
  y: number;
}

export interface IEntity extends IVector2D {
  id: string | number;
  radius: number;
  alive: boolean;
  maxHp: number;
  hp: number;
  speed: number;
  takeDamage(amount: number, isCritical?: boolean, sourceWeaponId?: string): number;
}

export interface IPlayer extends IEntity {
  classId: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  gold: number;
  ether: number;
  armor: number;
  recovery: number;
  might: number;
  cooldownReduction: number;
  areaMultiplier: number;
  projectileSpeedMultiplier: number;
  durationMultiplier: number;
  luck: number;
  growth: number;
  magnetRadius: number;
  revivesRemaining: number;
  aimAngle: number;
  isInvulnerable: boolean;
  gainXp(amount: number): boolean;
  heal(amount: number): void;
}

export type EnemyRarity = 'normal' | 'elite' | 'champion' | 'boss';

export interface IEnemy extends IEntity {
  rarity: EnemyRarity;
  damage: number;
  xpValue: number;
  goldValue: number;
  etherValue: number;
  colorHex?: number;
  isStunned: boolean;
  freezeTimer: number;
  bleedStacks: number;
  poisonTimer: number;
  specialAbility?: string;
  update(dt: number, player: IPlayer): void;
}

export interface IProjectile extends IVector2D {
  id: string | number;
  vx: number;
  vy: number;
  damage: number;
  pierce: number;
  duration: number;
  maxDuration: number;
  alive: boolean;
  isEvolved?: boolean;
  isSupreme?: boolean;
  sourceWeaponId: string;
  update(dt: number): void;
}

export interface IXpGem extends IVector2D {
  id: string | number;
  value: number;
  color: string;
  isMagnetized: boolean;
  speed: number;
}

export interface ITreasureChest extends IVector2D {
  id: string | number;
  tier: 'silver' | 'gold' | 'celestial';
  opened: boolean;
}

