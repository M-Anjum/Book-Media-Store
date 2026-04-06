import type { AuthResponse, LoginRequest, RegisterRequest } from "../types/chat.types";
import { httpClient } from "./httpClient";

export async function register(req: RegisterRequest): Promise<AuthResponse> {
  const { data } = await httpClient.post<AuthResponse>("/api/auth/register", req);
  return data;
}

export async function login(req: LoginRequest): Promise<AuthResponse> {
  const { data } = await httpClient.post<AuthResponse>("/api/auth/login", req);
  return data;
}
