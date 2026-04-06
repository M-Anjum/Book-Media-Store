import React, { useState } from "react";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import styles from "./AdminProductPage.module.css";

const AdminProductPage: React.FC = () => {
  // État pour gérer la vue active (Catalogue ou Ajout)
  const [activeTab, setActiveTab] = useState<"LIST" | "ADD">("LIST");

  return (
    <div className={styles.adminWrapper}>
      <div className={styles.container}>
        {/* En-tête du Tableau de Bord */}
        <header className={styles.header}>
          <h1 className={styles.title}>
            Tableau de bord <span className={styles.accent}>Admin</span>
          </h1>
          <p className={styles.subtitle}>
            Gestion centralisée du catalogue Bookea Store.
          </p>
        </header>

        {/* Barre de Navigation des Onglets */}
        <div className={styles.tabsWrapper}>
          <div className={styles.tabsBackground}>
            <button
              onClick={() => setActiveTab("LIST")}
              className={`${styles.tabButton} ${activeTab === "LIST" ? styles.activeTab : ""}`}
            >
              <span className={styles.icon}>📋</span> Catalogue
            </button>
            <button
              onClick={() => setActiveTab("ADD")}
              className={`${styles.tabButton} ${activeTab === "ADD" ? styles.activeTab : ""}`}
            >
              <span className={styles.icon}>➕</span> Ajouter un produit
            </button>
          </div>
        </div>

        {/* Zone de contenu dynamique */}
        <div className={styles.contentArea}>
          {activeTab === "LIST" ? (
            <div className={styles.fadeIn}>
              <ProductList />
            </div>
          ) : (
            <div className={styles.fadeIn}>
              <ProductForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductPage;
