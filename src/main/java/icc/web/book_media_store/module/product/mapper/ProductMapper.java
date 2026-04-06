package icc.web.book_media_store.module.product.mapper;

import icc.web.book_media_store.module.product.dto.BookCreateDTO;
import icc.web.book_media_store.module.product.dto.ComputerCreateDTO;
import icc.web.book_media_store.module.product.dto.HifiCreateDTO;
import icc.web.book_media_store.module.product.dto.ProductResponseDTO;
import icc.web.book_media_store.module.product.model.Book;
import icc.web.book_media_store.module.product.model.ComputerEquipment;
import icc.web.book_media_store.module.product.model.Hifi;
import icc.web.book_media_store.module.product.model.Product;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    // Vers le Front
    ProductResponseDTO toDTO(Product product);

    // Depuis le Front
    Book toEntity(BookCreateDTO dto);
    
    // On pourra ajouter Computer et HiFi ici plus tard
    ComputerEquipment toEntity(ComputerCreateDTO dto);

    Hifi toEntity(HifiCreateDTO dto);
}