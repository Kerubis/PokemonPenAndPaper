import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

export const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? '',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'PokemonPenAndPaper',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function testConnection(): Promise<void> {
  const connection = await pool.getConnection();
  console.log('Connected to MySQL database:', process.env.DB_NAME ?? 'PokemonPenAndPaper');
  connection.release();
}

/**
 * Run all migration SQL files in order.
 * Each file uses CREATE TABLE IF NOT EXISTS so it is safe to run on every start.
 */
export async function runMigrations(): Promise<void> {
  const migrationsDir = path.join(__dirname, 'db', 'migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  const connection = await pool.getConnection();
  try {
    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      // Split on statement delimiter and execute each statement individually
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (const statement of statements) {
        try {
          await connection.execute(statement);
        } catch (err: any) {
          // 1060 = ER_DUP_FIELDNAME: column already exists, safe to ignore
          if (err?.errno === 1060) continue;
          throw err;
        }
      }
      console.log(`Migration applied: ${file}`);
    }
  } finally {
    connection.release();
  }
}

export default pool;
