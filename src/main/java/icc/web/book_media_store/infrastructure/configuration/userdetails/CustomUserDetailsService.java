package icc.web.book_media_store.infrastructure.configuration.userdetails;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.List;

public class CustomUserDetailsService implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // On simule une base de données avec un utilisateur en dur
        // Password = "password" encodé en BCrypt (indispensable pour ton setup)
        String hardcodedPassword = new BCryptPasswordEncoder().encode("password");

        if ("admin".equals(username)) {
            return new User(
                    "admin",
                    hardcodedPassword,
                    List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
        }

        if ("user".equals(username)) {
            return new User(
                    "user",
                    hardcodedPassword,
                    List.of(new SimpleGrantedAuthority("ROLE_UM")));
        }

        // Si ce n'est ni admin ni user, on bloque
        throw new UsernameNotFoundException("Utilisateur inconnu pour le hackathon : " + username);
    }
}