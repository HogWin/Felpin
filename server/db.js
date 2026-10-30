const path = require('path');
const crypto = require('crypto');
const dotenv = require('dotenv');

// Load .env.local first, fallback to .env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { neon } = require('@neondatabase/serverless');

const DEFAULT_DATABASE_URL = "postgresql://neondb_owner:npg_HscA2Cl5IFxB@ep-proud-fog-b6nfc99w-pooler.c-2.sa-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";
const DEFAULT_AUTH_BASE = "https://ep-proud-fog-b6nfc99w.neonauth.c-2.sa-east-1.aws.neon.tech/neondb/auth";

const dbUrl = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;
const sql = neon(dbUrl);

/**
 * Password hashing with salt using Node.js crypto (zero-dependency, secure)
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored || !stored.includes(':')) return false;
  const [salt, originalHash] = stored.split(':');
  if (!salt || !originalHash) return false;
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
  } catch (e) {
    return false;
  }
}

/**
 * Initializes required Postgres tables in Neon if they do not exist.
 */
async function initDatabase() {
  try {
    // 1. Leaderboard Table
    await sql.query(`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id SERIAL PRIMARY KEY,
        player_name VARCHAR(60) NOT NULL,
        class_id VARCHAR(40) NOT NULL,
        time_survived_seconds INT NOT NULL,
        level INT NOT NULL,
        kills INT NOT NULL,
        gold INT NOT NULL,
        hyper_mode BOOLEAN DEFAULT FALSE,
        curse_rank INT DEFAULT 0,
        is_ranked BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Ensure is_ranked column exists on older tables
    await sql.query(`
      ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS is_ranked BOOLEAN DEFAULT TRUE;
    `);

    await sql.query(`
      CREATE INDEX IF NOT EXISTS idx_leaderboard_time_kills 
      ON leaderboard (time_survived_seconds DESC, kills DESC);
    `);

    // 2. Cloud Saves Table
    await sql.query(`
      CREATE TABLE IF NOT EXISTS player_cloud_saves (
        user_id VARCHAR(80) PRIMARY KEY,
        player_name VARCHAR(60) DEFAULT 'Cavaleiro',
        gold INT DEFAULT 0,
        forge_upgrades JSONB DEFAULT '{}'::jsonb,
        unlocked_classes JSONB DEFAULT '[]'::jsonb,
        achievements JSONB DEFAULT '[]'::jsonb,
        stats JSONB DEFAULT '{}'::jsonb,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 3. User Authentication Table
    await sql.query(`
      CREATE TABLE IF NOT EXISTS game_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        display_name VARCHAR(60) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await sql.query(`
      CREATE INDEX IF NOT EXISTS idx_game_users_username_lower 
      ON game_users (LOWER(username));
    `);

    console.log('[Neon DB] Database tables verified & ready on branch:', process.env.NEON_BRANCH || 'production');
    return true;
  } catch (err) {
    console.error('[Neon DB] Schema initialization error:', err.message);
    throw err;
  }
}

async function checkHealth() {
  const result = await sql.query('SELECT NOW() AS server_time, current_database() AS db_name, version();');
  return {
    status: 'connected',
    branch: process.env.NEON_BRANCH || 'production',
    serverTime: result[0].server_time,
    database: result[0].db_name,
    authBaseUrl: process.env.NEON_AUTH_BASE_URL || null
  };
}

async function registerUser(username, password, displayName) {
  const cleanUser = String(username || '').trim().toLowerCase();
  const cleanPass = String(password || '').trim();
  const cleanDisplay = String(displayName || username || '').trim();

  if (!cleanUser || cleanUser.length < 3) {
    throw new Error('O nome de usuário deve ter pelo menos 3 caracteres.');
  }
  if (!cleanPass || cleanPass.length < 4) {
    throw new Error('A palavra-passe deve ter pelo menos 4 caracteres.');
  }

  // Check if username already exists
  const existing = await sql.query('SELECT id FROM game_users WHERE LOWER(username) = $1 LIMIT 1', [cleanUser]);
  if (existing.length > 0) {
    throw new Error('Este combatente já jurou lealdade ao reino (usuário já existe).');
  }

  const passHash = hashPassword(cleanPass);
  const result = await sql.query(`
    INSERT INTO game_users (username, password_hash, display_name)
    VALUES ($1, $2, $3)
    RETURNING id, username, display_name, created_at;
  `, [cleanUser, passHash, cleanDisplay]);

  return result[0];
}

async function loginUser(username, password) {
  const cleanUser = String(username || '').trim().toLowerCase();
  const cleanPass = String(password || '').trim();

  if (!cleanUser || !cleanPass) {
    throw new Error('Informe o nome de guerreiro e a palavra-passe.');
  }

  const users = await sql.query(`
    SELECT id, username, password_hash, display_name, created_at
    FROM game_users
    WHERE LOWER(username) = $1
    LIMIT 1;
  `, [cleanUser]);

  if (users.length === 0) {
    throw new Error('Combatente não encontrado nos anais do reino.');
  }

  const user = users[0];
  const isValid = verifyPassword(cleanPass, user.password_hash);
  if (!isValid) {
    throw new Error('Palavra-passe incorreta.');
  }

  // Update last_login
  await sql.query('UPDATE game_users SET last_login = NOW() WHERE id = $1', [user.id]);

  return {
    id: user.id,
    username: user.username,
    displayName: user.display_name,
    createdAt: user.created_at
  };
}

async function getLeaderboard(limit = 10) {
  const clampedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  return await sql.query(`
    SELECT id, player_name, class_id, time_survived_seconds, level, kills, gold, hyper_mode, curse_rank, is_ranked, created_at
    FROM leaderboard
    WHERE is_ranked IS NOT FALSE
    ORDER BY time_survived_seconds DESC, kills DESC
    LIMIT ${clampedLimit};
  `);
}

async function submitScore(data) {
  const {
    playerName = 'Cavaleiro Anônimo',
    classId = 'knight',
    timeSurvived = 0,
    level = 1,
    kills = 0,
    gold = 0,
    hyperMode = false,
    curseRank = 0,
    isRanked = true
  } = data;

  const safeName = String(playerName).slice(0, 50).trim() || 'Cavaleiro Anônimo';
  const safeClass = String(classId).slice(0, 30).trim();
  const safeTime = Math.max(0, parseInt(timeSurvived, 10) || 0);
  const safeLevel = Math.max(1, parseInt(level, 10) || 1);
  const safeKills = Math.max(0, parseInt(kills, 10) || 0);
  const safeGold = Math.max(0, parseInt(gold, 10) || 0);
  const safeHyper = Boolean(hyperMode);
  const safeCurse = Math.max(0, parseInt(curseRank, 10) || 0);
  const safeRanked = Boolean(isRanked);

  const res = await sql.query(`
    INSERT INTO leaderboard (player_name, class_id, time_survived_seconds, level, kills, gold, hyper_mode, curse_rank, is_ranked)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id, created_at;
  `, [safeName, safeClass, safeTime, safeLevel, safeKills, safeGold, safeHyper, safeCurse, safeRanked]);

  return res[0];
}

async function getCloudSave(userId) {
  if (!userId) return null;
  const res = await sql.query(`
    SELECT user_id, player_name, gold, forge_upgrades, unlocked_classes, achievements, stats, updated_at
    FROM player_cloud_saves
    WHERE user_id = $1
    LIMIT 1;
  `, [String(userId)]);

  return res[0] || null;
}

async function saveCloudProgress(userId, data) {
  if (!userId) throw new Error('userId is required for cloud save');

  const {
    playerName = 'Cavaleiro',
    gold = 0,
    forgeUpgrades = {},
    unlockedClasses = [],
    achievements = [],
    stats = {}
  } = data;

  const res = await sql.query(`
    INSERT INTO player_cloud_saves (user_id, player_name, gold, forge_upgrades, unlocked_classes, achievements, stats, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      player_name = EXCLUDED.player_name,
      gold = EXCLUDED.gold,
      forge_upgrades = EXCLUDED.forge_upgrades,
      unlocked_classes = EXCLUDED.unlocked_classes,
      achievements = EXCLUDED.achievements,
      stats = EXCLUDED.stats,
      updated_at = NOW()
    RETURNING user_id, updated_at;
  `, [
    String(userId),
    String(playerName).slice(0, 50),
    parseInt(gold, 10) || 0,
    JSON.stringify(forgeUpgrades),
    JSON.stringify(unlockedClasses),
    JSON.stringify(achievements),
    JSON.stringify(stats)
  ]);

  return res[0];
}

module.exports = {
  sql,
  initDatabase,
  checkHealth,
  registerUser,
  loginUser,
  getLeaderboard,
  submitScore,
  getCloudSave,
  saveCloudProgress
};
