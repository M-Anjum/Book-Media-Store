package icc.web.book_media_store.module.product.dto;
import lombok.Data;

@Data
public class ProductUpdateDTO {
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String imageUrl;
}