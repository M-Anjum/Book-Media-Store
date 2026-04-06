package icc.web.book_media_store.module.user.service;

import icc.web.book_media_store.infrastructure.error.BusinessException;
import icc.web.book_media_store.infrastructure.error.ErrorCode;
import icc.web.book_media_store.module.user.dto.AdminUpdateUserRequest;
import icc.web.book_media_store.module.user.dto.AdminUserResponse;
import icc.web.book_media_store.module.user.model.User;
import icc.web.book_media_store.module.user.model.role.Role;
import icc.web.book_media_store.module.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;

    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public AdminUserResponse getUserById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public AdminUserResponse updateUser(Long id, AdminUpdateUserRequest request) {
        User user = findById(id);
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setPhone(request.phone());
        user.setAddress(request.address());
        user.setPostalCode(request.postalCode());
        user.setRole(Role.valueOf(request.role()));
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        userRepository.deleteById(id);
    }

    private User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
    }

    private AdminUserResponse toResponse(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getUsername(),
                user.getEmail(),
                user.getBirthDate(),
                user.getAddress(),
                user.getPostalCode(),
                user.getPhone(),
                user.getAvatarUrl(),
                user.getRole().name(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}