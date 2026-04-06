package icc.web.book_media_store.module.product.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Inheritance(strategy = InheritanceType.JOINED) // Crée des tables séparées liées par ID
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Anciennement 'title', on utilise 'name' car c'est plus générique (ex: PC portable)

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double price;

    private Integer stock;

    @Column(name = "image_url")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private ProductType type; // LIVRE, HIFI, etc.

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}