package icc.web.book_media_store.module.user.service;

import icc.web.book_media_store.infrastructure.error.BusinessException;
import icc.web.book_media_store.infrastructure.error.ErrorCode;
import icc.web.book_media_store.module.user.dto.*;
import icc.web.book_media_store.module.user.dto.mapper.UserMapper;
import icc.web.book_media_store.module.user.model.User;
import icc.web.book_media_store.module.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

 
import java.io.IOException;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;
 
@Service
@RequiredArgsConstructor
public class UserServices {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper; // ← injecté automatiquement par Spring

    private static final Set<String> ALLOWED_TYPES = Set.of("image/gif", "image/jpeg");
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("gif", "jpg", "jpeg");

    public UserProfileResponse getProfile(String email) {
        return userMapper.toResponse(findByEmail(email));
    }

// ─── REGISTER ─────────────────────────────────────────────────────────────

    @Transactional
    public UserProfileResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }
        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        return userMapper.toResponse(userRepository.save(user));
    }

 // --- get profile ----
    @Transactional
    public UserProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = findByEmail(email);

        if (!user.getEmail().equals(request.email()) &&
                userRepository.existsByEmail(request.email())) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        userMapper.updateAppUser(request, user); // ← MapStruct fait le mapping
        return userMapper.toResponse(userRepository.save(user));
    }

    // ─── CHANGE PASSWORD ──────────────────────────────────────────────────────
 
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = findByEmail(email);
 
        // Verify the current password matches what is stored
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INCORRECT_PASSWORD);
        }
 
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
    }
 
    // ─── UPLOAD AVATAR ────────────────────────────────────────────────────────
 
    @Transactional
public String uploadAvatar(String email, MultipartFile file) {
    User user = findByEmail(email);

    String contentType = file.getContentType();
    String extension = getFileExtension(file.getOriginalFilename());

    if (contentType == null
            || !ALLOWED_TYPES.contains(contentType)
            || !ALLOWED_EXTENSIONS.contains(extension)) {
        throw new BusinessException(ErrorCode.INVALID_FILE_TYPE);
    }

    try {
        Path uploadPath = Paths.get("uploads/avatars");
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        String filename = UUID.randomUUID() + "." + extension;
        Files.copy(file.getInputStream(), uploadPath.resolve(filename));

        String avatarUrl = "/uploads/avatars/" + filename;
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);
        return avatarUrl;

    } catch (IOException e) {
        throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
    }
 
    // ─── HELPERS ──────────────────────────────────────────────────────────────

    private User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}