import React, { useEffect, useState } from "react";
import { orderService } from "../../service/orderService";
import { OrderResponse, OrderStatus, Page } from "../../type/types";
import styles from "./AdminDashboard.module.css";

const AdminDashboard: React.FC = () => {
  const [page, setPage] = useState<Page<OrderResponse> | null>(null);

  const load = (p = 0) => {
    orderService.getAllOrders(p).then(setPage);
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    await orderService.updateStatus(id, status as OrderStatus);
    load(page?.number);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette commande ?")) {
      await orderService.deleteOrder(id);
      load(page?.number);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <h1>Gestion des Commandes</h1>
        <p>Interface d'administration Bookea Store</p>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>N° Commande</th>
              <th>Date</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {page?.content.map((order) => (
              <tr key={order.id}>
                <td className={styles.orderNumber}>{order.orderNumber}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className={styles.price}>{order.totalAmount}€</td>
                <td>
                  <select
                    className={styles.statusSelect}
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
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
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(order.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (Indispensable pour l'admin) */}
      <div className={styles.pagination}>
        <button disabled={page?.first} onClick={() => load(page!.number - 1)}>
          « Précédent
        </button>
        <span>
          Page {page ? page.number + 1 : 0} sur {page?.totalPages}
        </span>
        <button disabled={page?.last} onClick={() => load(page!.number + 1)}>
          Suivant »
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
