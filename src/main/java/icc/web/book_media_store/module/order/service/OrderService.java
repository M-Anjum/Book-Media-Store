package icc.web.book_media_store.module.order.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import icc.web.book_media_store.module.order.dto.OrderRequest;
import icc.web.book_media_store.module.order.model.Order;
import icc.web.book_media_store.module.order.model.OrderItem;
import icc.web.book_media_store.module.order.repository.OrderRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

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

        // Mapping manuel des items pour le calcul du prix (Hackathon mode)
        order.setItems(request.getItems().stream().map(itemReq -> {
            OrderItem item = new OrderItem();
            item.setProductId(itemReq.getProductId());
            item.setQuantity(itemReq.getQuantity());
            item.setPriceAtPurchase(new BigDecimal("19.99")); // Prix fixe simulé
            item.setOrder(order);
            return item;
        }).collect(Collectors.toList()));

        // Calcul du total
        BigDecimal total = order.getItems().stream()
                .map(i -> i.getPriceAtPurchase().multiply(new BigDecimal(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalAmount(total);
        return orderRepository.save(order);
    }
}
