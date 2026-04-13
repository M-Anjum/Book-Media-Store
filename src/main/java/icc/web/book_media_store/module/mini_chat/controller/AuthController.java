package icc.web.book_media_store.module.mini_chat.controller;

import icc.web.book_media_store.module.mini_chat.dto.AuthResponse;
import icc.web.book_media_store.module.mini_chat.dto.LoginRequest;
import icc.web.book_media_store.module.mini_chat.dto.RegisterRequest;
import icc.web.book_media_store.module.mini_chat.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat/auth")
public class AuthController {

	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
		return ResponseEntity.ok(authService.register(request));
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
		return ResponseEntity.ok(authService.login(request));
	}
}
