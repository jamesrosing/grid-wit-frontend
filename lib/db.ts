import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || '5432'),
  ssl: {
    rejectUnauthorized: false
  }
})

// Create tables if they don't exist
async function initDb() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_puzzle_states (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        puzzle_id INTEGER NOT NULL,
        is_favorite BOOLEAN DEFAULT FALSE,
        last_played_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        progress JSONB,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, puzzle_id)
      );
    `)
  } finally {
    client.release()
  }
}

initDb().catch(console.error)

export { pool } 