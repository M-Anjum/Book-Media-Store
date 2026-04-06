import React, { useEffect, useState } from "react";
import { orderService } from "../../../service/orderService";
import { OrderResponse } from "../../../type/types";
import styles from "./AdminArchived.module.css";

const AdminArchived: React.FC = () => {
  const [archivedOrders, setArchivedOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getArchivedOrders()
      .then(setArchivedOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className={styles.loader}>Chargement des archives...</div>;

  return (
    <div className={styles.archiveContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Archives des commandes</h1>
        <p className={styles.count}>
          {archivedOrders.length} commandes archivées
        </p>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.archiveTable}>
          <thead>
            <tr>
              <th>N° Commande</th>
              <th>Date</th>
              <th>Montant</th>
              <th>Statut Final</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {archivedOrders.map((order) => (
              <tr key={order.id} className={styles.row}>
                <td className={styles.orderNum}>{order.orderNumber}</td>
                <td>{order.orderDate}</td>
                <td className={styles.amount}>
                  {order.totalAmount.toFixed(2)} €
                </td>
                <td>
                  <span className={styles.statusBadge}>{order.status}</span>
                </td>
                <td className={styles.auditInfo}>
                  {/* Si ton DTO inclut deletedBy, c'est le moment de l'afficher */}
                  Supprimé logiquement
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {archivedOrders.length === 0 && (
        <p className={styles.empty}>Aucune archive à afficher.</p>
      )}
    </div>
  );
};

export default AdminArchived;
