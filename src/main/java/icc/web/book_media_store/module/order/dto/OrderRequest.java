package icc.web.book_media_store.module.order.dto;

import java.util.List;

import lombok.Data;

@Data
class OrderRequest {
    private List<ItemRequest> items;
}
