package com.smartwave.erp.model.dto;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class SaleDto {
    private Long id;
    private LocalDateTime saleDate;
    private String cashierName;
    private Double subtotal;
    private Double discount;
    private Double totalAmount;
    private String paymentMethod;
    private List<SaleItemDto> items;

    @Data
    public static class SaleItemDto {
        private Long id;
        private Long variantId;
        private String productName;
        private Integer quantity;
        private Double unitPrice;
        private Double subtotal;
    }
}
