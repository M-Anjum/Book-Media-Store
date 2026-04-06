import { useEffect, useState } from "react";
import { userService } from "../services";
import { AvatarUpload, ChangePasswordForm, EditProfileForm, ProfileCard } from "../components";
import type { ChangePasswordPayload, UpdateProfilePayload, User } from "../types";
 
type Tab = "profile" | "security";
 
export default function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
 
  // ─── Load profile on mount ────────────────────────────────────────────────
  useEffect(() => {
    userService
      .getProfile()
      .then(setUser)
      .catch(() => setPageError("Unable to load your profile."));
  }, []);
 
  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleUpdateProfile = async (payload: UpdateProfilePayload) => {
    setIsLoading(true);
    try {
      const updated = await userService.updateProfile(payload);
      setUser(updated);
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleChangePassword = async (payload: ChangePasswordPayload) => {
    setIsLoading(true);
    try {
      await userService.changePassword(payload);
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleAvatarUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const { avatarUrl } = await userService.uploadAvatar(file);
      setUser((prev) => (prev ? { ...prev, avatarUrl } : prev));
    } finally {
      setIsLoading(false);
    }
  };
 
  // ─── Render ───────────────────────────────────────────────────────────────
  if (pageError) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{pageError}</div>
      </div>
    );
  }
 
  if (!user) {
    return (
      <div className="container py-5 text-center text-muted">
        <div className="spinner-border spinner-border-sm me-2" />
        Loading profile…
      </div>
    );
  }
 
  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>
      <h1 className="h4 fw-bold mb-4">My Account</h1>
 
      {/* Avatar always visible at top */}
      <AvatarUpload
        currentAvatarUrl={user.avatarUrl}
        onUpload={handleAvatarUpload}
        isLoading={isLoading}
      />
 
      {/* Tab Navigation */}
      <ul className="nav nav-tabs mb-4">
        {(["profile", "security"] as Tab[]).map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab);
                setIsEditing(false);
              }}
            >
              {tab === "profile" ? "Profile" : "Security"}
            </button>
          </li>
        ))}
      </ul>
 
      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div>
          {isEditing ? (
            <EditProfileForm
              user={user}
              onSubmit={handleUpdateProfile}
              onCancel={() => setIsEditing(false)}
              isLoading={isLoading}
            />
          ) : (
            <ProfileCard user={user} onEditClick={() => setIsEditing(true)} />
          )}
        </div>
      )}
 
      {/* Security Tab */}
      {activeTab === "security" && (
        <ChangePasswordForm onSubmit={handleChangePassword} isLoading={isLoading} />
      )}
    </div>
  );
}