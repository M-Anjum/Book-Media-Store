package icc.web.book_media_store.module.mini_chat.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

	@NotBlank
	private String username;

	@NotBlank
	@Email
	private String email;

	@NotBlank
	@Size(min = 6)
	private String password;
}
