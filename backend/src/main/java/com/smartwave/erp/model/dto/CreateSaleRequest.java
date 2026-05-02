package com.smartwave.erp.model.dto;
import lombok.Data;
import java.util.List;

@Data
public class CreateSaleRequest {
    private Double discount;
    private String paymentMethod;
    private List<SaleItemRequest> items;

    @Data
    public static class SaleItemRequest {
        private Long variantId;
        private Integer quantity;
        private Double unitPrice;
    }
}
