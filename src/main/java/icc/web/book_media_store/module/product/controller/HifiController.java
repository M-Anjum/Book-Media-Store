package icc.web.book_media_store.module.product.controller;

import icc.web.book_media_store.module.product.dto.HifiCreateDTO;
import icc.web.book_media_store.module.product.dto.HifiUpdateDTO;
import icc.web.book_media_store.module.product.dto.ProductResponseDTO;
import icc.web.book_media_store.module.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/hifi")
@RequiredArgsConstructor
public class HifiController {

    private final ProductService productService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponseDTO> create(
            @RequestPart("product") @Valid HifiCreateDTO dto,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return new ResponseEntity<>(productService.createHifi(dto, image), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAll() {
        return ResponseEntity.ok(productService.getAllHifi());
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponseDTO> update(
            @PathVariable Long id,
            @RequestPart("product") @Valid HifiUpdateDTO dto,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.ok(productService.updateHifi(id, dto, image));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }
}