package icc.web.book_media_store.module.mini_chat.service;

import icc.web.book_media_store.infrastructure.error.BusinessException;
import icc.web.book_media_store.infrastructure.error.ErrorCode;
import icc.web.book_media_store.module.mini_chat.dto.MessageDTO;
import icc.web.book_media_store.module.mini_chat.dto.RoomDTO;
import icc.web.book_media_store.module.mini_chat.model.Message;
import icc.web.book_media_store.module.mini_chat.model.MessageType;
import icc.web.book_media_store.module.mini_chat.model.Room;
import icc.web.book_media_store.module.mini_chat.model.User;
import icc.web.book_media_store.module.mini_chat.repository.MessageRepository;
import icc.web.book_media_store.module.mini_chat.repository.RoomRepository;
import icc.web.book_media_store.module.mini_chat.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class ChatService {

	private final MessageRepository messageRepository;
	private final RoomRepository roomRepository;
	private final UserRepository userRepository;

	public ChatService(
			MessageRepository messageRepository,
			RoomRepository roomRepository,
			UserRepository userRepository) {
		this.messageRepository = messageRepository;
		this.roomRepository = roomRepository;
		this.userRepository = userRepository;
	}

	@Transactional
	public MessageDTO saveMessage(MessageDTO dto) {
		String content = dto.getContent() != null ? dto.getContent() : "";
		if (content.length() > 500) {
			throw new BusinessException(ErrorCode.VALIDATION_ERROR);
		}
		User sender = userRepository.findByUsername(dto.getSenderUsername())
				.orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
		Room room = roomRepository.findById(dto.getRoomId())
				.orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
		MessageType type = parseType(dto.getType());
		Message message = Message.builder()
				.content(content)
				.sender(sender)
				.room(room)
				.type(type)
				.build();
		message = messageRepository.save(message);
		return toDto(message);
	}

	@Transactional(readOnly = true)
	public List<MessageDTO> getMessagesByRoom(Long roomId) {
		Room room = roomRepository.findById(roomId)
				.orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
		Page<Message> page = messageRepository.findByRoomOrderBySentAtDesc(room, Pageable.ofSize(10));
		List<Message> lastTenDesc = page.getContent();
		List<Message> lastTenAsc = new ArrayList<>(lastTenDesc);
		Collections.reverse(lastTenAsc);
		return lastTenAsc.stream()
				.map(this::toDto)
				.toList();
	}

	@Transactional
	public RoomDTO createRoom(RoomDTO dto) {
		if (roomRepository.findByName(dto.getName()).isPresent()) {
			throw new BusinessException(ErrorCode.VALIDATION_ERROR);
		}
		Room room = Room.builder()
				.name(dto.getName())
				.description(dto.getDescription())
				.build();
		room = roomRepository.save(room);
		return toRoomDto(room);
	}

	@Transactional(readOnly = true)
	public List<RoomDTO> getAllRooms() {
		return roomRepository.findAll().stream()
				.map(this::toRoomDto)
				.toList();
	}

	private MessageType parseType(String type) {
		if (type == null || type.isBlank()) {
			return MessageType.CHAT;
		}
		try {
			return MessageType.valueOf(type.trim().toUpperCase());
		} catch (IllegalArgumentException e) {
			return MessageType.CHAT;
		}
	}

	private MessageDTO toDto(Message message) {
		return MessageDTO.builder()
				.id(message.getId())
				.content(message.getContent())
				.senderUsername(message.getSender().getUsername())
				.roomId(message.getRoom().getId())
				.sentAt(message.getSentAt())
				.type(message.getType().name())
				.build();
	}

	private RoomDTO toRoomDto(Room room) {
		return RoomDTO.builder()
				.id(room.getId())
				.name(room.getName())
				.description(room.getDescription())
				.createdAt(room.getCreatedAt())
				.build();
	}
}
