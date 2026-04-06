package icc.web.book_media_store.module.user.repository;
 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import icc.web.book_media_store.module.user.model.User;

import java.util.Optional;
 
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
 
    Optional<User> findByEmail(String email);
 
    boolean existsByEmail(String email);
}
