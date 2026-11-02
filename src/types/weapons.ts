/**
 * The Fallen Kingdom - Weapon, Evolution & Synergy Types
 */

import { IPlayer } from './entities.js';

export type WeaponType = 'projectile' | 'aoe' | 'orbit' | 'melee' | 'strike' | 'pool';

export interface WeaponLevelStat {
  damage?: number;
  cooldown?: number;
  area?: number;
  count?: number;
  speed?: number;
  duration?: number;
  pierce?: number;
  description: string;
}

export interface WeaponDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: WeaponType;
  baseCooldown: number;
  baseDamage: number;
  baseArea: number;
  baseCount: number;
  baseSpeed: number;
  baseDuration: number;
  basePierce: number;
  levels: WeaponLevelStat[];
  requiredPassiveForEvolution?: string;
  evolutionResultId?: string;
  isEvolution?: boolean;
  isSupreme?: boolean;
}

export interface PassiveDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  maxLevel: number;
  statModified: string;
  valuePerLevel: number;
}

export interface SynergyDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  primaryWeaponId: string;
  secondaryWeaponOrPassiveId: string;
  resultWeaponId: string;
  tier: 'evolved' | 'supreme' | 'ascended';
}

export interface UpgradeOption {
  type: 'weapon_new' | 'weapon_upgrade' | 'passive_new' | 'passive_upgrade' | 'evolution' | 'gold_bag';
  item: WeaponDefinition | PassiveDefinition | SynergyDefinition;
  currentLevel: number;
  nextLevel: number;
  description: string;
}

export interface IWeaponInstance {
  definition: WeaponDefinition;
  level: number;
  timer: number;
  isEvolved: boolean;
  isSupreme: boolean;
  update(dt: number, player: IPlayer): void;
  fire(player: IPlayer): void;
}

