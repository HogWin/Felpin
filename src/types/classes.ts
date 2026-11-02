/**
 * The Fallen Kingdom - Character Classes & Skill Tree Types
 */

export type ClassId =
  | 'knight'
  | 'ranger'
  | 'pyromancer'
  | 'paladin'
  | 'berserker'
  | 'necromancer'
  | 'assassin'
  | 'dark_knight'
  | 'plague_alchemist';

export interface ClassStats {
  maxHp: number;
  speed: number;
  armor: number;
  recovery: number;
  might: number;
  area: number;
  cooldown: number;
  growth: number;
  luck: number;
  magnet: number;
}

export interface ClassDefinition {
  id: ClassId;
  name: string;
  title: string;
  role: string;
  startingWeaponId: string;
  startingPassiveId?: string;
  description: string;
  stats: ClassStats;
  specialPassiveDescription: string;
  unlockedByDefault: boolean;
  unlockCostEther?: number;
}

export interface SkillNode {
  id: string;
  classId: ClassId;
  name: string;
  description: string;
  icon: string;
  tier: number;
  costEther: number;
  prerequisites: string[];
  statsBonus: Partial<ClassStats>;
  customEffectId?: string;
}

export interface SkillTreeBranch {
  classId: ClassId;
  nodes: Record<string, SkillNode>;
}

