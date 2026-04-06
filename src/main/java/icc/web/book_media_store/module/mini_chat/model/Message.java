package icc.web.book_media_store.module.mini_chat.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// CRUCIAL : Import de l'utilisateur central de Bookea
import icc.web.book_media_store.module.user.model.User;

@Entity
@Table(name = "messages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Message {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(length = 500, nullable = false)
	private String content;

	// On utilise LAZY pour ne pas charger tout l'utilisateur
	// à chaque fois qu'on lit un simple message
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "sender_id", nullable = false)
	private User sender;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "room_id", nullable = false)
	private Room room;

	@Column(name = "sent_at", nullable = false, updatable = false)
	private LocalDateTime sentAt;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private MessageType type;

	@PrePersist
	public void prePersist() {
		if (sentAt == null) {
			sentAt = LocalDateTime.now();
		}
	}
}