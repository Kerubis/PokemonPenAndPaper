import mysql from 'mysql2/promise';

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

export default pool;
