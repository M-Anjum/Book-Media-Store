package icc.web.book_media_store.module.product.dto;
import java.math.BigDecimal;

import lombok.Data;

@Data
public class ProductUpdateDTO {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String imageUrl;
}