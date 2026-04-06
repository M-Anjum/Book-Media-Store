import type {
  User,
  UpdateProfilePayload,
  ChangePasswordPayload,
  AvatarUploadResponse,
} from "../types";
 
const BASE_URL = "http://localhost:7777/api/user";
 
// Session-based auth (Spring Security cookie) — no Authorization header needed
const defaultOptions: RequestInit = {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
};
 
export const userService = {
  // GET /api/user/profile
  async getProfile(): Promise<User> {
    const res = await fetch(`${BASE_URL}/profile`, {
      ...defaultOptions,
      method: "GET",
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
  },
 
  // PUT /api/user/profile
  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const res = await fetch(`${BASE_URL}/profile`, {
      ...defaultOptions,
      method: "PUT",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw err;
    }
    return res.json();
  },
 
  // PUT /api/user/change-password
  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    const res = await fetch(`${BASE_URL}/change-password`, {
      ...defaultOptions,
      method: "PUT",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw err;
    }
  },
 
  // POST /api/user/avatar  (multipart/form-data — no Content-Type header)
  async uploadAvatar(file: File): Promise<AvatarUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
 
    const res = await fetch(`${BASE_URL}/avatar`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload avatar");
    return res.json();
  },
};