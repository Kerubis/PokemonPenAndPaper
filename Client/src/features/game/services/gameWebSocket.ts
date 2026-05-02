// ============================================================
// Singleton WebSocket connection to the game server
// ============================================================

type PendingRequest = {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
};

const WS_URL = (import.meta as any).env?.VITE_WS_URL ?? 'ws://localhost:3000/ws';

// Exponential-backoff reconnection constants
const RECONNECT_BASE_MS = 1_000;
const RECONNECT_MAX_MS  = 30_000;
let reconnectAttempt = 0;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

let socket: WebSocket | null = null;
let connected = false;
const pendingRequests = new Map<string, PendingRequest>();
const messageQueue: string[] = [];
const openListeners: Array<() => void> = [];

function getSocket(): WebSocket {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return socket;
  }

  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    connected = true;
    reconnectAttempt = 0;
    if (reconnectTimer !== null) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    // Flush queued messages
    while (messageQueue.length) {
      socket!.send(messageQueue.shift()!);
    }
    openListeners.forEach(fn => fn());
  };

  socket.onmessage = (event) => {
    let msg: { id?: string; type: string; payload?: unknown; message?: string };
    try {
      msg = JSON.parse(event.data as string);
    } catch {
      console.error('[WS] Failed to parse message:', event.data);
      return;
    }

    const id = msg.id ?? '';
    const pending = pendingRequests.get(id);
    if (pending) {
      pendingRequests.delete(id);
      if (msg.type === 'ERROR') {
        pending.reject(new Error(msg.message ?? 'Server error'));
      } else {
        pending.resolve(msg);
      }
    }
  };

  socket.onerror = (err) => {
    console.error('[WS] Socket error:', err);
  };

  socket.onclose = () => {
    connected = false;
    // Reject all pending requests
    for (const [, pending] of pendingRequests) {
      pending.reject(new Error('WebSocket closed'));
    }
    pendingRequests.clear();
    socket = null;

    // Schedule reconnection with exponential backoff
    const delay = Math.min(RECONNECT_BASE_MS * 2 ** reconnectAttempt, RECONNECT_MAX_MS);
    reconnectAttempt++;
    console.warn(`[WS] Connection closed. Reconnecting in ${delay}ms (attempt ${reconnectAttempt})...`);
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      getSocket();
    }, delay);
  };

  return socket;
}

/** Send a message and return a promise that resolves/rejects when server responds. */
export function sendMessage<TPayload = unknown, TResponse = unknown>(
  type: string,
  payload?: TPayload,
): Promise<{ id: string; type: string; payload: TResponse }> {
  const id = crypto.randomUUID();
  const raw = JSON.stringify({ id, type, payload });

  return new Promise((resolve, reject) => {
    pendingRequests.set(id, { resolve: resolve as any, reject });

    const ws = getSocket();
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(raw);
    } else {
      // Queue message until connection opens
      messageQueue.push(raw);
    }
  });
}

export function onConnected(fn: () => void) {
  if (connected) {
    fn();
  } else {
    openListeners.push(fn);
    getSocket(); // Ensure connection attempt
  }
}

export function isConnected() {
  return connected;
}
