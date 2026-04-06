package icc.web.book_media_store.module.blog.dto;

import java.time.LocalDateTime;

public record ArticleResponse(
		Long id,
		String title,
		String content,
		LocalDateTime createdAt,
		LocalDateTime updatedAt,
		String imageUrl,
		int likes,
		int dislikes,
		boolean active,
		boolean deleted) {
}
