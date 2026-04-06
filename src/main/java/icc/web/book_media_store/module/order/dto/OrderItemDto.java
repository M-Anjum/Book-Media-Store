package icc.web.book_media_store.module.order.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class OrderItemDto {
    private Long productId;
    private Integer quantity;
    private BigDecimal priceAtPurchase;
}