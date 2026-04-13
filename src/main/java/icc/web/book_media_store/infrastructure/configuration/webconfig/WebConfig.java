package icc.web.book_media_store.infrastructure.configuration.webconfig;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class WebConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Autorise ton frontend Vite sur les ports 3000, 3001 et 3003
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:3000",
                "http://localhost:3001",
                "http://localhost:3003"));

        // Autorise les méthodes HTTP nécessaires pour ton Shop et Blog (PATCH = toggle statut, etc.)
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // Autorise les headers pour le JSON et l'authentification
        config.setAllowedHeaders(List.of("Content-Type", "Authorization", "X-Requested-With"));

        // Autorise l'envoi des cookies (important pour rester connecté sans message
        // intrusif)
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}