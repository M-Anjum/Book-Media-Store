package icc.web.book_media_store.module.mini_chat.repository;

import icc.web.book_media_store.module.mini_chat.model.Message;
import icc.web.book_media_store.module.mini_chat.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

	List<Message> findByRoomOrderBySentAtAsc(Room room);

	List<Message> findByRoomAndSentAtAfter(Room room, LocalDateTime since);
}
