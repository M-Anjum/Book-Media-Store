package icc.web.book_media_store.module.order.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class OrderItemDto {
    private Long productId;
    private String productName; // Récupéré depuis Product.name
    private String productType; // Récupéré depuis Product.type
    private Integer quantity;
    private Double priceAtPurchase;
}