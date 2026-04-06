import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../order/cart/CartContext";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const location = useLocation();

  // Petit utilitaire pour savoir quelle page est active
  const isActive = (path: string) =>
    location.pathname === path ? styles.active : "";

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">
          Bookea<span> Store</span>
        </Link>
      </div>

      <ul className={styles.navLinks}>
        <li>
          <Link to="/" className={isActive("/")}>
            Accueil
          </Link>
        </li>
        <li>
          <Link to="/orders/me" className={isActive("/orders/me")}>
            Mes Commandes
          </Link>
        </li>
        <li>
          <Link
            to="/admin/orders"
            className={`${styles.adminLink} ${isActive("/admin/orders")}`}
          >
            Admin
          </Link>
        </li>
      </ul>

      <div className={styles.actions}>
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
