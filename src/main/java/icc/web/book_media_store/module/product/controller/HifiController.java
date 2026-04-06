package icc.web.book_media_store.module.product.controller;

import icc.web.book_media_store.module.product.dto.HifiCreateDTO;
import icc.web.book_media_store.module.product.dto.HifiUpdateDTO;
import icc.web.book_media_store.module.product.dto.ProductResponseDTO;
import icc.web.book_media_store.module.product.service.ProductService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hifi")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HifiController {

    private final ProductService productService;

    /**
     * POST /api/hifi
     * Crée un nouvel équipement HiFi (Enceintes, Amplis, etc.)
     */
    @PostMapping
    public ResponseEntity<ProductResponseDTO> create(@RequestBody HifiCreateDTO dto) {
        return new ResponseEntity<>(productService.createHifi(dto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAll() {
        return ResponseEntity.ok(productService.getAllHifi());
    }
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> update(@PathVariable Long id, @RequestBody HifiUpdateDTO dto) {
        return ResponseEntity.ok(productService.updateHifi(id, dto));
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