import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <h3>Bookea<span> Store</span></h3>
          <p>Votre plateforme de médias et tech préférée.</p>
        </div>

        <div className={styles.links}>
          <h4>Navigation</h4>
          <ul>
            <li>A propos</li>
            <li>Contact</li>
            <li>Mentions légales</li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>
          &copy; {new Date().getFullYear()} Book & Media Store. Tous droits
          réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
