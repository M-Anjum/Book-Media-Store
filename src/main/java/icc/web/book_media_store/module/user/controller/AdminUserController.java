package icc.web.book_media_store.module.user.controller;

import icc.web.book_media_store.module.user.dto.AdminUserResponse;
import icc.web.book_media_store.module.user.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminUserService.getAllUsers());
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<AdminUserResponse> toggleActive(@PathVariable Long id) {
        return ResponseEntity.ok(adminUserService.toggleActive(id));
    }
}