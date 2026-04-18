package com.smartwave.erp.model.dto;

import com.smartwave.erp.model.entity.PurchaseOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderRequest {
    private Long supplierId;
    private List<PurchaseOrderItemRequest> items;

    public static PurchaseOrderRequest fromEntity(PurchaseOrder po) {
        PurchaseOrderRequest req = new PurchaseOrderRequest();
        req.setSupplierId(po.getSupplier() != null ? po.getSupplier().getId() : null);
        if (po.getItems() != null) {
            req.setItems(po.getItems().stream()
                    .map(PurchaseOrderItemRequest::fromEntity)
                    .collect(Collectors.toList()));
        }
        return req;
    }
}