import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../order/cart/CartContext";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // Vérifie si une session est active via le cookie JSESSIONID
  const isAuthenticated = document.cookie.includes("JSESSIONID");

  // Utilitaire pour gérer l'état actif des liens
  const isActive = (path: string) =>
    location.pathname === path ? styles.active : "";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">
          Bookea<span> Store</span>
        </Link>
      </div>

      <ul className={styles.navLinks}>
        <li>
          <Link to="/" className={isActive("/")}>Accueil</Link>
        </li>
        <li>
          <Link to="/orders/me" className={isActive("/orders/me")}>Mes Commandes</Link>
        </li>

        {/* --- ESPACE ADMIN --- */}
        <li>
          <Link
            to="/admin/orders"
            className={`${styles.adminLink} ${isActive("/admin/orders")}`}
          >
            Commandes Admin
          </Link>
        </li>
        <li>
          <Link
            to="/admin/add-product"
            className={`${styles.adminLink} ${isActive("/admin/add-product")}`}
          >
            + Ajouter Produit
          </Link>
        </li>
      </ul>

      <div className={styles.actions}>
        {isAuthenticated ? (
          <button onClick={handleLogout} className={styles.registerButton}>
            Déconnexion
          </button>
        ) : (
          <>
            <Link to="/login" className={styles.authLink}>
              Connexion
            </Link>
            <Link to="/register" className={styles.registerButton}>
              S'inscrire
            </Link>
          </>
        )}
        <Link to="/cart" className={styles.cartButton}>
          <span className={styles.cartIcon}>🛒</span>
          Panier
          {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;