package icc.web.book_media_store.module.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import icc.web.book_media_store.module.order.model.Order;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Requête classique (automatiquement filtrée par @SQLRestriction)
    List<Order> findByUserLoginOrderByOrderDateDesc(String userLogin);

    /**
     * On utilise une requête native car @SQLRestriction bloque
     * les 'deleted = true' au niveau de la couche Hibernate.
     */
    @Query(value = "SELECT * FROM orders WHERE deleted = true", nativeQuery = true)
    List<Order> findAllDeleted();
}