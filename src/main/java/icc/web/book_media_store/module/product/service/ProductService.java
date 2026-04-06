package icc.web.book_media_store.module.product.service;

import icc.web.book_media_store.module.product.dto.BookCreateDTO;
import icc.web.book_media_store.module.product.dto.BookUpdateDTO;
import icc.web.book_media_store.module.product.dto.ComputerCreateDTO;
import icc.web.book_media_store.module.product.dto.ComputerUpdateDTO;
import icc.web.book_media_store.module.product.dto.HifiCreateDTO;
import icc.web.book_media_store.module.product.dto.HifiUpdateDTO;
import icc.web.book_media_store.module.product.dto.ProductResponseDTO;
import icc.web.book_media_store.module.product.dto.ProductUpdateDTO;
import icc.web.book_media_store.module.product.model.Book;
import icc.web.book_media_store.module.product.model.ComputerEquipment;
import icc.web.book_media_store.module.product.model.Hifi;
import icc.web.book_media_store.module.product.model.Product;
import icc.web.book_media_store.module.product.model.ProductType;
import icc.web.book_media_store.module.product.repository.ProductRepository;
import icc.web.book_media_store.module.product.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    /**
     * Récupère TOUS les produits (Livres, PC, HiFi mélangés)
     */
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Filtre les produits par type (ex: voir uniquement les Livres)
     */
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getProductsByType(ProductType type) {
        return productRepository.findByType(type).stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Supprime n'importe quel produit par son ID
     */
    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Transactional
    public ProductResponseDTO createBook(BookCreateDTO dto) {
        Book book = productMapper.toEntity(dto);
        book.setType(ProductType.LIVRE); // Sécurité : on force le type
        return productMapper.toDTO(productRepository.save(book));
    }

    @Transactional
    public ProductResponseDTO createComputer(ComputerCreateDTO dto) {
        ComputerEquipment computer = productMapper.toEntity(dto);
        computer.setType(ProductType.MATERIEL_INFORMATIQUE);
        return productMapper.toDTO(productRepository.save(computer));
    }

    @Transactional
        public ProductResponseDTO createHifi(HifiCreateDTO dto) { // À créer sur le modèle des autres
        Hifi hifi = productMapper.toEntity(dto);
        hifi.setType(ProductType.HIFI);
        return productMapper.toDTO(productRepository.save(hifi));
    }
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllBooks() {
        return productRepository.findByType(ProductType.LIVRE).stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllComputers() {
        return productRepository.findByType(ProductType.MATERIEL_INFORMATIQUE).stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllHifi() {
        return productRepository.findByType(ProductType.HIFI).stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(Long id) {
        // On cherche dans le repository parent
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit avec l'ID " + id + " non trouvé"));
                
        // Le mapper transformera l'objet en DTO complet (avec auteur ou processeur)
        return productMapper.toDTO(product);
    }

    @Transactional
    public ProductResponseDTO updateBook(Long id, BookUpdateDTO dto) {
        Book book = (Book) productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livre non trouvé"));
        
        updateCommonFields(book, dto);
        if(dto.getAuthor() != null) book.setAuthor(dto.getAuthor());
        if(dto.getPageCount() != null) book.setPageCount(dto.getPageCount());
        if(dto.getCategory() != null) book.setCategory(dto.getCategory());
        
        return productMapper.toDTO(productRepository.save(book));
    }

    @Transactional
    public ProductResponseDTO updateComputer(Long id, ComputerUpdateDTO dto) {
        ComputerEquipment computer = (ComputerEquipment) productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordinateur non trouvé"));
        
        updateCommonFields(computer, dto);
        if(dto.getBrand() != null) computer.setBrand(dto.getBrand());
        if(dto.getProcessor() != null) computer.setProcessor(dto.getProcessor());
        if(dto.getRamSize() != null) computer.setRamSize(dto.getRamSize());
        
        return productMapper.toDTO(productRepository.save(computer));
    }

    @Transactional
    public ProductResponseDTO updateHifi(Long id, HifiUpdateDTO dto) {
        Hifi hifi = (Hifi) productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matériel HiFi non trouvé"));
        
        updateCommonFields(hifi, dto);
        if(dto.getModel() != null) hifi.setModel(dto.getModel());
        if(dto.getPowerWatts() != null) hifi.setPowerWatts(dto.getPowerWatts());
        
        return productMapper.toDTO(productRepository.save(hifi));
    }

    // Petite méthode utilitaire privée pour éviter de répéter le code des champs communs
    private void updateCommonFields(Product product, ProductUpdateDTO dto) {
        if(dto.getName() != null) product.setName(dto.getName());
        if(dto.getDescription() != null) product.setDescription(dto.getDescription());
        if(dto.getPrice() != null) product.setPrice(dto.getPrice());
        if(dto.getStock() != null) product.setStock(dto.getStock());
        if(dto.getImageUrl() != null) product.setImageUrl(dto.getImageUrl());
    }
    
}