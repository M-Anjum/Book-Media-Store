/**
 * Base HTTP : Spring Boot sur http://localhost:8080.
 * Surcharge possible avec VITE_API_BASE_URL.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

/**
 * Origine pour SockJS/STOMP (hors proxy par défaut).
 * Le handshake WebSocket va directement sur Spring Boot.
 */
export const WS_BACKEND_ORIGIN =
  import.meta.env.VITE_WS_ORIGIN ?? "http://localhost:8080";

/** Clé localStorage pour le JWT */
export const AUTH_TOKEN_KEY = "bookea_auth_token";
