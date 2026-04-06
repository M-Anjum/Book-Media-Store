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

    // --- DEPUIS LE FRONT vers la BDD (Création / Update) ---
    Book toEntity(BookCreateDTO dto);
    
    ComputerEquipment toEntity(ComputerCreateDTO dto);

    Hifi toEntity(HifiCreateDTO dto);

    // --- DEPUIS LA BDD vers le FRONT (Lecture / Affichage) ---
    // On utilise "default" pour dire à MapStruct comment gérer l'héritage
    default ProductResponseDTO toDTO(Product product) {
        if (product == null) {
            return null;
        }

        ProductResponseDTO dto = new ProductResponseDTO();
        
        // 1. Les champs communs à tous les produits
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
if (product.getPrice() != null) {
    dto.setPrice(product.getPrice().doubleValue());
}        dto.setStock(product.getStock());
        dto.setImageUrl(product.getImageUrl());
        dto.setType(product.getType());

        // 2. Les champs spécifiques selon le vrai type du produit en base
        if (product instanceof Book) {
            Book book = (Book) product;
            dto.setAuthor(book.getAuthor());
            dto.setPageCount(book.getPageCount());
            dto.setCategory(book.getCategory());
        } 
        else if (product instanceof ComputerEquipment) {
            ComputerEquipment pc = (ComputerEquipment) product;
            dto.setBrand(pc.getBrand());
            dto.setProcessor(pc.getProcessor());
            dto.setRamSize(pc.getRamSize());
        } 
        else if (product instanceof Hifi) {
            Hifi hifi = (Hifi) product;
            dto.setModel(hifi.getModel());
            dto.setPowerWatts(hifi.getPowerWatts());
        }

        return dto;
    }
}