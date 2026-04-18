package com.smartwave.erp.controller.purchasing;

import com.smartwave.erp.model.dto.ApiResponse;
import com.smartwave.erp.model.dto.PurchaseOrderRequest;
import com.smartwave.erp.model.dto.PurchaseOrderResponse;
import com.smartwave.erp.service.ProcurementService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/procurement")
public class ProcurementController {
    
    private static final Logger logger = LoggerFactory.getLogger(ProcurementController.class);

    @Autowired
    private ProcurementService procurementService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PurchaseOrderResponse>>> getAll() {
        List<PurchaseOrderResponse> orders = procurementService.getAllPurchaseOrders();
        return ResponseEntity.ok(ApiResponse.<List<PurchaseOrderResponse>>builder()
                .success(true)
                .message("Purchase Orders retrieved successfully")
                .data(orders)
                .timestamp(LocalDateTime.now())
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PurchaseOrderResponse>> getById(@PathVariable Long id) {
        PurchaseOrderResponse order = procurementService.getPurchaseOrderById(id);
        return ResponseEntity.ok(ApiResponse.<PurchaseOrderResponse>builder()
                .success(true)
                .message("Purchase Order retrieved successfully")
                .data(order)
                .timestamp(LocalDateTime.now())
                .build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<PurchaseOrderResponse>> create(@RequestBody PurchaseOrderRequest request) {
        logger.info("Creating new Purchase Order for supplier: {}", request.getSupplierId());
        PurchaseOrderResponse created = procurementService.createPurchaseOrder(request);

        ApiResponse<PurchaseOrderResponse> response = ApiResponse.<PurchaseOrderResponse>builder()
                .success(true)
                .message("Purchase Order created successfully")
                .data(created)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(201).body(response);
    }

    /**
     * Update PO status (e.g. APPROVED, RECEIVED, CANCELLED)
     * If status is RECEIVED, stock levels will be updated automatically.
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<PurchaseOrderResponse>> updateStatus(
            @PathVariable Long id, 
            @RequestParam String status) {
        logger.info("Updating PO status for id: {} to: {}", id, status);
        try {
            PurchaseOrderResponse updated = procurementService.updateStatus(id, status);

            ApiResponse<PurchaseOrderResponse> response = ApiResponse.<PurchaseOrderResponse>builder()
                    .success(true)
                    .message("Purchase Order status updated to " + status)
                    .data(updated)
                    .timestamp(LocalDateTime.now())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.<PurchaseOrderResponse>builder()
                    .success(false)
                    .message(e.getMessage())
                    .timestamp(LocalDateTime.now())
                    .build());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        logger.info("Request to delete Purchase Order: {}", id);
        try {
            procurementService.deletePurchaseOrder(id);
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .success(true)
                    .message("Purchase Order deleted successfully")
                    .timestamp(LocalDateTime.now())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.<Void>builder()
                    .success(false)
                    .message(e.getMessage())
                    .timestamp(LocalDateTime.now())
                    .build());
        }
    }
}
