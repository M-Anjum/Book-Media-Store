import React, { useEffect, useState } from "react";
import { ProductResponse } from "../type/product";
import { productService } from "../services/productService";
import styles from "./ProductList.module.css";
interface ProductListProps {
  onEdit: (product: ProductResponse) => void;
}
const ProductList: React.FC<ProductListProps> = ({ onEdit }) => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- NOUVELLE FONCTION DE SUPPRESSION ---
  const handleDelete = async (id: number) => {
    // 1. Demander confirmation à l'Admin
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce produit définitivement ?");
    
    if (confirmDelete) {
      try {
        // 2. Appel au backend pour supprimer en base de données
        await productService.deleteProduct(id);
        
        // 3. Mise à jour de l'affichage : on filtre la liste pour enlever le produit supprimé
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
        
        alert("Produit supprimé avec succès !");
      } catch (err: any) {
        alert("Erreur lors de la suppression : " + err.message);
      }
    }
  };

  const getTypeBadge = (type: string) => {
    const classMap: Record<string, string> = {
      LIVRE: styles.badgeLivre,
      MATERIEL_INFORMATIQUE: styles.badgeInfo,
      HIFI: styles.badgeHifi,
    };
    return (
      <span className={`${styles.badge} ${classMap[type] || ""}`}>{type}</span>
    );
  };

  if (loading) return <div className={styles.loader}>Chargement...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Catalogue actuel ({products.length})</h2>
        <button onClick={fetchProducts} className={styles.refreshBtn}>
          🔄 Rafraîchir
        </button>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Nom</th>
              <th>Prix</th>
              <th>Stock</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className={styles.idCol}>#{product.id}</td>
                <td>{getTypeBadge(product.type)}</td>
                <td className={styles.nameCol}>{product.name}</td>
                <td className={styles.priceCol}>
                  {product.price.toFixed(2)} €
                </td>
                <td
                  className={
                    product.stock > 5 ? styles.stockOk : styles.stockLow
                  }
                >
                  {product.stock}
                </td>
                <td className={styles.actions}>
                  <button className={styles.editBtn} onClick={() => onEdit(product)}>
                    Éditer
                  </button>
                  <button 
                    className={styles.delBtn} 
                    onClick={() => handleDelete(product.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;