import React from "react";
import { useCart } from "../cart/CartContext";
import { orderService } from "../service/orderService";
import styles from "./Cart.module.css";

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } =
    useCart();

  const handleCheckout = async () => {
    const request = {
      items: items.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
      })),
    };

    try {
      await orderService.placeOrder(request);
      clearCart();
      window.location.href = "/orders/me"; // Redirection silencieuse
    } catch (error) {
      console.error("Erreur lors de la commande");
    }
  };

  if (items.length === 0) {
    return <div className={styles.empty}>Votre panier est vide.</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mon Panier</h1>
      <div className={styles.grid}>
        <div className={styles.itemsList}>
          {items.map((item) => (
            <div key={item.product.id} className={styles.item}>
              <div className={styles.details}>
                <span className={styles.productType}>{item.product.type}</span>
                <h3>{item.product.name}</h3>
                <p>{item.product.price.toFixed(2)} €</p>
              </div>
              <div className={styles.controls}>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.product.id, parseInt(e.target.value))
                  }
                />
                <button onClick={() => removeFromCart(item.product.id)}>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.summary}>
          <h2>Résumé</h2>
          <p className={styles.total}>
            Total : <span>{totalPrice.toFixed(2)} €</span>
          </p>
          <button className={styles.checkoutBtn} onClick={handleCheckout}>
            Valider la commande
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
