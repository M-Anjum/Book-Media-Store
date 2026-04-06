package icc.web.book_media_store.module.mini_chat.repository;

import icc.web.book_media_store.module.mini_chat.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

	Optional<Room> findByName(String name);
}
