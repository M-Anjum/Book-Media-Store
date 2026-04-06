package icc.web.book_media_store.infrastructure.security;

import icc.web.book_media_store.module.mini_chat.model.User;
import icc.web.book_media_store.module.mini_chat.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

	private final JwtUtils jwtUtils;
	private final UserRepository userRepository;

	public JwtAuthFilter(JwtUtils jwtUtils, UserRepository userRepository) {
		this.jwtUtils = jwtUtils;
		this.userRepository = userRepository;
	}

	@Override
	protected void doFilterInternal(
			@NonNull HttpServletRequest request,
			@NonNull HttpServletResponse response,
			@NonNull FilterChain filterChain) throws ServletException, IOException {
		String header = request.getHeader(HttpHeaders.AUTHORIZATION);
		if (header == null || !header.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}
		String token = header.substring(7);
		if (!jwtUtils.validateToken(token)) {
			filterChain.doFilter(request, response);
			return;
		}
		String username = jwtUtils.extractUsername(token);
		if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			userRepository.findByUsername(username).ifPresent(user -> authenticate(request, user));
		}
		filterChain.doFilter(request, response);
	}

	private void authenticate(HttpServletRequest request, User user) {
		UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
				.username(user.getUsername())
				.password(user.getPassword())
				.authorities(List.of(new SimpleGrantedAuthority("ROLE_USER")))
				.build();
		UsernamePasswordAuthenticationToken authentication =
				new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
		authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
		SecurityContextHolder.getContext().setAuthentication(authentication);
	}
}
