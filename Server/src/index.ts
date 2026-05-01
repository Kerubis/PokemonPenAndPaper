import 'dotenv/config';
import http from 'http';
import express from 'express';
import { WebSocketServer } from 'ws';
import { testConnection, runMigrations } from './db';
import exampleRouter from './routes/example';
import { handleMessage } from './ws/gameHandler';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/example', exampleRouter);

// Attach WebSocket server to the same HTTP server so it can share the port.
const httpServer = http.createServer(app);

const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

wss.on('connection', (ws, req) => {
  console.log('WebSocket client connected from', req.socket.remoteAddress);

  ws.on('message', (data) => {
    handleMessage(ws, data.toString());
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

async function bootstrap() {
  await testConnection();
  await runMigrations();
  httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} (HTTP + WebSocket /ws)`);
  });
}

bootstrap().catch(console.error);
