import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { WS_BACKEND_ORIGIN } from "../config";

/** SockJS attend une URL HTTP(S), pas ws:// — ex. http://localhost:8080/ws */
export const DEFAULT_SOCKJS_URL = `${WS_BACKEND_ORIGIN.replace(/\/$/, "")}/ws`;

/**
 * Client STOMP + SockJS aligné sur le backend (/ws, broker /topic, prefix /app).
 * Abonne-toi et publie depuis un hook (ex. après onConnect).
 */
export function createChatStompClient(
  token: string | null,
  sockJsHttpUrl: string = DEFAULT_SOCKJS_URL,
): Client {
  const wsUrl = sockJsHttpUrl;

  return new Client({
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    webSocketFactory: () => new SockJS(wsUrl) as unknown as WebSocket,
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
