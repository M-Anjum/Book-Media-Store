import React from "react";
import styles from "./About.module.css";

const About: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* --- HERO SECTION --- */}
      <header className={styles.hero}>
        <h1 className={styles.mainTitle}>
          Bienvenue dans l'univers <span className={styles.accent}>Bookea</span>
        </h1>
        <p className={styles.lead}>
          Là où la profondeur des pages rencontre la précision de la tech.
        </p>
      </header>

      {/* --- NOTRE VISION (Layout Split) --- */}
      <section className={styles.splitSection}>
        <div className={styles.textBlock}>
          <h2 className={styles.sectionTitle}>Notre Vision</h2>
          <p>
            Fondée en 2026, **Bookea** est née d'un constat simple : la culture
            ne s'arrête pas à la dernière page d'un livre. Elle se prolonge dans
            la qualité d'une écoute Hifi et dans la puissance des outils
            numériques qui nous entourent.
          </p>
          <p>
            Nous avons créé un hub unique pour ceux qui exigent le meilleur des
            deux mondes : le confort d'un bon ouvrage et l'excellence du
            matériel moderne.
          </p>
        </div>
        <div className={styles.imagePlaceholder}>
          <div className={styles.decoBox}></div>
          <span>[ Image de concept Tech & Culture ]</span>
        </div>
      </section>

      {/* --- LES PILIERS (Grid) --- */}
      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.icon}>📚</div>
          <h3>Curateurs de Savoir</h3>
          <p>
            Chaque livre de notre catalogue est sélectionné pour sa pertinence
            et sa qualité éditoriale.
          </p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.icon}>🎧</div>
          <h3>Audio & Immersion</h3>
          <p>
            Une sélection Hifi pointue pour redécouvrir vos vinyles et vos
            podcasts préférés.
          </p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.icon}>💬</div>
          <h3>L'Instant Chat</h3>
          <p>
            Échangez instantanément avec la communauté via notre mini-chat
            propriétaire.
          </p>
        </div>
      </section>

      {/* --- QUOTE SECTION --- */}
      <footer className={styles.quoteWrapper}>
        <div className={styles.quoteCard}>
          <blockquote className={styles.quote}>
            "La lecture est une amitié."
          </blockquote>
          <cite className={styles.author}>— Marcel Proust</cite>
        </div>
      </footer>
    </div>
  );
};

export default About;
