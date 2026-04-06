package icc.web.book_media_store.module.user.controller;

import icc.web.book_media_store.module.user.dto.AdminUpdateUserRequest;
import icc.web.book_media_store.module.user.dto.AdminUserResponse;
import icc.web.book_media_store.module.user.service.AdminUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    // GET /api/admin/users
    @GetMapping
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminUserService.getAllUsers());
    }

    // GET /api/admin/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<AdminUserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(adminUserService.getUserById(id));
    }

    // PUT /api/admin/users/{id}
    @PutMapping("/{id}")
    public ResponseEntity<AdminUserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody AdminUpdateUserRequest request) {
        return ResponseEntity.ok(adminUserService.updateUser(id, request));
    }

    // DELETE /api/admin/users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        adminUserService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "Utilisateur supprimé"));
    }
}
