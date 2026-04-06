package icc.web.book_media_store.module.product.controller;

import icc.web.book_media_store.module.product.dto.ProductResponseDTO;
import icc.web.book_media_store.module.product.model.ProductType;
import icc.web.book_media_store.module.product.service.ProductService;
import lombok.RequiredArgsConstructor; // <--- Vérifie cet import
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor // <--- Génère le constructeur pour productService
public class ProductController {

    private final ProductService productService; 

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAll() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/filter")
    public ResponseEntity<List<ProductResponseDTO>> getByType(@RequestParam ProductType type) {
        return ResponseEntity.ok(productService.getProductsByType(type));
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