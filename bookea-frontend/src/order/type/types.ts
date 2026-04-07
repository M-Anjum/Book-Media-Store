export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
}

export interface Page<T> {
  content: T[]; // Les données réelles (ex: liste de commandes)
  totalPages: number; // Nombre total de pages
  totalElements: number; // Nombre total d'éléments en BDD
  size: number; // Taille de la page demandée
  number: number; // Numéro de la page actuelle (commence à 0)
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface OrderRequest {
  items: {
    productId: number;
    quantity: number;
  }[];
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  orderDate: string;
  status: OrderStatus;
  totalAmount: number;
  items: any[]; // On simplifie pour le focus Order
}



