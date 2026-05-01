// ============================================================
// WebSocket message types shared between server and client
// ============================================================

export type WsMessageType =
  | 'LOAD_GAME'
  | 'GAME_LOADED'
  | 'SAVE_GAME'
  | 'GAME_SAVED'
  | 'PING'
  | 'PONG'
  | 'ERROR';

export interface WsMessage<T = unknown> {
  /** Correlation id – the server echoes back the same id when responding */
  id: string;
  type: WsMessageType;
  payload?: T;
}

export interface WsErrorMessage {
  id: string;
  type: 'ERROR';
  message: string;
}
