package com.smartwave.erp.controller.purchasing;

import com.smartwave.erp.model.dto.ApiResponse;
import com.smartwave.erp.model.dto.SupplierDTO;
import com.smartwave.erp.service.SupplierService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {
 
    private static final Logger logger = LoggerFactory.getLogger(SupplierController.class);

    @Autowired
    private SupplierService supplierService;

    @GetMapping
    public List<SupplierDTO> getAll() {
        logger.info("Fetching all suppliers");
        return supplierService.getAllSuppliers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierDTO> getById(@PathVariable Long id) {
        logger.info("Fetching supplier with id: {}", id);
        return ResponseEntity.ok(supplierService.getSupplierById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<SupplierDTO>> create(@RequestBody SupplierDTO dto) {
        logger.info("Attempting to create supplier: {}", dto.getName());
        SupplierDTO created = supplierService.createSupplier(dto);
        
        ApiResponse<SupplierDTO> response = ApiResponse.<SupplierDTO>builder()
                .success(true)
                .message("Supplier created successfully")
                .data(created)
                .timestamp(LocalDateTime.now())
                .build();
                
        return ResponseEntity.status(201).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<SupplierDTO>> update(@PathVariable Long id, @RequestBody SupplierDTO dto) {
        logger.info("Updating supplier with id: {}", id);
        SupplierDTO updated = supplierService.updateSupplier(id, dto);

        ApiResponse<SupplierDTO> response = ApiResponse.<SupplierDTO>builder()
                .success(true)
                .message("Supplier updated successfully")
                .data(updated)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        logger.info("Deleting supplier with id: {}", id);
        supplierService.deleteSupplier(id);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Supplier deleted successfully")
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(response);
    }
}
