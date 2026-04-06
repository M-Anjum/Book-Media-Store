package icc.web.book_media_store.module.mini_chat.dto;

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
	private String content;
	private String senderUsername;
	private Long roomId;
	private LocalDateTime sentAt;
	private String type;
}
