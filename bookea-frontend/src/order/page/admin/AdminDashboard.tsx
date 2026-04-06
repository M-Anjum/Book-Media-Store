import React, { useEffect, useState } from "react";
import { orderService } from "../../service/orderService";
import { OrderResponse, OrderStatus, Page } from "../../type/types";
import styles from "./AdminDashboard.module.css";

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<Page<OrderResponse> | null>(null);

  const load = (page = 0) => orderService.getAllOrders(page).then(setData);

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: number, s: string) => {
    await orderService.updateStatus(id, s as OrderStatus);
    load(data?.number);
  };

  const remove = async (id: number) => {
    if (confirm("Confirmer la suppression logique ?")) {
      await orderService.deleteOrder(id);
      load(data?.number);
    }
  };

  return (
    <div className={styles.adminPane}>
      <h1 className={styles.head}>Gestion des commandes</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Commande</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.content.map((order) => (
            <tr key={order.id}>
              <td>{order.orderNumber}</td>
              <td>
                <select
                  className={styles.select}
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                >
                  {Object.values(OrderStatus).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  className={styles.delBtn}
                  onClick={() => remove(order.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
