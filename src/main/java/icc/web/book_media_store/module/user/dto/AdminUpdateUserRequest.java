package icc.web.book_media_store.module.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AdminUpdateUserRequest(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotBlank @Email String email,
        String phone,
        String address,
        String postalCode,
        @NotBlank String role
) {}