import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../order/cart/CartContext";
import { useAuth } from "../../modules/auth/context/AuthContext";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">Bookea<span> Store</span></Link>
      </div>

      <ul className={styles.navLinks}>
        <li><Link to="/" className={isActive("/")}>Accueil</Link></li>
        <li><Link to="/blog" className={blogNavClass}>Blog</Link></li>
        <li><Link to="/orders/me" className={isActive("/orders/me")}>Mes Commandes</Link></li>
        {isAuthenticated && (
          <li><Link to="/profile" className={isActive("/profile")}>Mon Profil</Link></li>
        )}
        <li>
          <Link to="/admin/orders" className={`${styles.adminLink} ${isActive("/admin/orders")}`}>
            Commandes Admin
          </Link>
        </li>
        <li>
          <Link to="/admin/add-product" className={`${styles.adminLink} ${isActive("/admin/add-product")}`}>
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
  <span className={styles.cartText}>Panier</span>
  {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
</Link>
</div>
    </nav>
  );
};

export default Navbar;