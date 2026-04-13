package icc.web.book_media_store.module.mini_chat.service;

import icc.web.book_media_store.infrastructure.error.BusinessException;
import icc.web.book_media_store.infrastructure.error.ErrorCode;
import icc.web.book_media_store.infrastructure.security.JwtUtils;
import icc.web.book_media_store.module.mini_chat.dto.AuthResponse;
import icc.web.book_media_store.module.mini_chat.dto.LoginRequest;
import icc.web.book_media_store.module.mini_chat.dto.RegisterRequest;
import icc.web.book_media_store.module.mini_chat.model.User;
import icc.web.book_media_store.module.mini_chat.repository.ChatUserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuthService {

	private final ChatUserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtils jwtUtils;

	public AuthService(ChatUserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtUtils = jwtUtils;
	}

	@Transactional
	public AuthResponse register(RegisterRequest request) {
		if (userRepository.existsByUsername(request.getUsername())) {
			throw new BusinessException(ErrorCode.VALIDATION_ERROR);
		}
		if (userRepository.existsByEmail(request.getEmail())) {
			throw new BusinessException(ErrorCode.VALIDATION_ERROR);
		}
		User user = User.builder()
				.username(request.getUsername())
				.email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword()))
				.build();
		user = userRepository.save(user);
		UserDetails principal = org.springframework.security.core.userdetails.User.builder()
				.username(user.getUsername())
				.password(user.getPassword())
				.authorities(List.of(new SimpleGrantedAuthority("ROLE_USER")))
				.build();
		String token = jwtUtils.generateToken(principal);
		return AuthResponse.builder()
				.token(token)
				.username(user.getUsername())
				.id(user.getId())
				.build();
	}

	@Transactional(readOnly = true)
	public AuthResponse login(LoginRequest request) {
		User user = userRepository.findByUsername(request.getUsername())
				.orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED));
		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new BusinessException(ErrorCode.UNAUTHORIZED);
		}
		UserDetails principal = org.springframework.security.core.userdetails.User.builder()
				.username(user.getUsername())
				.password(user.getPassword())
				.authorities(List.of(new SimpleGrantedAuthority("ROLE_USER")))
				.build();
		String token = jwtUtils.generateToken(principal);
		return AuthResponse.builder()
				.token(token)
				.username(user.getUsername())
				.id(user.getId())
				.build();
	}
}
