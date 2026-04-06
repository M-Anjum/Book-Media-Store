package icc.web.book_media_store.module.product.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import icc.web.book_media_store.module.product.model.Product;
import icc.web.book_media_store.module.product.model.ProductType;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Permet de récupérer uniquement les livres, ou uniquement le Hi-Fi
    List<Product> findByType(ProductType type);
    
    // Recherche globale par nom sur TOUS les types de produits
    List<Product> findByNameContainingIgnoreCase(String name);
}