import React, { useEffect, useState } from "react";
import { useCart } from "../order/cart/CartContext";
import { ProductResponse } from "../modules/product/type/product"; // <-- Mets le bon chemin vers tes types de produits// 1. AJOUTE L'IMPORT DU SERVICE (Vérifie que le chemin correspond bien à ton arborescence)
import { productService } from "../modules/product/services/productService"; 
import styles from "./Home.module.css";

const Home: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Chargement des produits depuis ton backend Spring Boot
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Associe le type du backend à la couleur de ton CSS
  const getBadgeClass = (type: string) => {
    switch(type) {
      case 'LIVRE': return styles.badgeLivre;
      case 'MATERIEL_INFORMATIQUE': return styles.badgeInfo;
      case 'HIFI': return styles.badgeHifi;
      default: return '';
    }
  };

  // Raccourcit le nom pour que le badge reste beau et lisible
  const getBadgeName = (type: string) => {
    switch(type) {
      case 'MATERIEL_INFORMATIQUE': return 'INFO';
      default: return type;
    }
  };

  if (loading) {
    return <div className={styles.loader}>Chargement de l'univers Bookea...</div>;
  }

  return (
    <div className={styles.homeContainer}>
      
      {/* Hero Banner (Style VOD/Streaming) */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>L'UNIVERS MULTIMÉDIA</h1>
          <p>
            Découvrez notre sélection premium de Livres, Hi-Fi et Matériel Informatique.
          </p>
        </div>
      </header>

      {/* Grille de Produits */}
      <section className={styles.productSection}>
        <h2 className={styles.title}>Nouveautés</h2>
        
        {products.length === 0 ? (
          <p style={{ color: '#a3a3a3' }}>Aucun produit disponible pour le moment.</p>
        ) : (
          <div className={styles.grid}>
            {products.map((product) => (
              <div key={product.id} className={styles.card}>
                
                {/* Image + Badge */}
                <div className={styles.imageBox}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                  ) : (
                    <div className={styles.placeholder}>BOOKEA</div>
                  )}
                  <span className={`${styles.typeBadge} ${getBadgeClass(product.type)}`}>
                    {getBadgeName(product.type)}
                  </span>
                </div>

                {/* Infos du produit */}
                <div className={styles.info}>
                  <h3>{product.name}</h3>
                  <p className={styles.description}>
                    {product.description || "Aucune description disponible pour ce produit."}
                  </p>
                  
                  {/* Prix et Bouton (Toujours alignés en bas grâce à Flexbox) */}
                  <div className={styles.footerCard}>
                    <span className={styles.price}>
                      {product.price.toFixed(2)} €
                    </span>
                    <button
                      className={styles.addBtn}
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                    >
                      {product.stock > 0 ? "Ajouter" : "Épuisé"}
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;