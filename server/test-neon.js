const path = require('path');
const https = require('https');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const db = require('./db');

async function runEndToEndTests() {
  console.log('====================================================');
  console.log('🧪 Starting Neon Services End-to-End Verification');
  console.log('====================================================');

  let passed = 0;
  let total = 0;

  function report(name, ok, details = '') {
    total++;
    if (ok) {
      passed++;
      console.log(`[PASS] ${name}${details ? ` -> ${details}` : ''}`);
    } else {
      console.error(`[FAIL] ${name}${details ? ` -> ${details}` : ''}`);
    }
  }

  // TEST 1: Neon Postgres Connection & Health
  try {
    const health = await db.checkHealth();
    report('1. Neon Postgres Connection', health.status === 'connected', `Database: ${health.database}, Branch: ${health.branch}`);
  } catch (err) {
    report('1. Neon Postgres Connection', false, err.message);
  }

  // TEST 2: Schema Initialization (Tables & Indexes)
  try {
    const initialized = await db.initDatabase();
    report('2. Schema Migration & Table Verification', initialized, 'leaderboard and player_cloud_saves tables verified');
  } catch (err) {
    report('2. Schema Migration & Table Verification', false, err.message);
  }

  // TEST 3: Submit Score to Leaderboard
  let createdScoreId = null;
  const testPlayerName = 'Sir Galahad Test_' + Math.floor(Math.random() * 1000);
  try {
    const inserted = await db.submitScore({
      playerName: testPlayerName,
      classId: 'knight',
      timeSurvived: 420,
      level: 28,
      kills: 654,
      gold: 1250,
      hyperMode: true,
      curseRank: 3
    });
    createdScoreId = inserted.id;
    report('3. Write to Leaderboard Table', Boolean(createdScoreId), `Generated ID: ${createdScoreId}`);
  } catch (err) {
    report('3. Write to Leaderboard Table', false, err.message);
  }

  // TEST 4: Query Leaderboard
  try {
    const scores = await db.getLeaderboard(10);
    const found = scores.some(s => s.player_name === testPlayerName);
    report('4. Query Leaderboard Table', found && scores.length > 0, `Returned ${scores.length} entries, test run verified`);
  } catch (err) {
    report('4. Query Leaderboard Table', false, err.message);
  }

  // TEST 5: Cloud Save Sync
  const testUserId = 'test_user_' + Date.now();
  try {
    const saved = await db.saveCloudProgress(testUserId, {
      playerName: 'Paladino Neon',
      gold: 4500,
      forgeUpgrades: { damage: 5, armor: 3 },
      unlockedClasses: ['knight', 'ranger', 'paladin'],
      achievements: ['first_blood', 'hyper_survived_5min'],
      stats: { totalKills: 890 }
    });
    
    const loaded = await db.getCloudSave(testUserId);
    const valid = loaded && loaded.user_id === testUserId && loaded.gold === 4500;
    report('5. Cloud Save Persistence (JSONB Sync)', valid, `Saved & reloaded profile for ${loaded.player_name}`);
  } catch (err) {
    report('5. Cloud Save Persistence (JSONB Sync)', false, err.message);
  }

  // TEST 6: Neon Auth JWKS Endpoint
  if (process.env.NEON_AUTH_JWKS_URL) {
    try {
      const authStatus = await new Promise((resolve, reject) => {
        https.get(process.env.NEON_AUTH_JWKS_URL, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const parsed = JSON.parse(data);
              resolve({ statusCode: res.statusCode, hasKeys: Array.isArray(parsed.keys) && parsed.keys.length > 0 });
            } catch (e) {
              resolve({ statusCode: res.statusCode, hasKeys: false });
            }
          });
        }).on('error', reject);
      });

      report('6. Neon Auth JWKS Key Provider', authStatus.statusCode === 200 && authStatus.hasKeys, `HTTP 200 with EdDSA/JWT keys`);
    } catch (err) {
      report('6. Neon Auth JWKS Key Provider', false, err.message);
    }
  } else {
    report('6. Neon Auth JWKS Key Provider', false, 'NEON_AUTH_JWKS_URL not defined');
  }

  // TEST 7: User Registration in Neon Postgres
  const testWarriorUser = 'galahad_' + Date.now();
  let registeredUser = null;
  try {
    registeredUser = await db.registerUser(testWarriorUser, 'holy_grail_99', 'Sir Galahad o Justo');
    report('7. User Registration (Neon Postgres)', Boolean(registeredUser && registeredUser.id), `Created user ID: ${registeredUser.id}, Name: ${registeredUser.display_name}`);
  } catch (err) {
    report('7. User Registration (Neon Postgres)', false, err.message);
  }

  // TEST 8: User Login & Password Hash Verification
  try {
    const loggedIn = await db.loginUser(testWarriorUser, 'holy_grail_99');
    let wrongRejected = false;
    try {
      await db.loginUser(testWarriorUser, 'wrong_pass');
    } catch (e) {
      wrongRejected = true;
    }
    report('8. User Login & Password Hash Verification', Boolean(loggedIn && wrongRejected), `Authenticated ${loggedIn.displayName}, invalid password safely rejected`);
  } catch (err) {
    report('8. User Login & Password Hash Verification', false, err.message);
  }

  console.log('====================================================');
  console.log(`📊 Test Results: ${passed}/${total} passed`);
  console.log('====================================================');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

if (require.main === module) {
  runEndToEndTests();
}

module.exports = { runEndToEndTests };

