import type { User } from "../types";
 
interface Props {
  user: User;
  onEditClick: () => void;
}
 
export default function ProfileCard({ user, onEditClick }: Props) {
  return (
    <div className="card p-4 shadow-sm">
      <div className="d-flex align-items-center gap-3 mb-3">
        {user.avatarUrl ? (
          <img
            src={`http://localhost:8080${user.avatarUrl}`}
            alt="Avatar"
            className="rounded-circle"
            style={{ width: 72, height: 72, objectFit: "cover" }}
          />
        ) : (
          <div
            className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold fs-4"
            style={{ width: 72, height: 72, flexShrink: 0 }}
          >
            {user.firstName.charAt(0)}
            {user.lastName.charAt(0)}
          </div>
        )}
 
        <div>
          <h5 className="mb-0 fw-semibold">
            {user.firstName} {user.lastName}
          </h5>
          <small className="text-muted">{user.email}</small>
          {user.phone && <div className="text-muted small">{user.phone}</div>}
          <span className="badge bg-primary mt-1">{user.role}</span>
        </div>
      </div>
 
      <p className="text-muted small mb-3">
        Member since {new Date(user.createdAt).toLocaleDateString("en-GB")}
      </p>
 
      <button className="btn btn-outline-primary btn-sm" onClick={onEditClick}>
        Edit Profile
      </button>
    </div>
  );
}