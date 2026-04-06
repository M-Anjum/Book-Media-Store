package icc.web.book_media_store.module.product.dto;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class HifiUpdateDTO extends ProductUpdateDTO {
    private String model;
    private Integer powerWatts;
}