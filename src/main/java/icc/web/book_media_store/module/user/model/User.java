package icc.web.book_media_store.module.user.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import icc.web.book_media_store.module.user.model.role.Role;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class User {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(nullable = false)
    private String firstName;
 
    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String username; 
 
    @Column(nullable = false, unique = true)
    private String email;
 
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private LocalDate birthDate; // date de naissance

    @Column(nullable = false)
    private String address; // adresse postale

    @Column(nullable = false, length = 10)
    private String postalCode; // code postal
 
    private String phone;
 
    private String avatarUrl;
 
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
 
    @UpdateTimestamp
    private LocalDateTime updatedAt;
 
    
}
