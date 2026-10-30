const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables (.env.local, .env)
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Lazy database schema initialization (vital for Vercel serverless cold starts)
let initDbPromise = null;
function ensureDbInit() {
  if (!initDbPromise) {
    initDbPromise = db.initDatabase().catch(err => {
      console.error('[DB] Lazy initialization error:', err.message);
      initDbPromise = null;
    });
  }
  return initDbPromise;
}

const DEFAULT_AUTH_BASE = "https://ep-proud-fog-b6nfc99w.neonauth.c-2.sa-east-1.aws.neon.tech/neondb/auth";

app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
    try {
      await ensureDbInit();
    } catch (e) {
      // Ignored, individual route will report specific DB error
    }
  }
  next();
});

// Serve static frontend files from AntiGravity directory
const staticPath = path.resolve(__dirname, '../AntiGravity');
app.use(express.static(staticPath));

// API 1: Health check & Service status
app.get('/api/health', async (req, res) => {
  try {
    const health = await db.checkHealth();
    const authUrl = process.env.NEON_AUTH_BASE_URL || DEFAULT_AUTH_BASE;
    res.json({
      status: 'ok',
      service: 'The Fallen Kingdom Backend',
      postgres: health,
      auth: {
        enabled: Boolean(authUrl),
        baseUrl: authUrl,
        jwksUrl: `${authUrl}/.well-known/jwks.json`
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// API 2: Auth configuration for client-side identity
app.get('/api/auth/config', (req, res) => {
  const authUrl = process.env.NEON_AUTH_BASE_URL || DEFAULT_AUTH_BASE;
  res.json({
    authBaseUrl: authUrl,
    jwksUrl: `${authUrl}/.well-known/jwks.json`,
    branch: process.env.NEON_BRANCH || 'production'
  });
});

// API 2.1: Register a new player account (Neon Postgres)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, displayName } = req.body;
    const user = await db.registerUser(username, password, displayName);
    res.json({ success: true, user, message: 'Combatente consagrado com sucesso!' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// API 2.2: Login player account (Neon Postgres)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db.loginUser(username, password);
    res.json({ success: true, user, message: 'Bem-vindo de volta ao reino, nobre guerreiro!' });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
});

// API 3: Get Global Leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const scores = await db.getLeaderboard(limit);
    res.json({ success: true, scores });
  } catch (err) {
    console.error('[API] Error fetching leaderboard:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API 4: Submit Score to Leaderboard (Only Competitive Ranked Runs are recorded)
app.post('/api/leaderboard', async (req, res) => {
  try {
    if (req.body.isRanked === false || req.body.isRanked === 'false') {
      return res.status(400).json({ 
        success: false, 
        message: 'Apenas partidas disputadas no Modo Competitivo são computadas no Placar Oficial.' 
      });
    }
    const saved = await db.submitScore(req.body);
    res.json({ success: true, id: saved.id, createdAt: saved.created_at });
  } catch (err) {
    console.error('[API] Error submitting score:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API 5: Get Cloud Save for user
app.get('/api/cloud-save/:userId', async (req, res) => {
  try {
    const save = await db.getCloudSave(req.params.userId);
    if (!save) {
      return res.status(404).json({ success: false, message: 'Save not found' });
    }
    res.json({ success: true, save });
  } catch (err) {
    console.error('[API] Error fetching save:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API 6: Save Player Cloud Progress
app.post('/api/cloud-save', async (req, res) => {
  try {
    const { userId, ...data } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }
    const result = await db.saveCloudProgress(userId, data);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('[API] Error writing cloud save:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Catch-all route to serve the game index.html (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Initialize DB schema and start server if run directly
if (require.main === module) {
  db.initDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(`🏰 The Fallen Kingdom Server running on port ${PORT}`);
        console.log(`⚡ Connected to Neon Postgres (${process.env.NEON_BRANCH || 'production'})`);
        console.log(`🔐 Neon Auth Base: ${process.env.NEON_AUTH_BASE_URL || 'Not configured'}`);
        console.log(`🎮 Game playable at: http://localhost:${PORT}`);
        console.log(`====================================================`);
      });
    })
    .catch(err => {
      console.error('[Server] Fatal: Database initialization failed:', err);
      process.exit(1);
    });
}

module.exports = app;
