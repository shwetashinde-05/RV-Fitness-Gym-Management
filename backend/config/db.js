const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const DB_PORT = process.env.DB_PORT || 5433;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_NAME = process.env.DB_NAME || 'rv_fitness_db';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';

let isPgConnected = false;
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  connectionTimeoutMillis: 2500,
});

// Persistent local store file for zero-setup execution fallback
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const localDbPath = path.join(dataDir, 'rv_fitness_store.json');

// Essential system administrator account
const systemUsers = [
  {
    id: 1,
    email: 'admin@rvfitness.in',
    password: 'admin123',
    name: 'Administrator',
    role: 'admin',
    related_id: null,
    phone: '+91 98230 12345',
    status: 'Active',
    created_at: new Date().toISOString()
  }
];

const cleanStore = {
  users: systemUsers,
  members: [],
  trainers: [],
  membership_plans: [],
  member_memberships: [],
  payments: [],
  attendance: [],
  workout_plans: [],
  diet_plans: [],
  progress_records: [],
  notifications: [],
  gym_settings: {
    gym_name: 'RV FITNESS',
    tagline: 'Fitness & Strength Center',
    address: 'Near Datta Mandir, Narsobawadi, Tal. Shirol, Dist. Kolhapur, Maharashtra 416104, India',
    phone: '+91 98230 12345',
    email: 'contact@rvfitness.in',
    currency: '₹',
    opening_hours: 'Mon-Sat: 5:30 AM - 10:00 PM | Sun: 6:00 AM - 1:00 PM',
    admin_name: 'Administrator',
    admin_email: 'admin@rvfitness.in'
  }
};

function getStore() {
  try {
    if (!fs.existsSync(localDbPath)) {
      fs.writeFileSync(localDbPath, JSON.stringify(cleanStore, null, 2));
      return cleanStore;
    }
    const raw = fs.readFileSync(localDbPath, 'utf8');
    const store = JSON.parse(raw);

    // Ensure system admin exists
    if (!store.users || store.users.length === 0) {
      store.users = systemUsers;
      fs.writeFileSync(localDbPath, JSON.stringify(store, null, 2));
    }
    return store;
  } catch (err) {
    return cleanStore;
  }
}

function saveStore(store) {
  try {
    fs.writeFileSync(localDbPath, JSON.stringify(store, null, 2));
  } catch (err) {
    console.error('Failed to persist store:', err);
  }
}

// Automatic PostgreSQL Schema Migration runner
async function initializePostgres() {
  try {
    const client = await pool.connect();
    console.log(`[PostgreSQL] Connected successfully to rv_fitness_db on port ${DB_PORT}!`);
    isPgConnected = true;

    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const ddl = fs.readFileSync(schemaPath, 'utf8');
      await client.query(ddl);
      console.log('[PostgreSQL] Database tables initialized and verified.');

      // Check if admin user exists in PostgreSQL
      const userCheck = await client.query('SELECT id FROM users WHERE email = $1', ['admin@rvfitness.in']);
      if (userCheck.rows.length === 0) {
        await client.query(
          `INSERT INTO users (email, password, name, role, phone, status) VALUES ($1, $2, $3, $4, $5, $6)`,
          ['admin@rvfitness.in', 'admin123', 'Administrator', 'admin', '+91 98230 12345', 'Active']
        );
      }
    }
    client.release();
  } catch (err) {
    console.warn(`[PostgreSQL] Notice: PostgreSQL offline on port ${DB_PORT} (${err.message}). Using local verified persistent store.`);
    isPgConnected = false;
  }
}

initializePostgres();

module.exports = {
  pool,
  isPgConnected: () => isPgConnected,
  getStore,
  saveStore,
  cleanStore
};
