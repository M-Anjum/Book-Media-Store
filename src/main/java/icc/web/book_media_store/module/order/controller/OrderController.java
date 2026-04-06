package icc.web.book_media_store.module.order.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import icc.web.book_media_store.module.order.dto.OrderRequest;
import icc.web.book_media_store.module.order.dto.OrderResponseDto;
import icc.web.book_media_store.module.order.dto.mapper.OrderMapper;
import icc.web.book_media_store.module.order.model.Order;
import icc.web.book_media_store.module.order.model.OrderStatus;
import icc.web.book_media_store.module.order.service.OrderService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderMapper orderMapper;

    // --- ENDPOINTS UTILISATEUR ---

    @PostMapping
    public ResponseEntity<OrderResponseDto> placeOrder(@RequestBody OrderRequest request, Principal principal) {
        Order order = orderService.createOrder(request, principal.getName());
        return new ResponseEntity<>(orderMapper.toDto(order), HttpStatus.CREATED);
    }

    @GetMapping("/me")
    public ResponseEntity<List<OrderResponseDto>> getMyOrders(Principal principal) {
        List<Order> orders = orderService.getOrdersByLogin(principal.getName());
        return ResponseEntity.ok(orderMapper.toDtoList(orders));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long id, Principal principal) {
        orderService.cancelOrder(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    // --- ENDPOINTS ADMIN ---

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<OrderResponseDto>> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(orders.map(orderMapper::toDto));
    }

    /**
     * Endpoint pour voir uniquement les archives (Soft Deleted)
     */
    @GetMapping("/admin/archived")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponseDto>> getArchivedOrders() {
        List<Order> orders = orderService.getDeletedOrders();
        return ResponseEntity.ok(orderMapper.toDtoList(orders));
    }

    @PatchMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponseDto> updateStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {
        Order updated = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(orderMapper.toDto(updated));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id, Principal principal) {
        // IMPORTANT : On passe principal.getName() pour savoir quel admin a fait
        // l'action
        orderService.deleteOrder(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}