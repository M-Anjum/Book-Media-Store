import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../auth/services";

interface RegisterForm {
  firstName: string;
  lastName: string;
  birthDate: string;
  address: string;
  postalCode: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  avatar: File | null;
}

const INITIAL_FORM: RegisterForm = {
  firstName: "",
  lastName: "",
  birthDate: "",
  address: "",
  postalCode: "",
  username: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  avatar: null,
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/gif", "image/jpeg"];
    if (!allowed.includes(file.type)) {
      setErrors((prev) => ({ ...prev, avatar: "Seuls les formats .gif et .jpeg sont acceptés" }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, avatar: "La taille maximale est 2 Mo" }));
      return;
    }

    setForm((prev) => ({ ...prev, avatar: file }));
    setAvatarPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, avatar: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName.trim()) newErrors.firstName = "Le prénom est obligatoire";
    if (!form.lastName.trim()) newErrors.lastName = "Le nom est obligatoire";
    if (!form.birthDate) newErrors.birthDate = "La date de naissance est obligatoire";
    if (!form.address.trim()) newErrors.address = "L'adresse est obligatoire";
    if (!form.postalCode.trim()) newErrors.postalCode = "Le code postal est obligatoire";
    if (!form.username.trim()) newErrors.username = "Le pseudo est obligatoire";
    if (!form.email.trim()) newErrors.email = "L'email est obligatoire";
    if (!form.password) newErrors.password = "Le mot de passe est obligatoire";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await authService.register({
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
      });

      // Upload avatar if provided
      if (form.avatar) {
        await authService.loginAndUploadAvatar(form.email, form.password, form.avatar);
      }

      navigate("/login", { state: { registered: true } });
    } catch (err: unknown) {
      if (err && typeof err === "object") {
        setErrors(err as Record<string, string>);
      } else {
        setErrors({ global: "Une erreur est survenue. Veuillez réessayer." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 1rem" }}>

      {/* Logo */}
      <div style={{ fontSize: 22, fontWeight: 500, color: "#E8520A", marginBottom: "2rem" }}>
        Bookea
      </div>

      <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: "1rem" }}>
        Les champs marqués d'un <span style={{ color: "#E8520A" }}>*</span> sont obligatoires.
      </p>

      {errors.global && (
        <div style={{ background: "var(--color-background-danger)", color: "var(--color-text-danger)", padding: "10px 14px", borderRadius: 8, marginBottom: "1rem", fontSize: 14 }}>
          {errors.global}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>

        {/* ── Identité ─────────────────────────────────────── */}
        <Section title="Identité">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Prénom" required error={errors.firstName}>
              <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="ex. Marie" className={errors.firstName ? "is-invalid" : ""} />
            </Field>
            <Field label="Nom" required error={errors.lastName}>
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="ex. Dupont" />
            </Field>
          </div>
          <Field label="Date de naissance" required error={errors.birthDate}>
            <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} />
          </Field>
        </Section>

        {/* ── Adresse postale ───────────────────────────────── */}
        <Section title="Adresse postale">
          <Field label="Adresse" required error={errors.address}>
            <input name="address" value={form.address} onChange={handleChange} placeholder="ex. 12 rue de la Paix" />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Code postal" required error={errors.postalCode}>
              <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="ex. 75001" />
            </Field>
            <Field label="Ville">
              <input name="city" placeholder="ex. Paris" disabled style={{ opacity: 0.5 }} />
            </Field>
          </div>
        </Section>

        {/* ── Compte ───────────────────────────────────────── */}
        <Section title="Compte">
          <Field label="Pseudo / login" required error={errors.username} hint="Visible par les autres membres">
            <input name="username" value={form.username} onChange={handleChange} placeholder="ex. marie_dupont" />
          </Field>
          <Field label="Adresse email" required error={errors.email}>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="ex. marie@exemple.com" />
          </Field>
          <Field label="Téléphone">
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="ex. +32 470 00 00 00" />
          </Field>
        </Section>

        {/* ── Mot de passe ─────────────────────────────────── */}
        <Section title="Mot de passe">
          <Field label="Mot de passe" required error={errors.password}>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
              {["8 caractères min.", "1 majuscule", "1 chiffre", "1 caractère spécial"].map((r) => (
                <span key={r} style={{ fontSize: 11, background: "var(--color-background-secondary)", padding: "2px 8px", borderRadius: 99, color: "var(--color-text-tertiary)" }}>{r}</span>
              ))}
            </div>
          </Field>
          <Field label="Confirmation" required error={errors.confirmPassword}>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" />
          </Field>
        </Section>

        {/* ── Avatar ───────────────────────────────────────── */}
        <Section title="Photo de profil" optional>
          <label htmlFor="avatar-input" style={{ display: "block", cursor: "pointer" }}>
            <div style={{ border: "1.5px dashed var(--color-border-secondary)", borderRadius: 12, padding: "1.5rem", textAlign: "center", transition: "border-color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#E8520A")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--color-border-secondary)")}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Aperçu" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", margin: "0 auto 10px" }} />
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#FDE8DF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#E8520A"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                </div>
              )}
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                {avatarPreview ? "Changer la photo" : "Glisser ou cliquer pour télécharger"}
              </div>
              <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>
                Formats acceptés : .gif, .jpeg — max 2 Mo
              </div>
            </div>
          </label>
          <input id="avatar-input" type="file" accept=".gif,.jpg,.jpeg" onChange={handleAvatarChange} style={{ display: "none" }} />
          {errors.avatar && <div style={{ fontSize: 12, color: "var(--color-text-danger)", marginTop: 4 }}>{errors.avatar}</div>}
        </Section>

        {/* ── Submit ───────────────────────────────────────── */}
        <button type="submit" disabled={isLoading}
          style={{ width: "100%", height: 40, background: isLoading ? "#ccc" : "#E8520A", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: isLoading ? "not-allowed" : "pointer", marginTop: "0.5rem" }}>
          {isLoading ? "Création en cours…" : "Créer mon compte"}
        </button>

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--color-text-secondary)", marginTop: "1rem" }}>
          Déjà inscrit ?{" "}
          <Link to="/login" style={{ color: "#E8520A", textDecoration: "none", fontWeight: 500 }}>
            Se connecter
          </Link>
        </p>

      </form>
    </div>
  );
}

// ── Composants utilitaires ─────────────────────────────────────────────────────

function Section({ title, children, optional }: { title: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "1.5rem 2rem", marginBottom: "1.5rem" }}>
      <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: "1.25rem", paddingBottom: ".75rem", borderBottom: "0.5px solid var(--color-border-tertiary)", display: "flex", gap: 8, alignItems: "center" }}>
        {title}
        {optional && <span style={{ fontSize: 11, fontWeight: 400, color: "var(--color-text-tertiary)", textTransform: "none", letterSpacing: 0 }}>(optionnel)</span>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, error, hint, children }: { label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
      <label style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500 }}>
        {label} {required && <span style={{ color: "#E8520A" }}>*</span>}
      </label>
      {children}
      {hint && !error && <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{hint}</div>}
      {error && <div style={{ fontSize: 12, color: "var(--color-text-danger)" }}>{error}</div>}
    </div>
  );
}