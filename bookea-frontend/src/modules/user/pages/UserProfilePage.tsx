import { useEffect, useState } from "react";
import { userService } from "../services/user.services";
import {
  ChangePasswordForm,
  EditProfileForm,
  ProfileCard,
} from "../components"; // On a retiré AvatarUpload des imports si plus utilisé
import type {
  ChangePasswordPayload,
  UpdateProfilePayload,
  User,
} from "../types";
import styles from "./UserProfilePage.module.css";

type Tab = "profile" | "security";

export default function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    userService
      .getProfile()
      .then(setUser)
      .catch((err) => {
        console.error("Erreur profil:", err);
        setPageError("Impossible de charger le profil.");
      });
  }, []);

  const handleUpdateProfile = async (payload: UpdateProfilePayload) => {
    setIsLoading(true);
    try {
      const updated = await userService.updateProfile(payload);
      setUser(updated);
      setIsEditing(false);
    } catch (error: any) {
      alert("Erreur 400 : Vérifiez l'adresse et le code postal.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (payload: ChangePasswordPayload) => {
    setIsLoading(true);
    try {
      await userService.changePassword(payload);
      alert("Mot de passe modifié !");
      setActiveTab("profile");
    } catch {
      alert("Erreur : Mot de passe actuel incorrect.");
    } finally {
      setIsLoading(false);
    }
  };

  if (pageError)
    return (
      <div className={styles.pageContainer}>
        <div className="alert alert-danger">{pageError}</div>
      </div>
    );

  if (!user)
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        Chargement...
      </div>
    );

  return (
    <div className={styles.pageContainer}>
      {/* --- La partie AvatarUpload a été supprimée ici --- */}

      <nav className={styles.tabsNav}>
        <ul className={styles.tabsList}>
          {(["profile", "security"] as Tab[]).map((tab) => (
            <li key={tab}>
              <button
                className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ""}`}
                onClick={() => {
                  setActiveTab(tab);
                  setIsEditing(false);
                }}
              >
                {tab === "profile" ? "📋 Mon Profil" : "🔒 Sécurité"}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <main className={styles.fadeIn}>
        {activeTab === "profile" &&
          (isEditing ? (
            <EditProfileForm
              user={user}
              onSubmit={handleUpdateProfile}
              onCancel={() => setIsEditing(false)}
              isLoading={isLoading}
            />
          ) : (
            <ProfileCard user={user} onEditClick={() => setIsEditing(true)} />
          ))}

        {activeTab === "security" && (
          <ChangePasswordForm
            onSubmit={handleChangePassword}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
}
