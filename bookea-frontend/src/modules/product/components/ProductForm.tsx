import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { ProductType, BookCategory } from "../type/product";
import { productService } from "../services/productService";
import styles from "./ProductForm.module.css";

interface ProductFormProps {
    initialData?: any | null;
    onSuccess?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSuccess }) => {
  // 1. On définit isEditMode
  const isEditMode = !!initialData;

  const [type, setType] = useState<ProductType>("LIVRE");
  const [formData, setFormData] = useState<any>({ category: "ROMAN" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // 2. Le useEffect est bien importé en haut et utilisé ici
  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setFormData(initialData);
    } else {
      setType("LIVRE");
      setFormData({ category: "ROMAN" });
    }
  }, [initialData]);

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
      // 3. On choisit updateProduct ou createProduct selon le mode
      if (isEditMode) {
        await productService.updateProduct(
          initialData.id,
          type,
          formData,
          imageFile || undefined,
        );
        alert(`Succès ! Produit modifié.`);
      } else {
        await productService.createProduct(
          type,
          formData,
          imageFile || undefined,
        );
        alert(`Succès ! Produit enregistré.`);
      }
      
      setImageFile(null);
      if (onSuccess) onSuccess(); 
    } catch (err: any) {
      alert("Erreur : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>
        {isEditMode ? "Modifier le produit" : "Ajouter un nouveau produit"}
      </h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.typeSelector}>
          <label>Type de produit</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value as ProductType);
              setFormData((prev: any) => ({ ...prev, category: "ROMAN" }));
              setImageFile(null);
            }}
            disabled={isEditMode}
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
              <input name="name" value={formData.name || ""} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
              <label>Prix (€)</label>
              <input
                name="price"
                value={formData.price || ""}
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
                value={formData.stock || ""}
                type="number"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Description</label>
            <textarea name="description" value={formData.description || ""} rows={2} onChange={handleChange} />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Photo du produit (Local)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
            </div>
            <div className={styles.field}>
              <label>Ou URL de l'image</label>
              <input
                name="imageUrl"
                value={formData.imageUrl || ""}
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
                <input name="author" value={formData.author || ""} onChange={handleChange} required />
              </div>
              <div className={styles.field}>
                <label>Pages</label>
                <input name="pageCount" value={formData.pageCount || ""} type="number" onChange={handleChange} />
              </div>
              <div className={styles.field}>
                <label>Catégorie</label>
                <select name="category" value={formData.category || "ROMAN"} onChange={handleChange}>
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
                <input name="brand" value={formData.brand || ""} onChange={handleChange} required />
              </div>
              <div className={styles.field}>
                <label>Processeur</label>
                <input name="processor" value={formData.processor || ""} onChange={handleChange} />
              </div>
              <div className={styles.field}>
                <label>RAM (Go)</label>
                <input name="ramSize" value={formData.ramSize || ""} type="number" onChange={handleChange} />
              </div>
            </div>
          )}

          {type === "HIFI" && (
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Modèle</label>
                <input name="model" value={formData.model || ""} onChange={handleChange} required />
              </div>
              <div className={styles.field}>
                <label>Puissance (Watts)</label>
                <input
                  name="powerWatts"
                  value={formData.powerWatts || ""}
                  type="number"
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? "ENREGISTREMENT..." : isEditMode ? "MODIFIER LE PRODUIT ✏️" : "ENREGISTRER LE PRODUIT ✓"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;