package icc.web.book_media_store.module.product.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "hifi")
@Data @EqualsAndHashCode(callSuper = true)
public class Hifi extends Product {
    private String model;
    private Integer powerWatts;

    public Hifi() {
        this.setType(ProductType.HIFI);
    }
}