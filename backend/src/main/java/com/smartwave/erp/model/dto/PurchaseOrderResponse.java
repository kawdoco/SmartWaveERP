package com.smartwave.erp.model.dto;

import com.smartwave.erp.model.entity.PurchaseOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderResponse {
    private Long id;
    private String supplierName;
    private String createdByFullName;
    private String approvedByFullName;
    private LocalDateTime poDate;
    private String status;
    private Double totalAmount;
    private List<PurchaseOrderItemResponse> items;

    public static PurchaseOrderResponse fromEntity(PurchaseOrder po) {
        PurchaseOrderResponse resp = new PurchaseOrderResponse();
        resp.setId(po.getId());
        resp.setSupplierName(po.getSupplier().getName());
        resp.setCreatedByFullName(po.getCreatedBy() != null ? po.getCreatedBy().getFullName() : "System");
        resp.setApprovedByFullName(po.getApprovedBy() != null ? po.getApprovedBy().getFullName() : null);
        resp.setPoDate(po.getPoDate());
        resp.setStatus(po.getStatus());
        resp.setTotalAmount(po.getTotalAmount());
        
        if (po.getItems() != null) {
            resp.setItems(po.getItems().stream()
                    .map(PurchaseOrderItemResponse::fromEntity)
                    .collect(Collectors.toList()));
        }
        
        return resp;
    }
}
