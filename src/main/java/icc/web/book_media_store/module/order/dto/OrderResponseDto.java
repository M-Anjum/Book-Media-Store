package icc.web.book_media_store.module.order.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class OrderResponseDto {
    private Long id;
    private String orderNumber;
    private String orderDate;
    private String status;
    private BigDecimal totalAmount;
    private List<OrderItemDto> items;
}