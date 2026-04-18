package com.smartwave.erp.service;

import com.smartwave.erp.model.dto.PurchaseOrderRequest;
import com.smartwave.erp.model.dto.PurchaseOrderResponse;
import com.smartwave.erp.model.entity.*;
import com.smartwave.erp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * ProcurementService — Refactored to support Product Variants.
 */
@Service
@SuppressWarnings("null")
public class ProcurementService {

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductVariantRepository variantRepository;

    @Transactional(readOnly = true)
    public List<PurchaseOrderResponse> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAllByOrderByPoDateDesc().stream()
                .map(PurchaseOrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PurchaseOrderResponse getPurchaseOrderById(Long id) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase Order not found"));
        return PurchaseOrderResponse.fromEntity(po);
    }

    @Transactional
    public PurchaseOrderResponse createPurchaseOrder(PurchaseOrderRequest request) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        PurchaseOrder po = new PurchaseOrder();
        po.setSupplier(supplier);
        po.setCreatedBy(currentUser);
        po.setPoDate(LocalDateTime.now());
        po.setStatus("DRAFT"); 

        double totalAmount = 0.0;

        for (var itemReq : request.getItems()) {
            ProductVariant variant = variantRepository.findById(itemReq.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Product Variant not found: " + itemReq.getVariantId()));

            PurchaseOrderItem item = new PurchaseOrderItem();
            item.setPurchaseOrder(po);
            item.setVariant(variant);
            item.setQuantity(itemReq.getQuantity());
            item.setUnitPrice(itemReq.getUnitPrice());
            
            double subtotal = itemReq.getQuantity() * itemReq.getUnitPrice();
            item.setSubtotal(subtotal);
            totalAmount += subtotal;

            po.getItems().add(item);
        }

        po.setTotalAmount(totalAmount);
        PurchaseOrder savedPo = purchaseOrderRepository.save(po);
        return PurchaseOrderResponse.fromEntity(savedPo);
    }

    @Transactional
    public PurchaseOrderResponse updateStatus(Long id, String status) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase Order not found"));

        String currentStatus = po.getStatus();
        String targetStatus = status.toUpperCase();
        
        if (targetStatus.equals("APPROVED")) {
            if (!currentStatus.equals("DRAFT")) {
                throw new RuntimeException("Only DRAFT orders can be APPROVED.");
            }
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userRepository.findByUsername(username).orElse(null);
            po.setApprovedBy(currentUser);
        }
        
        else if (targetStatus.equals("RECEIVED")) {
            if (!currentStatus.equals("APPROVED")) {
                throw new RuntimeException("Purchase Order must be APPROVED before it can be RECEIVED.");
            }
            increaseStock(po);
        }
        
        else if (targetStatus.equals("DRAFT")) {
            if (!currentStatus.equals("CANCELLED")) {
                throw new RuntimeException("Only CANCELLED orders can be reverted to DRAFT.");
            }
        }
        
        else if (targetStatus.equals("CANCELLED")) {
            if (currentStatus.equals("RECEIVED")) {
                throw new RuntimeException("Cannot CANCEL an order that has already been RECEIVED.");
            }
        }

        po.setStatus(targetStatus);
        PurchaseOrder updatedPo = purchaseOrderRepository.save(po);
        return PurchaseOrderResponse.fromEntity(updatedPo);
    }

    @Transactional
    public void deletePurchaseOrder(Long id) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase Order not found"));
        
        if (!"CANCELLED".equals(po.getStatus())) {
            throw new RuntimeException("Deletion Forbidden: Only CANCELLED purchase orders can be deleted.");
        }
        
        purchaseOrderRepository.delete(po);
    }

    private void increaseStock(PurchaseOrder po) {
        for (PurchaseOrderItem item : po.getItems()) {
            ProductVariant variant = item.getVariant();
            int newQty = variant.getQuantity() + item.getQuantity();
            variant.setQuantity(newQty);
            variantRepository.save(variant);
        }
    }
}
