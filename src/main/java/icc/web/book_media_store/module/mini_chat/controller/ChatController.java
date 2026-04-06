package icc.web.book_media_store.module.mini_chat.controller;

import icc.web.book_media_store.module.mini_chat.dto.MessageDTO;
import icc.web.book_media_store.module.mini_chat.model.MessageType;
import icc.web.book_media_store.module.mini_chat.service.ChatService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

	private final SimpMessagingTemplate messagingTemplate;
	private final ChatService chatService;

	public ChatController(SimpMessagingTemplate messagingTemplate, ChatService chatService) {
		this.messagingTemplate = messagingTemplate;
		this.chatService = chatService;
	}

	@MessageMapping("/chat.send/{roomId}")
	public void sendMessage(@DestinationVariable Long roomId, @Payload MessageDTO message) {
		message.setRoomId(roomId);
		if (message.getType() == null || message.getType().isBlank()) {
			message.setType(MessageType.CHAT.name());
		}
		MessageDTO saved = chatService.saveMessage(message);
		messagingTemplate.convertAndSend("/topic/room/" + roomId, saved);
	}

	@MessageMapping("/chat.join/{roomId}")
	public void join(@DestinationVariable Long roomId, @Payload MessageDTO message) {
		message.setRoomId(roomId);
		message.setType(MessageType.JOIN.name());
		if (message.getContent() == null || message.getContent().isBlank()) {
			message.setContent("a rejoint la salle");
		}
		MessageDTO saved = chatService.saveMessage(message);
		messagingTemplate.convertAndSend("/topic/room/" + roomId, saved);
	}
}
