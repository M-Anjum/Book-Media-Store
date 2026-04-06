package icc.web.book_media_store.module.user.dto;
 
import java.time.LocalDateTime;
 
public record UserProfileResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        String phone,
        String avatarUrl,
        String role,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
