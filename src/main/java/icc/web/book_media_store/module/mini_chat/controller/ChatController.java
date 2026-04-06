package icc.web.book_media_store.module.mini_chat.controller;

import icc.web.book_media_store.infrastructure.error.BusinessException;
import icc.web.book_media_store.infrastructure.error.ErrorCode;
import icc.web.book_media_store.module.mini_chat.dto.MessageDTO;
import icc.web.book_media_store.module.mini_chat.model.MessageType;
import icc.web.book_media_store.module.mini_chat.repository.RoomRepository;
import icc.web.book_media_store.module.mini_chat.service.ChatService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

	private static final String ANONYMOUS_SENDER = "Anonyme";

	private final SimpMessagingTemplate messagingTemplate;
	private final ChatService chatService;
	private final RoomRepository roomRepository;

	public ChatController(
			SimpMessagingTemplate messagingTemplate,
			ChatService chatService,
			RoomRepository roomRepository) {
		this.messagingTemplate = messagingTemplate;
		this.chatService = chatService;
		this.roomRepository = roomRepository;
	}

	@MessageMapping("/chat.send/{roomId}")
	public void sendMessage(
			@DestinationVariable Long roomId,
			@Payload MessageDTO messageDTO) {
		roomRepository.findById(roomId)
				.orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
		System.out.println("Message received by server: " + messageDTO.getContent());
		messageDTO.setRoomId(roomId);
		messageDTO.setSenderUsername(ANONYMOUS_SENDER);
		if (messageDTO.getType() == null || messageDTO.getType().isBlank()) {
			messageDTO.setType(MessageType.CHAT.name());
		}
		MessageDTO saved = chatService.saveMessage(messageDTO);
		messagingTemplate.convertAndSend("/topic/room/" + roomId, saved);
	}

	@MessageMapping("/chat.join/{roomId}")
	public void join(
			@DestinationVariable Long roomId,
			@Payload MessageDTO messageDTO) {
		roomRepository.findById(roomId)
				.orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
		messageDTO.setRoomId(roomId);
		messageDTO.setSenderUsername(ANONYMOUS_SENDER);
		messageDTO.setType(MessageType.JOIN.name());
		if (messageDTO.getContent() == null || messageDTO.getContent().isBlank()) {
			messageDTO.setContent("a rejoint la salle");
		}
		MessageDTO saved = chatService.saveMessage(messageDTO);
		messagingTemplate.convertAndSend("/topic/room/" + roomId, saved);
	}
}
