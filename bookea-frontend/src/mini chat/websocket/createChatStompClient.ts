import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { WS_BACKEND_ORIGIN } from "../config";

/**
 * Client STOMP + SockJS aligné sur le backend (/ws, broker /topic, prefix /app).
 * Abonne-toi et publie depuis un hook (ex. après onConnect).
 */
export function createChatStompClient(token: string | null): Client {
  const wsUrl = `${WS_BACKEND_ORIGIN.replace(/\/$/, "")}/ws`;

  return new Client({
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    webSocketFactory: () => new SockJS(wsUrl) as unknown as WebSocket,
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
