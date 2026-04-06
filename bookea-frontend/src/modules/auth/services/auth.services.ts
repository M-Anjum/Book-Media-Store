import type { LoginPayload } from "../types";
import { RegisterPayload } from "../types/auth.types";

export const authService = {
  async login(payload: LoginPayload): Promise<void> {
    const formData = new URLSearchParams();
    formData.append("username", payload.username);
    formData.append("password", payload.password);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    if (!res.ok) throw new Error("Identifiants incorrects");
  },

  async register(payload: RegisterPayload): Promise<void> {
  const res = await fetch("/api/user/register", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw err;
  }
},

async loginAndUploadAvatar(email: string, password: string, file: File): Promise<void> {
  await this.login({ username: email, password });
  const formData = new FormData();
  formData.append("file", file);
  await fetch("/api/user/avatar", {
    method: "POST",
    credentials: "include",
    body: formData,
  });
},
  async logout(): Promise<void> {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  },
};

