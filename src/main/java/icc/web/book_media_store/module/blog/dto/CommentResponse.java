package icc.web.book_media_store.module.blog.dto;

import java.time.LocalDateTime;

public record CommentResponse(Long id, String content, String authorUsername, LocalDateTime createdAt) {
}
