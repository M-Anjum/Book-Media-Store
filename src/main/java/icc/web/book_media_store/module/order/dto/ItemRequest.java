package icc.web.book_media_store.module.order.dto;

import lombok.Data;

@Data
public class ItemRequest {
    private Long productId;
    private Integer quantity;
}