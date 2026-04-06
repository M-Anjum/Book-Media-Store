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

import java.util.List;
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

    // --- CRÉATION ---

    @Transactional
    public ProductResponseDTO createBook(BookCreateDTO dto) {
        Book book = productMapper.toEntity(dto);
        book.setType(ProductType.LIVRE);
        return productMapper.toDTO(productRepository.save(book));
    }

    @Transactional
    public ProductResponseDTO createComputer(ComputerCreateDTO dto) {
        ComputerEquipment computer = productMapper.toEntity(dto);
        computer.setType(ProductType.MATERIEL_INFORMATIQUE);
        return productMapper.toDTO(productRepository.save(computer));
    }

    @Transactional
    public ProductResponseDTO createHifi(HifiCreateDTO dto) {
        Hifi hifi = productMapper.toEntity(dto);
        hifi.setType(ProductType.HIFI);
        return productMapper.toDTO(productRepository.save(hifi));
    }

    // --- MODIFICATION ---

    @Transactional
    public ProductResponseDTO updateBook(Long id, BookUpdateDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

        if (!(product instanceof Book book)) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR);
        }

        updateCommonFields(book, dto);
        if (dto.getAuthor() != null)
            book.setAuthor(dto.getAuthor());
        if (dto.getPageCount() != null)
            book.setPageCount(dto.getPageCount());
        if (dto.getCategory() != null)
            book.setCategory(dto.getCategory());

        return productMapper.toDTO(productRepository.save(book));
    }

    @Transactional
    public ProductResponseDTO updateComputer(Long id, ComputerUpdateDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

        if (!(product instanceof ComputerEquipment computer)) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR);
        }

        updateCommonFields(computer, dto);
        if (dto.getBrand() != null)
            computer.setBrand(dto.getBrand());
        if (dto.getProcessor() != null)
            computer.setProcessor(dto.getProcessor());
        if (dto.getRamSize() != null)
            computer.setRamSize(dto.getRamSize());

        return productMapper.toDTO(productRepository.save(computer));
    }

    @Transactional
    public ProductResponseDTO updateHifi(Long id, HifiUpdateDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

        if (!(product instanceof Hifi hifi)) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR);
        }

        updateCommonFields(hifi, dto);
        if (dto.getModel() != null)
            hifi.setModel(dto.getModel());
        if (dto.getPowerWatts() != null)
            hifi.setPowerWatts(dto.getPowerWatts());

        return productMapper.toDTO(productRepository.save(hifi));
    }

    // --- SUPPRESSION ---

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        productRepository.deleteById(id);
    }

    // --- UTILITAIRES ---

    /**
     * Met à jour les champs partagés par tous les types de produits (DRY).
     */
    private void updateCommonFields(Product product, ProductUpdateDTO dto) {
        if (dto.getName() != null)
            product.setName(dto.getName());
        if (dto.getDescription() != null)
            product.setDescription(dto.getDescription());
        if (dto.getPrice() != null)
            product.setPrice(dto.getPrice());
        if (dto.getStock() != null)
            product.setStock(dto.getStock());
        if (dto.getImageUrl() != null)
            product.setImageUrl(dto.getImageUrl());
    }
}