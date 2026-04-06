import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../auth/services";
import type { RegisterPayload } from "../../auth/types";

interface RegisterForm {
  firstName: string;
  lastName: string;
  birthDate: string;
  address: string;
  postalCode: string;
  city: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  avatar: File | null;
}

const INITIAL: RegisterForm = {
  firstName: "", lastName: "", birthDate: "",
  address: "", postalCode: "", city: "",
  username: "", email: "", phone: "",
  password: "", confirmPassword: "", avatar: null,
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/gif", "image/jpeg"].includes(file.type)) {
      setErrors((p) => ({ ...p, avatar: "Seuls .gif et .jpeg sont acceptés" }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((p) => ({ ...p, avatar: "Taille maximale : 2 Mo" }));
      return;
    }
    setForm((p) => ({ ...p, avatar: file }));
    setAvatarPreview(URL.createObjectURL(file));
    setErrors((p) => ({ ...p, avatar: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Obligatoire";
    if (!form.lastName.trim()) e.lastName = "Obligatoire";
    if (!form.birthDate) e.birthDate = "Obligatoire";
    if (!form.address.trim()) e.address = "Obligatoire";
    if (!form.postalCode.trim()) e.postalCode = "Obligatoire";
    if (!form.username.trim()) e.username = "Obligatoire";
    if (!form.email.trim()) e.email = "Obligatoire";
    if (!form.password) e.password = "Obligatoire";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Les mots de passe ne correspondent pas";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const payload: RegisterPayload = {
        firstName: form.firstName,
        lastName: form.lastName,
        birthDate: form.birthDate,
        address: form.address,
        postalCode: form.postalCode,
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirmPassword: form.confirmPassword,
      };
      await authService.register(payload);
      if (form.avatar) {
        await authService.loginAndUploadAvatar(form.email, form.password, form.avatar);
      }
      navigate("/login", { state: { registered: true } });
    } catch (err: unknown) {
      if (err && typeof err === "object") {
        setErrors(err as Record<string, string>);
      } else {
        setErrors({ global: "Une erreur est survenue." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ background: "#F5F5F0", minHeight: "100vh", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 660, margin: "0 auto" }}>

        {/* Logo */}
        <div style={{ fontSize: 22, fontWeight: 600, color: "#E8520A", marginBottom: 4 }}>Bookea</div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: "2rem" }}>Librairie en ligne</div>
        <p style={{ fontSize: 11, color: "#aaa", marginBottom: "1.25rem" }}>
          Les champs marqués <span style={{ color: "#E8520A" }}>*</span> sont obligatoires.
        </p>

        {errors.global && (
          <div style={{ background: "#FCEBEB", color: "#A32D2D", padding: "10px 14px", borderRadius: 8, marginBottom: "1rem", fontSize: 13 }}>
            {errors.global}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* ── 1. Identité ─────────────────────────── */}
          <Card number={1} title="Identité">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Prénom" required error={errors.firstName}>
                <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="ex. Marie" style={input(!!errors.firstName)} />
              </Field>
              <Field label="Nom" required error={errors.lastName}>
                <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="ex. Dupont" style={input(!!errors.lastName)} />
              </Field>
            </div>
            <Field label="Date de naissance" required error={errors.birthDate}>
              <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} style={input(!!errors.birthDate)} />
            </Field>
          </Card>

          {/* ── 2. Adresse ──────────────────────────── */}
          <Card number={2} title="Adresse postale">
            <Field label="Adresse" required error={errors.address}>
              <input name="address" value={form.address} onChange={handleChange} placeholder="ex. 12 rue de la Paix" style={input(!!errors.address)} />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Code postal" required error={errors.postalCode}>
                <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="ex. 75001" style={input(!!errors.postalCode)} />
              </Field>
              <Field label="Ville">
                <input name="city" value={form.city} onChange={handleChange} placeholder="ex. Paris" style={input(false)} />
              </Field>
            </div>
          </Card>

          {/* ── 3. Compte ───────────────────────────── */}
          <Card number={3} title="Compte">
            <Field label="Pseudo / login" required error={errors.username} hint="Visible par les autres membres">
              <input name="username" value={form.username} onChange={handleChange} placeholder="ex. marie_dupont" style={input(!!errors.username)} />
            </Field>
            <Field label="Adresse email" required error={errors.email}>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="ex. marie@exemple.com" style={input(!!errors.email)} />
            </Field>
            <Field label="Téléphone">
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="ex. +32 470 00 00 00" style={input(false)} />
            </Field>
          </Card>

          {/* ── 4. Mot de passe ─────────────────────── */}
          <Card number={4} title="Mot de passe">
            <Field label="Mot de passe" required error={errors.password}>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" style={input(!!errors.password)} />
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 5 }}>
                {["8 car. min.", "1 majuscule", "1 chiffre", "1 spécial"].map((t) => (
                  <span key={t} style={{ fontSize: 11, background: "#FDE8DF", color: "#C94409", padding: "2px 8px", borderRadius: 99 }}>{t}</span>
                ))}
              </div>
            </Field>
            <Field label="Confirmation" required error={errors.confirmPassword}>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" style={input(!!errors.confirmPassword)} />
            </Field>
          </Card>

          {/* ── 5. Avatar ───────────────────────────── */}
          <Card number={5} title="Photo de profil" optional>
            <label htmlFor="avatar-input" style={{ cursor: "pointer", display: "block" }}>
              <div style={{ border: "2px dashed #ddd", borderRadius: 10, padding: "1.25rem", textAlign: "center", background: "#fafafa", transition: "border-color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#E8520A")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#ddd")}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="preview" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", margin: "0 auto 10px", display: "block" }} />
                ) : (
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#FDE8DF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#E8520A"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                  </div>
                )}
                <div style={{ fontSize: 13, color: "#555" }}>{avatarPreview ? "Changer la photo" : "Glisser ou cliquer pour télécharger"}</div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 3 }}>Formats acceptés : .gif, .jpeg — max 2 Mo</div>
              </div>
            </label>
            <input id="avatar-input" type="file" accept=".gif,.jpg,.jpeg" onChange={handleAvatar} style={{ display: "none" }} />
            {errors.avatar && <div style={{ fontSize: 12, color: "#A32D2D", marginTop: 4 }}>{errors.avatar}</div>}
          </Card>

          <button type="submit" disabled={isLoading} style={{
            width: "100%", height: 44, background: isLoading ? "#ccc" : "#E8520A",
            color: "#fff", border: "none", borderRadius: 8, fontSize: 15,
            fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer", marginTop: "0.5rem"
          }}>
            {isLoading ? "Création en cours…" : "Créer mon compte"}
          </button>

          <p style={{ textAlign: "center", fontSize: 13, color: "#888", marginTop: "1rem" }}>
            Déjà inscrit ?{" "}
            <Link to="/login" style={{ color: "#E8520A", fontWeight: 500, textDecoration: "none" }}>Se connecter</Link>
          </p>

        </form>
      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const input = (hasError: boolean): React.CSSProperties => ({
  width: "100%", height: 38, padding: "0 12px",
  border: `1px solid ${hasError ? "#E24B4A" : "#ddd"}`,
  borderRadius: 8, fontSize: 14, color: "#222",
  background: "#fff", outline: "none",
});

function Card({ number, title, optional, children }: {
  number: number; title: string; optional?: boolean; children: React.ReactNode;
}) {
  const isOptional = optional;
  return (
    <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: "1.5rem", marginBottom: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem", paddingBottom: ".75rem", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: isOptional ? "#ddd" : "#E8520A", color: isOptional ? "#888" : "#fff", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {number}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: isOptional ? "#aaa" : "#222", textTransform: "uppercase", letterSpacing: ".06em" }}>{title}</div>
        {optional && <span style={{ fontSize: 11, color: "#bbb", marginLeft: 4 }}>(optionnel)</span>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, error, hint, children }: {
  label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: "#555" }}>
        {label} {required && <span style={{ color: "#E8520A" }}>*</span>}
      </label>
      {children}
      {hint && !error && <div style={{ fontSize: 11, color: "#aaa" }}>{hint}</div>}
      {error && <div style={{ fontSize: 12, color: "#A32D2D" }}>{error}</div>}
    </div>
  );
}