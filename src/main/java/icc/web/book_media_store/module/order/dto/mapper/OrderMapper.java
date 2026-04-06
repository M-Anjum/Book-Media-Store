package icc.web.book_media_store.module.order.dto.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import icc.web.book_media_store.module.order.dto.OrderResponseDto;
import icc.web.book_media_store.module.order.model.Order;
import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface OrderMapper {

    @Mapping(target = "orderDate", dateFormat = "dd/MM/yyyy HH:mm")
    OrderResponseDto toDto(Order order);

    List<OrderResponseDto> toDtoList(List<Order> orders);
}