package icc.web.book_media_store.module.mini_chat.controller;

import icc.web.book_media_store.module.mini_chat.dto.MessageDTO;
import icc.web.book_media_store.module.mini_chat.dto.RoomDTO;
import icc.web.book_media_store.module.mini_chat.service.ChatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

	private final ChatService chatService;

	public RoomController(ChatService chatService) {
		this.chatService = chatService;
	}

	@GetMapping
	public ResponseEntity<List<RoomDTO>> getAllRooms() {
		return ResponseEntity.ok(chatService.getAllRooms());
	}

	@PostMapping
	public ResponseEntity<RoomDTO> createRoom(@RequestBody RoomDTO roomDTO) {
		RoomDTO created = chatService.createRoom(roomDTO);
		return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}

	@GetMapping("/{roomId}/messages")
	public ResponseEntity<List<MessageDTO>> getMessagesByRoom(@PathVariable Long roomId) {
		return ResponseEntity.ok(chatService.getMessagesByRoom(roomId));
	}
}
