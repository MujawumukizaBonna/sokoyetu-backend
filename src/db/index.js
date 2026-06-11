require('dotenv').config();
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in .env file!');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  // Add these to handle connection drops gracefully
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10
});

// Handle unexpected errors on idle clients
pool.on('error', (err) => {
  console.error('Unexpected error on idle client:', err.message);
  // Don't crash — just log it
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to Supabase PostgreSQL ✓');
    release(); // ← this was missing before
  }
});

module.exports = pool;
