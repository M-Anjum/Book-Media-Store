package icc.web.book_media_store.module.category.mapper;

import org.mapstruct.Mapper;

import icc.web.book_media_store.module.category.dto.CategoryDTO;
import icc.web.book_media_store.module.category.model.Category;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryDTO toDTO(Category category);
    Category toEntity(CategoryDTO categoryDTO);
}
