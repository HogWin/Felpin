/**
 * The Fallen Kingdom - Core TypeScript Type Definitions
 */

declare namespace MedievalSurvivors {
  type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'LEVEL_UP' | 'CHEST' | 'GAME_OVER' | 'VICTORY';

  interface GameSettings {
    soundEnabled: boolean;
    masterVolume: number;
    sfxVolume: number;
    bgmVolume: number;
    mouseAim: boolean;
    highPerformanceMode: boolean;
    screenShake: boolean;
    damageNumbers: boolean;
    hyperMode?: boolean;
    curseRank?: number;
    isRankedMode?: boolean;
    graphicsQuality?: 'low' | 'medium' | 'high';
  }

  interface RunStats {
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

  interface IVector2D {
    x: number;
    y: number;
  }

  interface IEntity extends IVector2D {
    id: string | number;
    radius: number;
    alive: boolean;
    maxHp: number;
    hp: number;
    speed: number;
    takeDamage(amount: number, isCritical?: boolean, sourceWeaponId?: string): number;
  }

  interface IPlayer extends IEntity {
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

  interface IEnemy extends IEntity {
    rarity: 'normal' | 'elite' | 'champion' | 'boss';
    damage: number;
    xpValue: number;
    goldValue: number;
    etherValue: number;
    isStunned: boolean;
    freezeTimer: number;
    bleedStacks: number;
    poisonTimer: number;
    update(dt: number, player: IPlayer): void;
  }

  interface WeaponDefinition {
    id: string;
    name: string;
    icon: string;
    description: string;
    type: 'projectile' | 'aoe' | 'orbit' | 'melee' | 'strike' | 'pool';
    baseCooldown: number;
    baseDamage: number;
    baseArea: number;
    baseCount: number;
    baseSpeed: number;
    baseDuration: number;
    basePierce: number;
  }

  interface SaveDataSchema {
    version: number;
    gold: number;
    ether: number;
    metaUpgrades: Record<string, number>;
    skillTrees: Record<string, string[]>;
    unlockedAchievements: Record<string, boolean>;
    settings: GameSettings;
  }

  interface UIControllerInstance {
    game: any;
    currentMenuTab: string;
    openMainMenu(tab?: string): void;
    closeMainMenu(): void;
    switchMenuTab(tab: string): void;
    showToast(message: string, type?: string): void;
  }

  let game: any;
  let sound: any;
  let saveManager: any;
  let models3d: any;
  let map3d: any;
  let UIController: any;
  let Game: any;
  let GameRenderer: any;
  let ParticleSystem: any;
  let WaveDirector: any;
  let ArenaEventManager: any;
}

declare let THREE: any;
