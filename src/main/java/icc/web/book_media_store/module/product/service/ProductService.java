package icc.web.book_media_store.module.product.service;

import icc.web.book_media_store.infrastructure.error.BusinessException;
import icc.web.book_media_store.infrastructure.error.ErrorCode;
import icc.web.book_media_store.module.product.dto.*;
import icc.web.book_media_store.module.product.model.*;
import icc.web.book_media_store.module.product.repository.ProductRepository;
import icc.web.book_media_store.module.product.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    // --- LECTURE ---

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
        return productMapper.toDTO(product);
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getProductsByType(ProductType type) {
        return productRepository.findByType(type).stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllBooks() {
        return getProductsByType(ProductType.LIVRE);
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllComputers() {
        return getProductsByType(ProductType.MATERIEL_INFORMATIQUE);
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllHifi() {
        return getProductsByType(ProductType.HIFI);
    }

    // --- CRÉATION AVEC IMAGE ---

    @Transactional
    public ProductResponseDTO createBook(BookCreateDTO dto, MultipartFile image) {
        Book book = productMapper.toEntity(dto);
        book.setType(ProductType.LIVRE);
        handleImageUpload(book, image);
        return productMapper.toDTO(productRepository.save(book));
    }

    @Transactional
    public ProductResponseDTO createComputer(ComputerCreateDTO dto, MultipartFile image) {
        ComputerEquipment computer = productMapper.toEntity(dto);
        computer.setType(ProductType.MATERIEL_INFORMATIQUE);
        handleImageUpload(computer, image);
        return productMapper.toDTO(productRepository.save(computer));
    }

    @Transactional
    public ProductResponseDTO createHifi(HifiCreateDTO dto, MultipartFile image) {
        Hifi hifi = productMapper.toEntity(dto);
        hifi.setType(ProductType.HIFI);
        handleImageUpload(hifi, image);
        return productMapper.toDTO(productRepository.save(hifi));
    }

    // --- MODIFICATION AVEC IMAGE ---

    @Transactional
    public ProductResponseDTO updateBook(Long id, BookUpdateDTO dto, MultipartFile image) {
        Book book = (Book) findProductAndCheckType(id, Book.class);
        updateCommonFields(book, dto, image);

        if (dto.getAuthor() != null)
            book.setAuthor(dto.getAuthor());
        if (dto.getPageCount() != null)
            book.setPageCount(dto.getPageCount());
        if (dto.getCategory() != null)
            book.setCategory(dto.getCategory());

        return productMapper.toDTO(productRepository.save(book));
    }

    @Transactional
    public ProductResponseDTO updateComputer(Long id, ComputerUpdateDTO dto, MultipartFile image) {
        ComputerEquipment computer = (ComputerEquipment) findProductAndCheckType(id, ComputerEquipment.class);
        updateCommonFields(computer, dto, image);

        if (dto.getBrand() != null)
            computer.setBrand(dto.getBrand());
        if (dto.getProcessor() != null)
            computer.setProcessor(dto.getProcessor());
        if (dto.getRamSize() != null)
            computer.setRamSize(dto.getRamSize());

        return productMapper.toDTO(productRepository.save(computer));
    }

    @Transactional
    public ProductResponseDTO updateHifi(Long id, HifiUpdateDTO dto, MultipartFile image) {
        Hifi hifi = (Hifi) findProductAndCheckType(id, Hifi.class);
        updateCommonFields(hifi, dto, image);

        if (dto.getModel() != null)
            hifi.setModel(dto.getModel());
        if (dto.getPowerWatts() != null)
            hifi.setPowerWatts(dto.getPowerWatts());

        return productMapper.toDTO(productRepository.save(hifi));
    }

    // --- SUPPRESSION ---

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

        // Supprimer l'image du disque avant de supprimer l'entrée en BDD
        deletePhysicalFile(product.getImageUrl());
        productRepository.delete(product);
    }

    // --- UTILITAIRES PRIVÉS ---

    private Product findProductAndCheckType(Long id, Class<?> expectedClass) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
        if (!expectedClass.isInstance(product)) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR);
        }
        return product;
    }

    private void updateCommonFields(Product product, ProductUpdateDTO dto, MultipartFile image) {
        if (dto.getName() != null)
            product.setName(dto.getName());
        if (dto.getDescription() != null)
            product.setDescription(dto.getDescription());
        if (dto.getPrice() != null)
            product.setPrice(dto.getPrice());
        if (dto.getStock() != null)
            product.setStock(dto.getStock());

        // Si une nouvelle image est uploadée, on gère le remplacement
        if (image != null && !image.isEmpty()) {
            handleImageUpload(product, image);
        } else if (dto.getImageUrl() != null) {
            // Si on passe juste une URL (ex: image externe), on l'accepte
            product.setImageUrl(dto.getImageUrl());
        }
    }

    private void handleImageUpload(Product product, MultipartFile image) {
        if (image == null || image.isEmpty())
            return;

        // Supprimer l'ancienne image si elle existe
        deletePhysicalFile(product.getImageUrl());

        try {
            Path uploadPath = Paths.get("uploads/products");
            if (!Files.exists(uploadPath))
                Files.createDirectories(uploadPath);

            String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
            Files.copy(image.getInputStream(), uploadPath.resolve(filename));

            product.setImageUrl("/uploads/products/" + filename);
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    private void deletePhysicalFile(String imageUrl) {
        if (imageUrl != null && imageUrl.startsWith("/uploads/")) {
            try {
                // On retire le premier "/" pour avoir le chemin relatif "uploads/..."
                Path path = Paths.get(imageUrl.substring(1));
                Files.deleteIfExists(path);
            } catch (IOException e) {
                // On log l'erreur mais on ne bloque pas la transaction
                System.err.println("Échec de la suppression du fichier : " + imageUrl);
            }
        }
    }
}