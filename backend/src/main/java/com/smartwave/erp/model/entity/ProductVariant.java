package com.smartwave.erp.model.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ProductVariant — Represents a specific variation of a Product.
 * Holds stock levels, pricing, and physical attributes (Size, Color).
 */
@Entity
@Table(name = "product_variants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonBackReference
    private Product product;

    private String brand;

    @Column(unique = true, nullable = false)
    private String barcode;

    private String size;
    private String color;

    @Column(name = "purchase_price")
    private Double purchasePrice = 0.0;

    @Column(name = "selling_price")
    private Double sellingPrice = 0.0;

    private String status = "ACTIVE";

    private Integer quantity = 0;
}
