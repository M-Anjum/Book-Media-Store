package icc.web.book_media_store.module.category.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "categories")
@Data // Génère Getters, Setters, Equals, HashCode et ToString
@NoArgsConstructor // Requis par JPA
@AllArgsConstructor // Pratique pour le @Builder
@Builder // Pour créer des objets facilement : Category.builder().name("SF").build()
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

}