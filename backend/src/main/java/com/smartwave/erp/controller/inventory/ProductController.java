package com.smartwave.erp.controller.inventory;

import com.smartwave.erp.model.dto.ProductDto;
import com.smartwave.erp.model.dto.ProductVariantDto;
import com.smartwave.erp.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ProductController — Managed under /api/inventory/products
 */
@RestController
@RequestMapping("/api/inventory/products")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto dto) {
        return ResponseEntity.ok(productService.createProduct(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id, @RequestBody ProductDto dto) {
        return ResponseEntity.ok(productService.updateProduct(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // --- VARIANT MANAGEMENT ---

    @PostMapping("/{id}/variants")
    public ResponseEntity<ProductVariantDto> addVariant(
            @PathVariable Long id, 
            @RequestBody ProductVariantDto vDto) {
        return ResponseEntity.ok(productService.addVariant(id, vDto));
    }

    @GetMapping("/variants/barcode/{barcode}")
    public ResponseEntity<ProductVariantDto> getVariantByBarcode(@PathVariable String barcode) {
        return ResponseEntity.ok(productService.getVariantByBarcode(barcode));
    }

    @GetMapping("/variants/{variantId}")
    public ResponseEntity<ProductVariantDto> getVariantById(@PathVariable Long variantId) {
        return ResponseEntity.ok(productService.getVariantById(variantId));
    }

    @PutMapping("/variants/{variantId}")
    public ResponseEntity<ProductVariantDto> updateVariant(@PathVariable Long variantId, @RequestBody ProductVariantDto vDto) {
        return ResponseEntity.ok(productService.updateVariant(variantId, vDto));
    }

    @DeleteMapping("/variants/{variantId}")
    public ResponseEntity<Void> deleteVariant(@PathVariable Long variantId) {
        productService.deleteVariant(variantId);
        return ResponseEntity.noContent().build();
    }
}