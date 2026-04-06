import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../service/orderService";
import { OrderRequest } from "../../type/types";
import styles from "./OrderForm.module.css";

const OrderForm: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<{ productId: number; quantity: number }[]>(
    [],
  );
  const [tempId, setTempId] = useState("");
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    if (tempId) {
      setItems([...items, { productId: parseInt(tempId), quantity: 1 }]);
      setTempId("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const request: OrderRequest = { items };
      await orderService.placeOrder(request);
      alert("Commande validée !");
      navigate("/orders/my");
    } catch (err) {
      alert("Erreur lors de la validation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Nouvelle Commande</h1>
        <div className={styles.picker}>
          <input
            type="number"
            placeholder="ID du livre"
            value={tempId}
            onChange={(e) => setTempId(e.target.value)}
          />
          <button type="button" onClick={addItem} className={styles.addButton}>
            Ajouter
          </button>
        </div>

        <ul className={styles.itemList}>
          {items.map((it, index) => (
            <li key={index}>
              Produit #{it.productId} — Qté: {it.quantity}
            </li>
          ))}
        </ul>

        <button
          onClick={handleSubmit}
          className={styles.submitButton}
          disabled={loading || items.length === 0}
        >
          {loading ? "Chargement..." : "Confirmer l'achat"}
        </button>
      </div>
    </div>
  );
};

export default OrderForm;
