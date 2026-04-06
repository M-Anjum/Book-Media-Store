package icc.web.book_media_store.module.product.dto;
import icc.web.book_media_store.module.product.enums.BookCategory;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class BookUpdateDTO extends ProductUpdateDTO {
    private String author;
    private Integer pageCount;
    private BookCategory category;
}