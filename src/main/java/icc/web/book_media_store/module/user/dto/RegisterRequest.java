package icc.web.book_media_store.module.user.dto;

import icc.web.book_media_store.infrastructure.configuration.validation.PasswordMatches;
import icc.web.book_media_store.infrastructure.configuration.validation.StrongPassword;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

@PasswordMatches
public class RegisterRequest {

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(max = 50)
    private String firstName;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 50)
    private String lastName;

    @NotBlank(message = "Le pseudo est obligatoire")
    @Size(min = 3, max = 30, message = "Le pseudo doit contenir entre 3 et 30 caractères")
    private String username;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format email invalide")
    private String email;

    @NotNull(message = "La date de naissance est obligatoire")
    @Past(message = "La date de naissance doit être dans le passé")
    private LocalDate birthDate;

    @NotBlank(message = "L'adresse est obligatoire")
    private String address;

    @NotBlank(message = "Le code postal est obligatoire")
    @Pattern(regexp = "\\d{4,10}", message = "Code postal invalide")
    private String postalCode;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @StrongPassword
    private String password;

    @NotBlank(message = "La confirmation du mot de passe est obligatoire")
    private String confirmPassword;

    // Getters
    public String getFirstName()      { return firstName; }
    public String getLastName()       { return lastName; }
    public String getUsername()       { return username; }
    public String getEmail()          { return email; }
    public LocalDate getBirthDate()   { return birthDate; }
    public String getAddress()        { return address; }
    public String getPostalCode()     { return postalCode; }
    public String getPassword()       { return password; }
    public String getConfirmPassword(){ return confirmPassword; }

    // Setters
    public void setFirstName(String v)       { this.firstName = v; }
    public void setLastName(String v)        { this.lastName = v; }
    public void setUsername(String v)        { this.username = v; }
    public void setEmail(String v)           { this.email = v; }
    public void setBirthDate(LocalDate v)    { this.birthDate = v; }
    public void setAddress(String v)         { this.address = v; }
    public void setPostalCode(String v)      { this.postalCode = v; }
    public void setPassword(String v)        { this.password = v; }
    public void setConfirmPassword(String v) { this.confirmPassword = v; }
}