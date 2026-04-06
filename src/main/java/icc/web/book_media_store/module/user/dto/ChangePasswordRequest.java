package icc.web.book_media_store.module.user.dto;
 
import icc.web.book_media_store.infrastructure.configuration.validation.PasswordMatches;
import icc.web.book_media_store.infrastructure.configuration.validation.StrongPassword;
import jakarta.validation.constraints.NotBlank;
 
@PasswordMatches
public class ChangePasswordRequest {
 
    @NotBlank(message = "Current password is required")
    private String currentPassword;
 
    @NotBlank(message = "New password is required")
    @StrongPassword
    private String password;
 
    @NotBlank(message = "Password confirmation is required")
    private String confirmPassword;
 
    // Getters — required by @PasswordMatches via reflection
    public String getCurrentPassword() { return currentPassword; }
    public String getPassword()        { return password; }
    public String getConfirmPassword() { return confirmPassword; }
 
    // Setters
    public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
    public void setPassword(String password)               { this.password = password; }
    public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }
}