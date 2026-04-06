package icc.web.book_media_store.module.order.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
// 1. On définit l'action de suppression logique
@SQLDelete(sql = "UPDATE orders SET deleted = true, deleted_at = NOW() WHERE id=?")
// 2. On filtre les résultats par défaut (Hibernate 6+)
@SQLRestriction("deleted = false")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderNumber;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    private String userLogin;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<OrderItem> items;

    // --- CHAMPS D'AUDIT POUR LE SOFT DELETE ---

    @Column(nullable = false)
    private boolean deleted = false;

    private LocalDateTime deletedAt;

    private String deletedBy; // Stockera le login de l'admin qui a supprimé
}