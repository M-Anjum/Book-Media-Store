package icc.web.book_media_store.module.user.dto.mapper;

import icc.web.book_media_store.module.user.dto.UserProfileResponse;
import icc.web.book_media_store.module.user.dto.UpdateProfileRequest;
import icc.web.book_media_store.module.user.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // AppUser → UserProfileResponse
    @Mapping(target = "role", expression = "java(user.getRole().name())")
    UserProfileResponse toResponse(User user);

    // UpdateProfileRequest → AppUser (pour la mise à jour)
    // On ignore les champs gérés par Hibernate ou la sécurité
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "avatarUrl", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateAppUser(UpdateProfileRequest request, @MappingTarget User user);
}
