package icc.web.book_media_store.module.order.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import icc.web.book_media_store.infrastructure.error.BusinessException;
import icc.web.book_media_store.infrastructure.error.ErrorCode;
import icc.web.book_media_store.module.order.dto.OrderRequest;
import icc.web.book_media_store.module.order.model.Order;
import icc.web.book_media_store.module.order.model.OrderItem;
import icc.web.book_media_store.module.order.model.OrderStatus;
import icc.web.book_media_store.module.order.repository.OrderRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    @Transactional
    public Order createOrder(OrderRequest request, String login) {
        Order order = new Order();
        order.setOrderNumber("BK-" + System.currentTimeMillis());
        order.setOrderDate(LocalDateTime.now());
        order.setUserLogin(login);
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> items = request.getItems().stream().map(itemReq -> {
            OrderItem item = new OrderItem();
            item.setProductId(itemReq.getProductId());
            item.setQuantity(itemReq.getQuantity());
            item.setPriceAtPurchase(new BigDecimal("19.99"));
            item.setOrder(order);
            return item;
        }).toList();

        order.setItems(items);

        BigDecimal total = items.stream()
                .map(i -> i.getPriceAtPurchase().multiply(new BigDecimal(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalAmount(total);
        return orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public List<Order> getOrdersByLogin(String login) {
        return orderRepository.findByUserLoginOrderByOrderDateDesc(login);
    }

    @Transactional
    public void cancelOrder(Long id, String login) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

        if (!order.getUserLogin().equals(login)) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR);
        }

        order.setStatus(OrderStatus.CANCELED);
        orderRepository.save(order);
    }

    // --- MÉTHODES ADMIN ---

    @Transactional(readOnly = true)
    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    /**
     * Pour consulter uniquement les commandes supprimées (Archives)
     */
    @Transactional(readOnly = true)
    public List<Order> getDeletedOrders() {
        return orderRepository.findAllDeleted();
    }

    @Transactional
    public Order updateOrderStatus(Long id, OrderStatus newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    /**
     * SOFT DELETE : On marque l'auteur de la suppression avant d'appeler delete()
     * L'annotation @SQLDelete dans l'entité fera le reste.
     */
    @Transactional
    public void deleteOrder(Long id, String adminLogin) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

        // On enregistre qui a fait l'action
        order.setDeletedBy(adminLogin);
        orderRepository.save(order);

        // Déclenche l'UPDATE SQL au lieu du DELETE physique
        orderRepository.delete(order);
    }
}