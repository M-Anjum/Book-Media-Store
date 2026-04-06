package icc.web.book_media_store.module.product.controller;

import icc.web.book_media_store.module.product.dto.BookCreateDTO;
import icc.web.book_media_store.module.product.dto.BookUpdateDTO;
import icc.web.book_media_store.module.product.dto.ProductResponseDTO;
import icc.web.book_media_store.module.product.service.ProductService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final ProductService productService;

    /**
     * POST /api/books
     * Crée un nouveau livre dans la table 'books' (et 'products' via l'héritage)
     */
    @PostMapping
    public ResponseEntity<ProductResponseDTO> create(@RequestBody BookCreateDTO dto) {
        return new ResponseEntity<>(productService.createBook(dto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAll() {
        return ResponseEntity.ok(productService.getAllBooks());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> update(@PathVariable Long id, @RequestBody BookUpdateDTO dto) {
        return ResponseEntity.ok(productService.updateBook(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build(); 
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getById(@PathVariable Long id) {
        // On utilise la méthode globale du service qui gère déjà le mapping
        return ResponseEntity.ok(productService.getProductById(id));
    }
}