export interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  birthDate: string;
  address: string;
  postalCode: string;
  phone?: string;
  avatarUrl?: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface AdminUpdateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  postalCode: string;
  role: string;
}

export const adminUserService = {
  async getAll(): Promise<AdminUser[]> {
    const res = await fetch("/api/admin/users", { credentials: "include" });
    if (!res.ok) throw new Error("Accès refusé");
    return res.json();
  },

  async update(id: number, payload: AdminUpdateUserPayload): Promise<AdminUser> {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Erreur mise à jour");
    return res.json();
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Erreur suppression");
  },
};