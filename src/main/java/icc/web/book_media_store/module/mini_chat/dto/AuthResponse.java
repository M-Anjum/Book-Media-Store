package icc.web.book_media_store.module.mini_chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AuthResponse {

	private String token;
	private String username;
	private Long id;
}
