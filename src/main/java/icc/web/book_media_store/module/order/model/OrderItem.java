package icc.web.book_media_store.module.order.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

import icc.web.book_media_store.module.product.model.Product;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product; // On pointe vers la classe mère !

    private Integer quantity;
    private BigDecimal priceAtPurchase; // On fige le prix au moment de la commande

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
}
