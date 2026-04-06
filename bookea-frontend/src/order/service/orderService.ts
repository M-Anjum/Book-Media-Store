import { OrderRequest, OrderResponse, OrderStatus, Page } from "../type/types";

const BASE_URL = "/api/orders";

export const orderService = {
  // USER ENDPOINTS
  placeOrder: async (request: OrderRequest): Promise<OrderResponse> => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // On envoie directement l'objet request qui contient déjà { items: [...] }
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "Impossible de finaliser la commande");
    }

    return res.json();
  },

  getMyOrders: async (): Promise<OrderResponse[]> => {
    const res = await fetch(`${BASE_URL}/me`);
    return res.json();
  },

  cancelMyOrder: async (id: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}/cancel`, {
      method: "PATCH",
      credentials: "include", // N'oublie pas pour la session !
    });
    if (!res.ok) throw new Error("Impossible d'annuler la commande");
  },

  // ADMIN ENDPOINTS
  getAllOrders: async (page = 0, size = 10): Promise<Page<OrderResponse>> => {
    const res = await fetch(`${BASE_URL}/admin?page=${page}&size=${size}`, {
      credentials: "include",
    });
    return res.json();
  },

  getArchivedOrders: async (): Promise<OrderResponse[]> => {
    const res = await fetch(`${BASE_URL}/admin/archived`);
    return res.json();
  },

  updateStatus: async (id: number, status: OrderStatus) => {
    const res = await fetch(`${BASE_URL}/admin/${id}/status?status=${status}`, {
      method: "PATCH",
    });
    return res.json();
  },

  deleteOrder: async (id: number) => {
    await fetch(`${BASE_URL}/admin/${id}`, { method: "DELETE" });
  },
};
