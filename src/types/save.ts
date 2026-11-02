/**
 * The Fallen Kingdom - Save Data & Cloud Sync Schema
 */

import { GameSettings, RunStats } from './game.js';
import { ClassId } from './classes.js';

export interface MetaUpgradeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  statBonusPerLevel: number;
}

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  rewardType: 'gold' | 'ether' | 'character' | 'weapon';
  rewardValue: number | string;
}

export interface SaveDataSchema {
  version: number;
  gold: number;
  totalGoldEarned: number;
  ether: number;
  totalEtherEarned: number;
  metaUpgrades: Record<string, number>;
  skillTrees: Record<ClassId, string[]>;
  unlockedClasses: ClassId[];
  unlockedAchievements: Record<string, boolean>;
  discoveredSynergies: string[];
  settings: GameSettings;
  stats: {
    totalEnemiesSlain: number;
    totalRuns: number;
    totalTimePlayedSeconds: number;
    bestRunSeconds: number;
  };
  history: RunStats[];
}

export interface CloudSavePayload {
  userId: string;
  data: SaveDataSchema;
  updatedAt: string;
}

