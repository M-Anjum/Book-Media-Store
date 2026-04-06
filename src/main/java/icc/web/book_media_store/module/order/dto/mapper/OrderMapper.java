package icc.web.book_media_store.module.order.dto.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import icc.web.book_media_store.module.order.dto.OrderItemDto;
import icc.web.book_media_store.module.order.dto.OrderResponseDto;
import icc.web.book_media_store.module.order.model.Order;
import icc.web.book_media_store.module.order.model.OrderItem;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface OrderMapper {

    @Mapping(target = "orderDate", dateFormat = "dd/MM/yyyy HH:mm")
    OrderResponseDto toDto(Order order);

    // Extraction des données du produit polymorphe
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "product.type", target = "productType")
    OrderItemDto toDto(OrderItem item);

    List<OrderResponseDto> toDtoList(List<Order> orders);
}