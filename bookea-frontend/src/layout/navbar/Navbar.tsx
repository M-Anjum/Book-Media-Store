import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../order/cart/CartContext";
import { useAuth } from "../../modules/auth/context/AuthContext";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const API_URL = "http://localhost:8080";

  const isActive = (path: string) =>
    location.pathname === path ? styles.active : "";

  const blogNavClass =
    location.pathname === "/blog" || location.pathname.startsWith("/blog/")
      ? styles.active
      : "";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isAdmin = user?.role?.includes("ADMIN");

  const getAvatarUrl = () => {
    if (!user?.avatarUrl) return null;
    return user.avatarUrl.startsWith("http")
      ? user.avatarUrl
      : `${API_URL}${user.avatarUrl}`;
  };

  return (
    <nav className={styles.navbar}>
      {/* --- LOGO --- */}
      <div className={styles.logo}>
        <Link to="/">
          Bookea<span> Store</span>
        </Link>
      </div>

      {/* --- NAVIGATION CENTRALE --- */}
      <ul className={styles.navLinks}>
        <li><Link to="/" className={isActive("/")}>Accueil</Link></li>
        <li><Link to="/blog" className={blogNavClass}>Blog</Link></li>
        <li><Link to="/orders/me" className={isActive("/orders/me")}>Mes Commandes</Link></li>

        {isAuthenticated && (
          <li>
            <Link to="/profile" className={isActive("/profile")}>
              Mon Profil
            </Link>
          </li>
        )}

        {isAdmin && (
          <li className={styles.adminDropdown}>
            <span className={styles.adminTrigger}>
              Espace Admin <span className={styles.chevron}>▾</span>
            </span>
            <ul className={styles.dropdownMenu}>
              <li>
                <Link to="/admin/add-product">📦 Produits</Link>
              </li>
              <li>
                <Link to="/admin/orders">📑 Commandes</Link>
              </li>
              <li>
                <Link to="/admin/users">👥 Utilisateurs</Link>
              </li>
              <li>
                <Link to="/admin/blog" className={isActive("/admin/blog")}>
                  📝 Gestion du Blog
                </Link>
              </li>
            </ul>
          </li>
        )}
      </ul>

      {/* --- ACTIONS --- */}
      <div className={styles.actions}>
        {/* BOUTON PANIER */}
        <Link to="/cart" className={styles.cartButton}>
          <svg
            className={styles.cartIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        
          {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
        </Link>

        {isAuthenticated ? (
          /* MENU PROFIL SI CONNECTÉ */
          <div className={styles.profileDropdown}>
            <div className={styles.avatarTrigger}>
              {getAvatarUrl() ? (
                <img
                  src={getAvatarUrl()!}
                  alt="Avatar"
                  className={styles.avatarImg}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <ul className={styles.profileMenu}>
              <li className={styles.menuHeader}>
                <strong>{user?.username}</strong>
                <span>{isAdmin ? "Administrateur" : "Client"}</span>
              </li>
              <div className={styles.divider}></div>
              <li>
                <Link to="/profile">👤 Mon Profil</Link>
              </li>
              <li>
                <Link to="/orders/me">📦 Mes Commandes</Link>
              </li>
              <div className={styles.divider}></div>
              <li>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  🚪 Déconnexion
                </button>
              </li>
            </ul>
          </div>
        ) : (
          /* BOUTONS CONNEXION/INSCRIPTION SI DÉCONNECTÉ */
          <div className={styles.authButtons}>
            <Link to="/login" className={styles.authLink}>
              Connexion
            </Link>
            <Link to="/register" className={styles.registerButton}>
              S'inscrire
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
