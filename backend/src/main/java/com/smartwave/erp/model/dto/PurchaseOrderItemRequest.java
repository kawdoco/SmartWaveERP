package com.smartwave.erp.model.dto;

import com.smartwave.erp.model.entity.PurchaseOrderItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderItemRequest {
    private Long variantId;
    private Integer quantity;
    private Double unitPrice;

    public static PurchaseOrderItemRequest fromEntity(PurchaseOrderItem item) {
        PurchaseOrderItemRequest req = new PurchaseOrderItemRequest();
        req.setVariantId(item.getVariant() != null ? item.getVariant().getId() : null);
        req.setQuantity(item.getQuantity());
        req.setUnitPrice(item.getUnitPrice());
        return req;
    }
}
