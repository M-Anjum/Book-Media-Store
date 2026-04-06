package icc.web.book_media_store.infrastructure.security;


import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SpringSecurityConfig {

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                return http
                                // Utilise la configuration définie dans WebConfig.java
                                .cors(Customizer.withDefaults())

                                // Désactivé pour faciliter le développement de l'API
                                .csrf(csrf -> csrf.disable())

                                // Règles d'accès minimales
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/auth/**").permitAll()
                                                .requestMatchers("/error").permitAll()
                                                .anyRequest().permitAll())

                                // Login silencieux (Statut 200 uniquement, pas de texte)
                                .formLogin(form -> form
                                                .loginProcessingUrl("/api/auth/login")
                                                .successHandler((req, res, auth) -> res
                                                                .setStatus(HttpServletResponse.SC_OK))
                                                .failureHandler((req, res, exc) -> {
                                                        res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                                                        res.setContentType("application/json");
                                                        res.getWriter().write(
                                                                        "{\"error\": \"Authentification echouee\"}");
                                                }))

                                // Logout propre
                                .logout(logout -> logout
                                                .logoutUrl("/api/auth/logout")
                                                .logoutSuccessHandler((req, res, auth) -> res
                                                                .setStatus(HttpServletResponse.SC_OK))
                                                .invalidateHttpSession(true)
                                                .deleteCookies("JSESSIONID"))
                                .build();
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                // BCrypt avec un facteur de force de 12
                return new BCryptPasswordEncoder(12);
        }
}