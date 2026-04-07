import { useEffect, useState } from "react";
import { adminUserService, AdminUser } from "../services/adminUser.services";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminUserService.getAll()
      .then(setUsers)
      .catch(() => setError("Impossible de charger les utilisateurs."))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email} ${u.username}`
      .toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = async (id: number) => {
    try {
      const updated = await adminUserService.toggleActive(id);
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    } catch {
      alert("Erreur lors de la mise à jour.");
    }
  };

  return (
    <div style={{ padding: "2rem", background: "#F5F5F0", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "#111", marginBottom: 4 }}>
            Utilisateurs
          </h1>
          <p style={{ fontSize: 13, color: "#888" }}>{users.length} utilisateur(s) enregistré(s)</p>
        </div>
        <button
          onClick={() => adminUserService.exportCsv(filtered)}
          style={{ height: 38, padding: "0 18px", background: "#E8520A", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
          Exporter CSV
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Rechercher par nom, email ou pseudo..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", maxWidth: 400, height: 38, padding: "0 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, marginBottom: "1.5rem", outline: "none" }}
      />

      {error && (
        <div style={{ background: "#FCEBEB", color: "#A32D2D", padding: "10px 14px", borderRadius: 8, marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {isLoading && <div style={{ color: "#888" }}>Chargement...</div>}

      {/* Table */}
      {!isLoading && (
        <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#F5F5F0", borderBottom: "1px solid #eee" }}>
                {["Utilisateur", "Pseudo", "Email", "Rôle", "Statut", "Créé le", "Action"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#555", fontSize: 12, textTransform: "uppercase", letterSpacing: ".04em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr key={user.id} style={{ borderBottom: "1px solid #f5f5f5", background: i % 2 === 0 ? "#fff" : "#fafafa", opacity: user.active ? 1 : 0.55 }}>

                  {/* Utilisateur */}
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} alt="" />
                      ) : (
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FDE8DF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#E8520A", flexShrink: 0 }}>
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

                  {/* Rôle */}
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                      background: user.role === "ADMIN" ? "#FDE8DF" : "#EAF3DE",
                      color: user.role === "ADMIN" ? "#C94409" : "#3B6D11"
                    }}>
                      {user.role}
                    </span>
                  </td>

                  {/* Statut */}
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                      background: user.active ? "#EAF3DE" : "#F5F5F0",
                      color: user.active ? "#3B6D11" : "#888"
                    }}>
                      {user.active ? "Actif" : "Désactivé"}
                    </span>
                  </td>

                  <td style={{ padding: "12px 16px", color: "#aaa", fontSize: 12 }}>
                    {new Date(user.createdAt).toLocaleDateString("fr-BE")}
                  </td>

                  {/* Action */}
                  <td style={{ padding: "12px 16px" }}>
                    <button
                      onClick={() => handleToggle(user.id)}
                      style={{
                        fontSize: 12, padding: "5px 14px",
                        border: `1px solid ${user.active ? "#E24B4A" : "#3B6D11"}`,
                        color: user.active ? "#E24B4A" : "#3B6D11",
                        background: "none", borderRadius: 6, cursor: "pointer",
                        fontWeight: 500
                      }}>
                      {user.active ? "Désactiver" : "Réactiver"}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#aaa" }}>
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}