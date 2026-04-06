package icc.web.book_media_store.module.user.dto;
 
import jakarta.validation.constraints.*;
 
public record UpdateProfileRequest(
 
        @NotBlank(message = "First name is required")
        @Size(max = 50, message = "First name must not exceed 50 characters")
        String firstName,
 
        @NotBlank(message = "Last name is required")
        @Size(max = 50, message = "Last name must not exceed 50 characters")
        String lastName,
 
        @NotBlank(message = "Email is required")
        @Email(message = "Email format is invalid")
        String email,
 
        @Size(max = 20, message = "Phone number must not exceed 20 characters")
        String phone,
        @NotBlank(message = "L'adresse est obligatoire")
        String address,

        @NotBlank(message = "Le code postal est obligatoire")
        @Pattern(regexp = "\\d{4,10}", message = "Code postal invalide")
        String postalCode) {
}
