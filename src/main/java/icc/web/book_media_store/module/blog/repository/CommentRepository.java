package icc.web.book_media_store.module.blog.repository;

import icc.web.book_media_store.module.blog.model.Comment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {

	List<Comment> findByArticleIdOrderByCreatedAtDesc(Long articleId);
}
