package icc.web.book_media_store.module.user.controller;
 
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import icc.web.book_media_store.module.user.dto.*;
import icc.web.book_media_store.module.user.service.UserServices;


import java.util.Map;
 
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
 
    private final UserServices userService;
 
    // POST /api/user/register  →  inscription
    @PostMapping("/register")
    public ResponseEntity<UserProfileResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.register(request));
    }
    
    // GET /api/user/profile  →  returns the profile of the logged-in user
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
 
        UserProfileResponse response = userService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
 
    // PUT /api/user/profile  →  update firstName, lastName, email, phone
    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
 
        UserProfileResponse response = userService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }
 
    // PUT /api/user/change-password  →  change password (requires current password)
    @PutMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
 
        userService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }
 
    // POST /api/user/avatar  →  upload a profile picture
    @PostMapping("/avatar")
    public ResponseEntity<Map<String, String>> uploadAvatar(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {
 
        String avatarUrl = userService.uploadAvatar(userDetails.getUsername(), file);
        return ResponseEntity.ok(Map.of("avatarUrl", avatarUrl));
    }
}
