package icc.web.book_media_store.module.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import icc.web.book_media_store.module.order.model.Order;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserLoginOrderByOrderDateDesc(String userLogin);
}
