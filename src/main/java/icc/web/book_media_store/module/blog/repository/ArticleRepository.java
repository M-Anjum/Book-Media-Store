package icc.web.book_media_store.module.blog.repository;

import icc.web.book_media_store.module.blog.model.Article;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleRepository extends JpaRepository<Article, Long> {

	/** Public listing / search: visible articles only. */
	List<Article> findByTitleContainingIgnoreCaseAndDeletedFalseAndActiveTrue(String keyword);

	List<Article> findAllByDeletedFalseAndActiveTrue();

	/** Admin dashboard: every row, including soft-deleted (ordered for restore UI). */
	List<Article> findAllByOrderByUpdatedAtDesc();

	Optional<Article> findByIdAndDeletedFalseAndActiveTrue(Long id);

	boolean existsByIdAndDeletedFalseAndActiveTrue(Long id);

	Optional<Article> findByIdAndDeletedFalse(Long id);
}
