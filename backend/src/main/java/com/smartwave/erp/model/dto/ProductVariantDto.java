package com.smartwave.erp.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ProductVariantDto — Detailed variant attributes.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantDto {
    private Long id;
    private String productName; // Parent Model Name
    private String category;    // Parent Category
    private String brand;
    private String barcode;
    private String size;
    private String color;
    private Double purchasePrice;
    private Double sellingPrice;
    private String status;
    private Integer quantity;
}
