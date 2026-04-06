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
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
 
  useEffect(() => {
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone ?? "",
    });
  }, [user]);
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
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
    <form onSubmit={handleSubmit} noValidate>
      <h6 className="fw-semibold mb-3">Edit Profile</h6>
 
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">First name</label>
          <input
            name="firstName"
            className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
            value={form.firstName}
            onChange={handleChange}
            required
          />
          {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
        </div>
 
        <div className="col-md-6">
          <label className="form-label">Last name</label>
          <input
            name="lastName"
            className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
            value={form.lastName}
            onChange={handleChange}
            required
          />
          {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
        </div>
 
        <div className="col-md-8">
          <label className="form-label">Email</label>
          <input
            name="email"
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            value={form.email}
            onChange={handleChange}
            required
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          {errors.global && <div className="invalid-feedback d-block">{errors.global}</div>}
        </div>
 
        <div className="col-md-4">
          <label className="form-label">Phone (optional)</label>
          <input
            name="phone"
            type="tel"
            className="form-control"
            value={form.phone}
            onChange={handleChange}
          />
        </div>
      </div>
 
      <div className="d-flex gap-2 mt-4">
        <button type="submit" className="btn btn-primary btn-sm" disabled={isLoading}>
          {isLoading ? "Saving…" : "Save Changes"}
        </button>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onCancel} disabled={isLoading}>
          Cancel
        </button>
      </div>
    </form>
  );
}