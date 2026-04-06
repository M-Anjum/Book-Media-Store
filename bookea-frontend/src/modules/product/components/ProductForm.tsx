import React, { useState, ChangeEvent, FormEvent } from "react";
import { ProductType, BookCategory } from "../type/product";
import { productService } from "../services/productService";
import styles from "./ProductForm.module.css";

const ProductForm: React.FC = () => {
  const [type, setType] = useState<ProductType>("LIVRE");
  const [formData, setFormData] = useState<any>({ category: "ROMAN" });
  const [imageFile, setImageFile] = useState<File | null>(null); // État pour l'image
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type: inputType } = e.target;
    const finalValue = inputType === "number" ? parseFloat(value) : value;
    setFormData((prev: any) => ({ ...prev, [name]: finalValue }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // On envoie le fichier en 3ème argument
      await productService.createProduct(
        type,
        formData,
        imageFile || undefined,
      );
      alert(`Succès ! Produit et image enregistrés.`);
      // Reset optionnel
      setImageFile(null);
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
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value as ProductType);
              setFormData({ category: "ROMAN" });
              setImageFile(null);
            }}
          >
            <option value="LIVRE">📚 LIVRE</option>
            <option value="MATERIEL_INFORMATIQUE">💻 INFORMATIQUE</option>
            <option value="HIFI">🎧 HI-FI</option>
          </select>
        </div>

        <div className={styles.section}>
          <h3>Champs communs</h3>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nom du produit</label>
              <input name="name" onChange={handleChange} required />
            </div>
            <div className={styles.field}>
              <label>Prix (€)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Stock</label>
              <input
                name="stock"
                type="number"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Description</label>
            <textarea name="description" rows={2} onChange={handleChange} />
          </div>

          <div className={styles.row}>
            {/* Champ Upload Local */}
            <div className={styles.field}>
              <label>Photo du produit (Local)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
            </div>
            {/* On garde l'URL en option au cas où */}
            <div className={styles.field}>
              <label>Ou URL de l'image</label>
              <input
                name="imageUrl"
                placeholder="https://..."
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Champs spécifiques ({type})</h3>
          {type === "LIVRE" && (
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Auteur</label>
                <input name="author" onChange={handleChange} required />
              </div>
              <div className={styles.field}>
                <label>Pages</label>
                <input name="pageCount" type="number" onChange={handleChange} />
              </div>
              <div className={styles.field}>
                <label>Catégorie</label>
                <select name="category" onChange={handleChange}>
                  <option value="ROMAN">Roman</option>
                  <option value="MANGA">Manga</option>
                  <option value="BD">BD</option>
                  <option value="ESSAI">Essai</option>
                </select>
              </div>
            </div>
          )}

          {type === "MATERIEL_INFORMATIQUE" && (
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Marque</label>
                <input name="brand" onChange={handleChange} required />
              </div>
              <div className={styles.field}>
                <label>Processeur</label>
                <input name="processor" onChange={handleChange} />
              </div>
              <div className={styles.field}>
                <label>RAM (Go)</label>
                <input name="ramSize" type="number" onChange={handleChange} />
              </div>
            </div>
          )}

          {type === "HIFI" && (
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Modèle</label>
                <input name="model" onChange={handleChange} required />
              </div>
              <div className={styles.field}>
                <label>Puissance (Watts)</label>
                <input
                  name="powerWatts"
                  type="number"
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? "ENREGISTREMENT..." : "ENREGISTRER LE PRODUIT ✓"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
