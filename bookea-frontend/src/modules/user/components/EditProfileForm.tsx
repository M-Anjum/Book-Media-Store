import { useState, useEffect } from "react";
import type { User, UpdateProfilePayload } from "../types";

interface Props {
  user: User;
  onSubmit: (payload: UpdateProfilePayload) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EditProfileForm({ user, onSubmit, onCancel, isLoading = false }: Props) {
  const [form, setForm] = useState<UpdateProfilePayload>({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone ?? "",
    address: user.address ?? "",
    postalCode: user.postalCode ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone ?? "",
      address: user.address ?? "",
      postalCode: user.postalCode ?? "",
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      await onSubmit(form);
    } catch (err: unknown) {
      if (err && typeof err === "object") {
        setErrors(err as Record<string, string>);
      }
    }
  };

  return (
    <div style={{ background: "#F5F5F0", padding: "1.5rem", borderRadius: 12 }}>
      <h6 style={{ fontWeight: 600, marginBottom: "1.25rem", fontSize: 15 }}>
        Modifier mon profil
      </h6>

      <form onSubmit={handleSubmit} noValidate>

        {/* Identité */}
        <Section title="Identité">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Prénom" required error={errors.firstName}>
              <input name="firstName" value={form.firstName} onChange={handleChange} style={inputStyle(!!errors.firstName)} />
            </Field>
            <Field label="Nom" required error={errors.lastName}>
              <input name="lastName" value={form.lastName} onChange={handleChange} style={inputStyle(!!errors.lastName)} />
            </Field>
          </div>

          {/* Username — lecture seule */}
          <Field label="Pseudo" hint="Non modifiable">
            <input value={user.username} disabled style={{ ...inputStyle(false), opacity: 0.5, cursor: "not-allowed" }} />
          </Field>

          {/* Date de naissance — lecture seule */}
          <Field label="Date de naissance" hint="Non modifiable">
            <input type="date" value={user.birthDate ?? ""} disabled style={{ ...inputStyle(false), opacity: 0.5, cursor: "not-allowed" }} />
          </Field>
        </Section>

        {/* Adresse */}
        <Section title="Adresse postale">
          <Field label="Adresse" required error={errors.address}>
            <input name="address" value={form.address} onChange={handleChange} placeholder="ex. 12 rue de la Paix" style={inputStyle(!!errors.address)} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Code postal" required error={errors.postalCode}>
              <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="ex. 75001" style={inputStyle(!!errors.postalCode)} />
            </Field>
          </div>
        </Section>

        {/* Contact */}
        <Section title="Contact">
          <Field label="Email" required error={errors.email}>
            <input type="email" name="email" value={form.email} onChange={handleChange} style={inputStyle(!!errors.email)} />
          </Field>
          <Field label="Téléphone">
            <input type="tel" name="phone" value={form.phone ?? ""} onChange={handleChange} placeholder="ex. +32 470 00 00 00" style={inputStyle(false)} />
          </Field>
        </Section>

        {errors.global && (
          <div style={{ fontSize: 13, color: "#A32D2D", marginBottom: 12 }}>{errors.global}</div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: "1rem" }}>
          <button type="submit" disabled={isLoading} style={{
            padding: "8px 20px", background: isLoading ? "#ccc" : "#E8520A",
            color: "#fff", border: "none", borderRadius: 8,
            fontSize: 14, fontWeight: 500, cursor: isLoading ? "not-allowed" : "pointer"
          }}>
            {isLoading ? "Sauvegarde…" : "Sauvegarder"}
          </button>
          <button type="button" onClick={onCancel} disabled={isLoading} style={{
            padding: "8px 20px", background: "none",
            border: "1px solid #ddd", borderRadius: 8,
            fontSize: 14, cursor: "pointer", color: "#555"
          }}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: "1.25rem", marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "1rem", paddingBottom: 8, borderBottom: "1px solid #f0f0f0" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, error, hint, children }: {
  label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: "#555" }}>
        {label} {required && <span style={{ color: "#E8520A" }}>*</span>}
      </label>
      {children}
      {hint && !error && <div style={{ fontSize: 11, color: "#aaa" }}>{hint}</div>}
      {error && <div style={{ fontSize: 12, color: "#A32D2D" }}>{error}</div>}
    </div>
  );
}

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: "100%", height: 38, padding: "0 12px",
  border: `1px solid ${hasError ? "#E24B4A" : "#ddd"}`,
  borderRadius: 8, fontSize: 14, color: "#222",
  background: "#fff", outline: "none",
  boxSizing: "border-box",
});