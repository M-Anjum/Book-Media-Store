import { useState } from "react";
import type { ChangePasswordPayload } from "../types";
 
interface Props {
  onSubmit: (payload: ChangePasswordPayload) => Promise<void>;
  isLoading?: boolean;
}
 
const emptyForm: ChangePasswordPayload = {
  currentPassword: "",
  password: "",
  confirmPassword: "",
};
 
export default function ChangePasswordForm({ onSubmit, isLoading = false }: Props) {
  const [form, setForm] = useState<ChangePasswordPayload>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "", global: "" }));
    setSuccess(false);
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
 
    // Client-side match check before hitting the backend
    if (form.password !== form.confirmPassword) {
      setErrors({ global: "Passwords do not match." });
      return;
    }
 
    try {
      await onSubmit(form);
      setSuccess(true);
      setForm(emptyForm);
    } catch (err: unknown) {
      if (err && typeof err === "object") {
        setErrors(err as Record<string, string>);
      } else {
        setErrors({ global: "Something went wrong. Please try again." });
      }
    }
  };
 
  return (
    <form onSubmit={handleSubmit} noValidate>
      <h6 className="fw-semibold mb-3">Change Password</h6>
 
      {success && (
        <div className="alert alert-success py-2">Password updated successfully!</div>
      )}
      {errors.global && (
        <div className="alert alert-danger py-2">{errors.global}</div>
      )}
 
      <div className="mb-3">
        <label className="form-label">Current password</label>
        <input
          name="currentPassword"
          type="password"
          className={`form-control ${errors.currentPassword ? "is-invalid" : ""}`}
          value={form.currentPassword}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />
        {errors.currentPassword && (
          <div className="invalid-feedback">{errors.currentPassword}</div>
        )}
      </div>
 
      <div className="mb-3">
        <label className="form-label">New password</label>
        <input
          name="password"
          type="password"
          className={`form-control ${errors.password ? "is-invalid" : ""}`}
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />
        {errors.password && (
          <div className="invalid-feedback">{errors.password}</div>
        )}
        <div className="form-text">
          Min. 8 characters · uppercase · lowercase · digit · special character
        </div>
      </div>
 
      <div className="mb-4">
        <label className="form-label">Confirm new password</label>
        <input
          name="confirmPassword"
          type="password"
          className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
          value={form.confirmPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />
        {errors.confirmPassword && (
          <div className="invalid-feedback">{errors.confirmPassword}</div>
        )}
      </div>
 
      <button type="submit" className="btn btn-primary btn-sm" disabled={isLoading}>
        {isLoading ? "Updating…" : "Update Password"}
      </button>
    </form>
  );
}