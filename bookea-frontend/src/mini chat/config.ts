/**
 * Base HTTP : en dev, chaîne vide → URLs relatives `/api/...` (proxy Vite → 8080).
 * En prod ou si VITE_API_BASE_URL est défini : URL absolue.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "" : "http://localhost:8080");

/**
 * Origine pour SockJS/STOMP (hors proxy par défaut).
 * Le handshake WebSocket va directement sur Spring Boot.
 */
export const WS_BACKEND_ORIGIN =
  import.meta.env.VITE_WS_ORIGIN ?? "http://localhost:8080";

/** Clé localStorage pour le JWT */
export const AUTH_TOKEN_KEY = "bookea_auth_token";
