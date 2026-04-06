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
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const adminUserService = {
  async getAll(): Promise<AdminUser[]> {
    const res = await fetch("/api/admin/users", { credentials: "include" });
    if (!res.ok) throw new Error("Accès refusé");
    return res.json();
  },

  async toggleActive(id: number): Promise<AdminUser> {
    const res = await fetch(`/api/admin/users/${id}/toggle-active`, {
      method: "PATCH",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Erreur");
    return res.json();
  },

  exportCsv(users: AdminUser[]): void {
    const headers = ["ID", "Prénom", "Nom", "Pseudo", "Email", "Rôle", "Actif", "Créé le"];
    const rows = users.map(u => [
      u.id,
      u.firstName,
      u.lastName,
      u.username,
      u.email,
      u.role,
      u.active ? "Oui" : "Non",
      new Date(u.createdAt).toLocaleDateString("fr-BE"),
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(v => `"${v}"`).join(";"))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },
};