import type { User } from "../types";

interface Props {
  user: User;
  onEditClick: () => void;
}

export default function ProfileCard({ user, onEditClick }: Props) {
  return (
    <div style={{ background: "#F5F5F0", padding: "1.5rem", borderRadius: 12 }}>

      {/* Avatar + nom + badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "1.5rem" }}>
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="Avatar"
            style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "2px solid #E8520A" }}
          />
        ) : (
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "#FDE8DF", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 24, fontWeight: 700,
            color: "#E8520A", flexShrink: 0
          }}>
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
        )}
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#111" }}>
            {user.firstName} {user.lastName}
          </div>
          <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>@{user.username}</div>
          <span style={{
            display: "inline-block", marginTop: 6, fontSize: 11, fontWeight: 600,
            padding: "2px 10px", borderRadius: 99,
            background: user.role === "ADMIN" ? "#FDE8DF" : "#EAF3DE",
            color: user.role === "ADMIN" ? "#C94409" : "#3B6D11"
          }}>
            {user.role}
          </span>
        </div>
      </div>

      {/* Informations personnelles */}
      <Section title="Informations personnelles">
        <Row label="Prénom" value={user.firstName} />
        <Row label="Nom" value={user.lastName} />
        <Row label="Pseudo" value={`@${user.username}`} />
        <Row
          label="Date de naissance"
          value={user.birthDate
            ? new Date(user.birthDate).toLocaleDateString("fr-BE")
            : null}
        />
      </Section>

      {/* Coordonnées */}
      <Section title="Coordonnées">
        <Row label="Email" value={user.email} />
        <Row label="Téléphone" value={user.phone ?? null} optional />
      </Section>

      {/* Adresse */}
      <Section title="Adresse postale">
        <Row label="Adresse" value={user.address ?? null} />
        <Row label="Code postal" value={user.postalCode ?? null} />
      </Section>

      {/* Compte */}
      <Section title="Compte">
        <Row
          label="Membre depuis"
          value={new Date(user.createdAt).toLocaleDateString("fr-BE")}
        />
        <Row
          label="Dernière mise à jour"
          value={new Date(user.updatedAt).toLocaleDateString("fr-BE")}
        />
      </Section>

      <button
        onClick={onEditClick}
        style={{
          marginTop: "0.5rem", padding: "8px 20px",
          background: "#E8520A", color: "#fff",
          border: "none", borderRadius: 8,
          fontSize: 14, fontWeight: 500, cursor: "pointer"
        }}
      >
        Modifier mon profil
      </button>
    </div>
  );
}

// ── Composants utilitaires ─────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #eee",
      borderRadius: 10, padding: "1rem 1.25rem", marginBottom: 12
    }}>
      <div style={{
        fontSize: 11, fontWeight: 600, color: "#aaa",
        textTransform: "uppercase", letterSpacing: ".06em",
        marginBottom: "0.75rem", paddingBottom: 8,
        borderBottom: "1px solid #f0f0f0"
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, optional }: {
  label: string;
  value: string | null | undefined;
  optional?: boolean;
}) {
  if (optional && !value) return null;

  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      alignItems: "center", padding: "6px 0",
      borderBottom: "1px solid #f5f5f5", fontSize: 14
    }}>
      <span style={{ color: "#888", fontSize: 13 }}>{label}</span>
      <span style={{ fontWeight: 500, color: value ? "#222" : "#ccc" }}>
        {value ?? "—"}
      </span>
    </div>
  );
}