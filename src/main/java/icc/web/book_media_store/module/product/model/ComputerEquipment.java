package icc.web.book_media_store.module.product.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "computer_equipment")
@Data @EqualsAndHashCode(callSuper = true)
public class ComputerEquipment extends Product {
    private String brand;
    private String processor;
    private Integer ramSize;

    public ComputerEquipment() {
        this.setType(ProductType.MATERIEL_INFORMATIQUE);
    }
}