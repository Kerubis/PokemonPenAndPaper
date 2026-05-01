import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET /api/example
router.get('/', async (_req: Request, res: Response) => {
  const [rows] = await pool.query('SELECT 1 + 1 AS result');
  res.json({ data: rows });
});

export default router;
