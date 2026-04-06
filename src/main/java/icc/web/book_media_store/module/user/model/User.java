package icc.web.book_media_store.module.user.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import icc.web.book_media_store.module.user.model.role.Role;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users") // "user" est un mot réservé dans beaucoup de BDD, "users" est plus sûr
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder // Ajouté pour permettre l'utilisation de User.builder() dans le ChatService
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private LocalDate birthDate;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false, length = 10)
    private String postalCode;

    private String phone;

    private String avatarUrl;

    // --- GESTION DES RÔLES ---
    @ElementCollection(fetch = FetchType.EAGER) // EAGER car on a souvent besoin des rôles pour la sécurité
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    @Builder.Default // Pour que le builder utilise la valeur par défaut ci-dessous
    private Set<Role> roles = new HashSet<>(Set.of(Role.USER));

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}