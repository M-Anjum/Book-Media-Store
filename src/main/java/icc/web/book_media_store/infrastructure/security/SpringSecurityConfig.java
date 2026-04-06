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
                                .cors(Customizer.withDefaults())
                                .csrf(csrf -> csrf.disable()) // Désactivé pour le dev API, à sécuriser en prod

                                .authorizeHttpRequests(auth -> auth
                                                // Accès public
                                                .requestMatchers("/api/auth/**", "/error").permitAll()

                                                // Accès Admin uniquement (Double sécurité avec le @PreAuthorize du
                                                // Controller)
                                                .requestMatchers("/api/orders/admin/**").hasRole("ADMIN")

                                                // Root User : Toute autre requête aux API nécessite d'être connecté
                                                .anyRequest().authenticated())

                                .formLogin(form -> form
                                                .loginProcessingUrl("/api/auth/login")
                                                .successHandler((req, res, auth) -> {
                                                        res.setStatus(HttpServletResponse.SC_OK);
                                                        res.setContentType("application/json");
                                                        // PRO TIP : On renvoie un petit JSON pour dire au Front que
                                                        // c'est ok
                                                        res.getWriter().write(
                                                                        "{\"message\": \"Connexion réussie\", \"user\": \""
                                                                                        + auth.getName() + "\"}");
                                                })
                                                .failureHandler((req, res, exc) -> {
                                                        res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                                                        res.setContentType("application/json");
                                                        res.getWriter().write(
                                                                        "{\"error\": \"Identifiants invalides\"}");
                                                }))

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
                return new BCryptPasswordEncoder(12);
        }
}