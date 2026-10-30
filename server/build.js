const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('--- [BUILD] Starting Medieval Survivors Build & Verification ---');

// 1. Verify Environment Variables
const envPath = path.resolve(__dirname, '../.env.local');
const fallbackEnvPath = path.resolve(__dirname, '../.env');

let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✓ Found .env.local configuration file');
} else if (fs.existsSync(fallbackEnvPath)) {
  envContent = fs.readFileSync(fallbackEnvPath, 'utf8');
  console.log('✓ Found .env configuration file');
} else {
  console.error('✗ Error: Neither .env.local nor .env found!');
  process.exit(1);
}

if (!envContent.includes('DATABASE_URL')) {
  console.error('✗ Error: DATABASE_URL is missing in environment file!');
  process.exit(1);
}
console.log('✓ Verified DATABASE_URL presence in environment');

if (envContent.includes('NEON_AUTH_BASE_URL')) {
  console.log('✓ Verified NEON_AUTH_BASE_URL presence for Neon Auth');
}

// 2. Syntax Check Server files
const serverFiles = ['server.js', 'db.js', 'build.js'];
serverFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    execSync(`node -c "${filePath}"`);
    console.log(`✓ Syntax valid: server/${file}`);
  }
});

// 3. Syntax Check Game Scripts in AntiGravity/js/
const jsDir = path.resolve(__dirname, '../AntiGravity/js');
if (fs.existsSync(jsDir)) {
  const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
  jsFiles.forEach(file => {
    const fullPath = path.join(jsDir, file);
    execSync(`node -c "${fullPath}"`);
  });
  console.log(`✓ Syntax valid: all ${jsFiles.length} client-side game scripts in AntiGravity/js/`);
}

// 4. Verify Static Entrypoint
const indexPath = path.resolve(__dirname, '../AntiGravity/index.html');
if (fs.existsSync(indexPath)) {
  console.log('✓ Verified game entrypoint: AntiGravity/index.html');
} else {
  console.error('✗ Error: AntiGravity/index.html not found!');
  process.exit(1);
}

console.log('--- [BUILD] Build & Verification Complete: 0 ERRORS! ---');
process.exit(0);

