package icc.web.book_media_store.infrastructure.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtils {

	private static final SecretKey KEY = Keys.hmacShaKeyFor(
			"defaultSecretKeyMustBeAtLeast32BytesLongForJwt!!".getBytes(StandardCharsets.UTF_8));

	public String generateToken(UserDetails userDetails) {
		return Jwts.builder()
				.setSubject(userDetails.getUsername())
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + 86400000))
				.signWith(KEY, SignatureAlgorithm.HS256)
				.compact();
	}

	public String extractUsername(String token) {
		return Jwts.parserBuilder().setSigningKey(KEY).build()
				.parseClaimsJws(token).getBody().getSubject();
	}
}
