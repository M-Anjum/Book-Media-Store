package icc.web.book_media_store.module.product.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ComputerCreateDTO extends ProductCreateDTO {
    private String brand;
    private String processor;
    private Integer ramSize;
}