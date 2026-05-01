import 'dotenv/config';
import express from 'express';
import { testConnection } from './db';
import exampleRouter from './routes/example';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/example', exampleRouter);

async function bootstrap() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

bootstrap().catch(console.error);
