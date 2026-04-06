import React, { useState } from "react";
import { orderService } from "../../service/orderService";
import styles from "./Checkout.module.css";

const Checkout: React.FC = () => {
  // Dans un vrai projet, ces items viendraient de ton CartContext
  const [cart] = useState([{ productId: 1, quantity: 2 }]);

  const handleConfirm = async () => {
    try {
      await orderService.placeOrder({ items: cart });
      window.location.href = "/orders/me"; // Redirection silencieuse après succès
    } catch (error) {
      console.error("Erreur commande");
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Finaliser ma commande</h1>
      <div className={styles.summary}>
        {/* Liste des items ici */}
        <button className={styles.confirmBtn} onClick={handleConfirm}>
          Confirmer l'achat
        </button>
      </div>
    </div>
  );
};

export default Checkout;
