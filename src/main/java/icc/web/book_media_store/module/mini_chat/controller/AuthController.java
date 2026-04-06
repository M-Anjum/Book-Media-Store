package icc.web.book_media_store.module.mini_chat.controller;

import icc.web.book_media_store.module.mini_chat.dto.AuthResponse;
import icc.web.book_media_store.module.mini_chat.dto.LoginRequest;
import icc.web.book_media_store.module.mini_chat.dto.RegisterRequest;
import icc.web.book_media_store.module.mini_chat.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
		AuthResponse body = authService.register(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(body);
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
		AuthResponse body = authService.login(request);
		return ResponseEntity.ok(body);
	}
}
