package icc.web.book_media_store.module.blog.dto;

import jakarta.validation.constraints.NotBlank;

public record CommentRequest(@NotBlank String content) {
}
