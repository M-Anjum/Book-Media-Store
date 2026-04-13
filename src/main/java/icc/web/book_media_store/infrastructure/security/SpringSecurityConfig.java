package icc.web.book_media_store.infrastructure.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
                                .csrf(csrf -> csrf.disable())

                                // NOUVEAU : On dit à Spring de renvoyer du JSON au lieu d'une page HTML en cas d'erreur
                                .exceptionHandling(exc -> exc
                                        .authenticationEntryPoint((req, res, authException) -> {
                                                res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                                                res.setContentType("application/json");
                                                res.getWriter().write("{\"error\": \"Non autorisé. Veuillez vous connecter.\"}");
                                        })
                                        .accessDeniedHandler((req, res, accessDeniedException) -> {
                                                res.setStatus(HttpServletResponse.SC_FORBIDDEN);
                                                res.setContentType("application/json");
                                                res.getWriter().write("{\"error\": \"Accès refusé. Droits administrateur requis.\"}");
                                        })
                                )

                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                                .requestMatchers("/api/auth/**").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/user/register").permitAll()
                                                .requestMatchers("/error").permitAll()
                                                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                                                .requestMatchers(HttpMethod.GET,
                                                                "/api/blog/articles",
                                                                "/api/blog/articles/**",
                                                                "/api/blog/images/**",
                                                                "/api/products",
                                                                "/api/products/**",
                                                                "/api/books",
                                                                "/api/books/**",
                                                                "/api/computers",
                                                                "/api/computers/**",
                                                                "/api/hifi",
                                                                "/api/hifi/**")
                                                .permitAll()

                                                .requestMatchers(HttpMethod.POST,
                                                                "/api/blog/articles/*/comments",
                                                                "/api/blog/*/like",
                                                                "/api/blog/*/dislike")
                                                .authenticated()

                                                .requestMatchers("/api/rooms/**").permitAll()

                                                .requestMatchers("/api/**").authenticated()

                                                .anyRequest().permitAll())

                                .formLogin(form -> form
                                                .loginProcessingUrl("/api/auth/login")
                                                .successHandler((req, res, auth) -> {
                                                        res.setStatus(HttpServletResponse.SC_OK);
                                                        res.setContentType("application/json");
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