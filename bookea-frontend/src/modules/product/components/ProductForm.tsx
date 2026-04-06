import React, { useState, ChangeEvent, FormEvent } from "react";
import { ProductType, BookCategory } from "../type/product";
import { productService } from "../services/productService";
import styles from "./ProductForm.module.css";

const ProductForm: React.FC = () => {
  const [type, setType] = useState<ProductType>("LIVRE");
  const [formData, setFormData] = useState<any>({ category: "ROMAN" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await productService.createProduct(type, formData);
      alert(`Succès ! ${type} enregistré.`);
    } catch (err: any) {
      alert("Erreur : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Ajouter un nouveau produit</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.typeSelector}>
          <label>Type de produit</label>
          <select value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="LIVRE">📚 LIVRE</option>
            <option value="MATERIEL_INFORMATIQUE">💻 INFORMATIQUE</option>
            <option value="HIFI">🎧 HI-FI</option>
          </select>
        </div>

        <div className={styles.section}>
          <h3>Champs communs</h3>
          <div className={styles.row}>
            <input
              name="name"
              placeholder="Nom du produit"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <input
              name="price"
              type="number"
              placeholder="Prix (€)"
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) })
              }
              required
            />
            <input
              name="stock"
              type="number"
              placeholder="Stock"
              onChange={(e) =>
                setFormData({ ...formData, stock: parseInt(e.target.value) })
              }
              required
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? "ENREGISTREMENT..." : "ENREGISTRER CHEZ BOOKEA"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
