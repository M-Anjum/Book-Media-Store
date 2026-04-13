package icc.web.book_media_store.module.product.dto;

import icc.web.book_media_store.module.product.model.ProductType;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonInclude;

import icc.web.book_media_store.module.product.enums.BookCategory;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String imageUrl;
    private ProductType type;

    // Champs spécifiques au Livre 
    private String author;
    private Integer pageCount;
    private BookCategory category;

    // --- Champs spécifiques au Matériel Informatique ---
    private String brand;
    private String processor;
    private Integer ramSize;

    // --- Champs spécifiques à la HiFi ---
    private String model;
    private Integer powerWatts;
}