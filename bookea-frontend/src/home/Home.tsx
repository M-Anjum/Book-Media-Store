import React, { useEffect, useState } from "react";
import { useCart } from "../order/cart/CartContext";
import { ProductResponse } from "../modules/product/type/product";
import { productService } from "../modules/product/services/productService";
import styles from "./Home.module.css";

const Home: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const API_URL = "http://localhost:8080";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getImageUrl = (url: string | null) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${API_URL}${url}`;
  };

  if (loading) return <div className={styles.loader}>Chargement...</div>;

  return (
    <div className={styles.homeContainer}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>L'excellence au quotidien.</h1>
          <p>La sélection premium Bookea Store.</p>
        </div>
      </header>

      <section className={styles.productSection}>
        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                {product.imageUrl ? (
                  <img
                    src={getImageUrl(product.imageUrl)!}
                    alt={product.name}
                  />
                ) : (
                  <div className={styles.placeholder}>BOOKEA</div>
                )}
                {/* Badge avec couleur dynamique selon le type */}
                <span className={`${styles.badge} ${styles[product.type]}`}>
                  {product.type.replace("_", " ")}
                </span>
              </div>

              <div className={styles.content}>
                <h3 className={styles.productName}>{product.name}</h3>
                <div className={styles.cardFooter}>
                  <span className={styles.price}>
                    {product.price.toFixed(2)} €
                  </span>
                  <button
                    className={styles.addBtn}
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? "AJOUTER" : "ÉPUISÉ"}
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
