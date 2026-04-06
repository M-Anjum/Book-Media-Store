import { useEffect, useState } from "react";
import { adminUserService, AdminUser, AdminUpdateUserPayload } from "../services/adminUser.services";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<AdminUpdateUserPayload | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminUserService.getAll()
      .then(setUsers)
      .catch(() => setError("Impossible de charger les utilisateurs."))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email} ${u.username}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone ?? "",
      address: user.address,
      postalCode: user.postalCode,
      role: user.role,
    });
  };

  const handleSave = async () => {
    if (!editingUser || !form) return;
    setIsSaving(true);
    try {
      const updated = await adminUserService.update(editingUser.id, form);
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      setEditingUser(null);
    } catch {
      alert("Erreur lors de la mise à jour.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Supprimer ${name} ?`)) return;
    try {
      await adminUserService.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch {
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <div style={{ padding: "2rem", background: "#F5F5F0", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "#111", marginBottom: 4 }}>
          Gestion des utilisateurs
        </h1>
        <p style={{ fontSize: 13, color: "#888" }}>{users.length} utilisateur(s) enregistré(s)</p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Rechercher par nom, email ou pseudo..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", maxWidth: 400, height: 38, padding: "0 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, marginBottom: "1.5rem", outline: "none" }}
      />

      {error && <div style={{ background: "#FCEBEB", color: "#A32D2D", padding: "10px 14px", borderRadius: 8, marginBottom: "1rem" }}>{error}</div>}
      {isLoading && <div style={{ color: "#888" }}>Chargement...</div>}

      {/* Table */}
      {!isLoading && (
        <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#F5F5F0", borderBottom: "1px solid #eee" }}>
                {["ID", "Nom", "Pseudo", "Email", "Rôle", "Créé le", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#555", fontSize: 12, textTransform: "uppercase", letterSpacing: ".04em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr key={user.id} style={{ borderBottom: "1px solid #f5f5f5", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "12px 16px", color: "#aaa", fontSize: 12 }}>#{user.id}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FDE8DF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#E8520A" }}>
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 500 }}>{user.firstName} {user.lastName}</div>
                        <div style={{ fontSize: 12, color: "#aaa" }}>{user.phone ?? "—"}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#555" }}>@{user.username}</td>
                  <td style={{ padding: "12px 16px", color: "#555" }}>{user.email}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                      background: user.role === "ADMIN" ? "#FDE8DF" : "#EAF3DE",
                      color: user.role === "ADMIN" ? "#C94409" : "#3B6D11"
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#aaa", fontSize: 12 }}>
                    {new Date(user.createdAt).toLocaleDateString("fr-BE")}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => handleEdit(user)}
                        style={{ fontSize: 12, padding: "5px 12px", border: "1px solid #E8520A", color: "#E8520A", background: "none", borderRadius: 6, cursor: "pointer" }}>
                        Modifier
                      </button>
                      <button onClick={() => handleDelete(user.id, `${user.firstName} ${user.lastName}`)}
                        style={{ fontSize: 12, padding: "5px 12px", border: "1px solid #E24B4A", color: "#E24B4A", background: "none", borderRadius: 6, cursor: "pointer" }}>
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#aaa" }}>Aucun utilisateur trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Edit */}
      {editingUser && form && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "2rem", width: "100%", maxWidth: 520 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: "1.5rem" }}>
              Modifier — {editingUser.firstName} {editingUser.lastName}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "Prénom", key: "firstName" },
                { label: "Nom", key: "lastName" },
                { label: "Email", key: "email" },
                { label: "Téléphone", key: "phone" },
                { label: "Adresse", key: "address" },
                { label: "Code postal", key: "postalCode" },
              ].map(({ label, key }) => (
                <div key={key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#555" }}>{label}</label>
                  <input
                    value={(form as Record<string, string>)[key] ?? ""}
                    onChange={e => setForm(prev => prev ? { ...prev, [key]: e.target.value } : prev)}
                    style={{ height: 36, padding: "0 10px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none" }}
                  />
                </div>
              ))}
            </div>

            {/* Rôle */}
            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#555", display: "block", marginBottom: 4 }}>Rôle</label>
              <select value={form.role} onChange={e => setForm(prev => prev ? { ...prev, role: e.target.value } : prev)}
                style={{ height: 36, padding: "0 10px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, width: "100%", outline: "none" }}>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: "1.5rem", justifyContent: "flex-end" }}>
              <button onClick={() => setEditingUser(null)}
                style={{ padding: "8px 20px", border: "1px solid #ddd", borderRadius: 8, background: "none", cursor: "pointer", fontSize: 14 }}>
                Annuler
              </button>
              <button onClick={handleSave} disabled={isSaving}
                style={{ padding: "8px 20px", background: isSaving ? "#ccc" : "#E8520A", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
                {isSaving ? "Sauvegarde..." : "Sauvegarder"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}