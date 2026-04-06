import React, { useEffect, useState } from "react";
import { useCart } from "../order/cart/CartContext";
import { ProductResponse } from "../order/type/types";
import styles from "./Home.module.css";

const Home: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();



  if (loading)
    return <div className={styles.loader}>Chargement de l'univers...</div>;

  return (
    <div className={styles.homeContainer}>
      {/* Hero Banner */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>MULTIMÉDIA & TECH</h1>
          <p>
            Découvrez notre sélection de Livres, Hi-Fi et Matériel Informatique.
          </p>
        </div>
      </header>

      {/* Grille de Produits */}
      <section className={styles.productSection}>
        <h2 className={styles.title}>Nouveautés</h2>
        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product.id} className={styles.card}>
              <div className={styles.imageBox}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} />
                ) : (
                  <div className={styles.placeholder}>IMAGE</div>
                )}
                <span
                  className={`${styles.typeBadge} ${styles[product.type.toLowerCase()]}`}
                >
                  {product.type}
                </span>
              </div>

              <div className={styles.info}>
                <h3>{product.name}</h3>
                <p className={styles.description}>{product.description}</p>
                <div className={styles.footerCard}>
                  <span className={styles.price}>
                    {product.price.toFixed(2)} €
                  </span>
                  <button
                    className={styles.addBtn}
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? "Ajouter" : "Rupture"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
