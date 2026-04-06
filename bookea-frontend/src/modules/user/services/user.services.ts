import type {
  User,
  UpdateProfilePayload,
  ChangePasswordPayload,
  AvatarUploadResponse,
} from "../types";

// Utilisation du chemin relatif pour passer par le proxy Vite
const BASE_URL = "/api/user";

// Auth basée sur la session (Cookie Spring Security)
// L'option credentials: "include" est CRUCIALE pour envoyer/recevoir les cookies
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
    if (!res.ok) throw new Error("Impossible de récupérer le profil");
    return res.json();
  },

  // POST /api/user/register (Inscription)
  async register(payload: any): Promise<any> {
    const res = await fetch(`${BASE_URL}/register`, {
      ...defaultOptions,
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // On récupère l'erreur du backend (ex: message de validation)
      const err = await res.json();
      throw err;
    }
    return res.json();
  },

  // PUT /api/user/profile (Mise à jour infos)
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

  // POST /api/user/avatar (Multipart/form-data)
  async uploadAvatar(file: File): Promise<AvatarUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${BASE_URL}/avatar`, {
      method: "POST",
      credentials: "include",
      // On ne met PAS de Content-Type ici, le navigateur le fera avec le boundary
      body: formData,
    });
    if (!res.ok) throw new Error("Échec de l'upload de l'avatar");
    return res.json();
  },
};
