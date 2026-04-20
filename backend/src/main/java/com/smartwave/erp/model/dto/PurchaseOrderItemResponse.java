package com.smartwave.erp.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderItemResponse {
    private Long id;
    private Long variantId;
    private String productName;
    private String variantDetails; // e.g. "Brand - Color - Size"
    private Integer quantity;
    private Double unitPrice;
    private Double subtotal;

    public static PurchaseOrderItemResponse fromEntity(com.smartwave.erp.model.entity.PurchaseOrderItem item) {
        PurchaseOrderItemResponse resp = new PurchaseOrderItemResponse();
        resp.setId(item.getId());
        resp.setVariantId(item.getVariant().getId());
        resp.setProductName(item.getVariant().getProduct().getProductName());
        
        String details = item.getVariant().getBrand() + " - " + 
                         item.getVariant().getColor() + " - " + 
                         item.getVariant().getSize();
        resp.setVariantDetails(details);
        
        resp.setQuantity(item.getQuantity());
        resp.setUnitPrice(item.getUnitPrice());
        resp.setSubtotal(item.getSubtotal());
        return resp;
    }
}
