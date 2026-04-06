package icc.web.book_media_store.module.user.dto;
 
import java.time.LocalDateTime;
import java.util.Set;
import java.time.LocalDate;
 
public record UserProfileResponse(
        Long id,
        String firstName,
        String lastName,
        String username,
        String email,
        String phone,
        String avatarUrl,
        Set<String> roles,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDate birthDate,
        String address,
        String postalCode) {
}
