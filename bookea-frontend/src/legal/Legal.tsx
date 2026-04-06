import React from "react";
import styles from "./Legal.module.css"; // Importation du module

const Legal: React.FC = () => {
  return (
    <div className={styles.legalContainer}>
      <div className={styles.legalContent}>
        <h1 className={styles.bookeaTitle}>Mentions Légales</h1>

        <section>
          <h2 className={styles.bookeaSubtitle}>1. Édition du site</h2>
          <p>
            Le présent site est édité par :<br />
            <strong>L'entreprise Bookea Store</strong>, immatriculée au RCS sous
            le numéro 123 456 789.
            <br />
            Siège social : 12 rue de la Librairie, 75000 Paris.
          </p>
        </section>

        <section>
          <h2 className={styles.bookeaSubtitle}>2. Propriété intellectuelle</h2>
          <p>
            Toute reproduction, représentation ou modification de tout ou partie
            des éléments du site est interdite sans autorisation préalable de{" "}
            <span className={styles.bookeaAccent}>Bookea</span>.
          </p>
        </section>

        <section>
          <h2 className={styles.bookeaSubtitle}>
            3. Données personnelles (RGPD)
          </h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données,
            vous disposez d'un droit d'accès et de rectification de vos données.
            Nous utilisons vos informations uniquement pour le traitement de vos
            commandes et l'amélioration de votre expérience sur Bookea.
          </p>
        </section>

        <section>
          <h2 className={styles.bookeaSubtitle}>4. Contact</h2>
          <p>
            Pour toute question, vous pouvez nous contacter à l'adresse email
            suivante :
            <span className={styles.bookeaAccent}> support@bookea.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Legal;
