import React from "react";
import { Link } from "react-router-dom"; // Import indispensable pour le routage
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <h3>
            Bookea<span> Store</span>
          </h3>
          <p>Votre plateforme de médias et tech préférée.</p>
        </div>

        <div className={styles.links}>
          <h4>Navigation</h4>
          <ul>
            <li>
              <Link to="/about">À propos</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/legal">Mentions légales</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>
          &copy; {new Date().getFullYear()} Bookea Store. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
