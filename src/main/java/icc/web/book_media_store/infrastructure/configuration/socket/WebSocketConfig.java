package icc.web.book_media_store.infrastructure.configuration.socket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // C'est cette annotation qui crée le fameux 'SimpMessagingTemplate'
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Active un broker en mémoire pour renvoyer les messages au front
        // Les messages commençant par "/topic" seront diffusés à tous les abonnés
        config.enableSimpleBroker("/topic");

        // Préfixe pour les messages envoyés du Front vers le Back
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // L'URL que ton Front-end React utilisera pour se connecter
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns(
                        "http://localhost:3000",
                        "http://localhost:3001",
                        "http://localhost:3003")
                .withSockJS(); // Support pour les vieux navigateurs
    }
}