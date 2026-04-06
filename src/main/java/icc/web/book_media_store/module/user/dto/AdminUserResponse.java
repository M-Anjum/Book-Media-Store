package icc.web.book_media_store.module.user.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AdminUserResponse(
        Long id,
        String firstName,
        String lastName,
        String username,
        String email,
        LocalDate birthDate,
        String address,
        String postalCode,
        String phone,
        String avatarUrl,
        String role,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}