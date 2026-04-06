package icc.web.book_media_store.module.order.dto;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

import icc.web.book_media_store.module.order.model.Order;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private Integer quantity;
    private BigDecimal priceAtPurchase;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
}
