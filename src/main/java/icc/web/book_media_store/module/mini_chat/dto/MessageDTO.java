package icc.web.book_media_store.module.mini_chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {

	private Long id;

	@NotBlank
	@Size(max = 500, message = "Message cannot exceed 500 characters")
	private String content;
	private String senderUsername;
	private Long roomId;
	private LocalDateTime sentAt;
	private String type;
}
