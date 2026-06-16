const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 3,
  min: 0,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 30000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected pool error:', err.message);
});

const connectWithRetry = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      console.log('Connected to Supabase PostgreSQL ✓');
      client.release();
      return;
    } catch (err) {
      console.error(`Connection attempt ${i + 1} failed: ${err.message}`);
      if (i < retries - 1) {
        console.log('Retrying in 3 seconds...');
        await new Promise(res => setTimeout(res, 3000));
      }
    }
  }
  console.error('Could not connect to database after multiple attempts.');
};

connectWithRetry();

module.exports = pool;

module.exports = pool;
