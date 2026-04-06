package icc.web.book_media_store.module.blog.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Corps de création / mise à jour d'un article.
 *
 * @param imageUrl Facultatif. Chemin servi par l'API après upload, ex. {@code /api/blog/images/uuid.jpg}.
 */
public record ArticleRequest(@NotBlank String title, @NotBlank String content, String imageUrl) {
}
