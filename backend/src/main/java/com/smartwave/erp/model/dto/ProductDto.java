package com.smartwave.erp.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * ProductDto — Parent level data transfer object.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;
    private String productName;
    private String category;
    private List<ProductVariantDto> variants;
}