package icc.web.book_media_store.module.product.model;

import icc.web.book_media_store.module.product.enums.BookCategory;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "books")
@Data
@EqualsAndHashCode(callSuper = true) // Important pour que Lombok gère bien l'héritage
@NoArgsConstructor
@AllArgsConstructor
public class Book extends Product {

    private String author;

    @Column(name = "page_count")
    private Integer pageCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private BookCategory category; // ROMAN, MANGA, etc.

    // Constructeur pour forcer le type à la création
    public Book(String name, String description, Double price, Integer stock, 
            String imageUrl, String author, Integer pageCount, BookCategory category) {
    // 1. On envoie les infos communes au constructeur du Parent (Product)
    this.setName(name);
    this.setDescription(description);
    this.setPrice(price);
    this.setStock(stock);
    this.setImageUrl(imageUrl);
    this.setType(ProductType.LIVRE); // On force le type ici

    // 2. On remplit les infos propres au Livre
    this.author = author;
    this.pageCount = pageCount;
    this.category = category;
}
}