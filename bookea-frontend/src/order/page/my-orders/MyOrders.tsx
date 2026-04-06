import React, { useEffect, useState } from "react";
import { orderService } from "../../service/orderService";
import { OrderResponse, OrderStatus } from "../../type/types";
import styles from "./MyOrders.module.css";

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);

  const fetchOrders = () => orderService.getMyOrders().then(setOrders);

  useEffect(() => {
    fetchOrders();
  }, []);

  const onCancel = async (id: number) => {
    await orderService.cancelMyOrder(id);
    fetchOrders(); // Rafraîchissement silencieux de l'UI
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Mes achats</h2>
      <div className={styles.list}>
        {orders.map((order) => (
          <div key={order.id} className={styles.card}>
            <div className={styles.mainInfo}>
              <span className={styles.date}>{order.orderDate}</span>
              <span className={styles.number}>#{order.orderNumber}</span>
            </div>
            <div
              className={`${styles.status} ${styles[order.status.toLowerCase()]}`}
            >
              {order.status}
            </div>
            {order.status === OrderStatus.PENDING && (
              <button
                className={styles.cancelLink}
                onClick={() => onCancel(order.id)}
              >
                Annuler
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
