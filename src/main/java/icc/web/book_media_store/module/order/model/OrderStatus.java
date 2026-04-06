package icc.web.book_media_store.module.order.model;

public enum OrderStatus {
    PENDING, // Créée, en attente de paiement
    PAID, // Payée
    SHIPPED, // Expédiée
    DELIVERED, // Livrée
    CANCELED // Annulée
}