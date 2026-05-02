package com.smartwave.erp.service;

import com.smartwave.erp.model.dto.CreateSaleRequest;
import com.smartwave.erp.model.dto.SaleDto;
import com.smartwave.erp.model.entity.ProductVariant;
import com.smartwave.erp.model.entity.Sale;
import com.smartwave.erp.model.entity.SaleItem;
import com.smartwave.erp.model.entity.User;
import com.smartwave.erp.repository.ProductVariantRepository;
import com.smartwave.erp.repository.SaleRepository;
import com.smartwave.erp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@Transactional
public class PosService {
    @Autowired private SaleRepository saleRepository;
    @Autowired private ProductVariantRepository variantRepository;
    @Autowired private UserRepository userRepository;

    public SaleDto processSale(CreateSaleRequest request, String username) {
        User cashier = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Cashier not found"));

        Sale sale = new Sale();
        sale.setSaleDate(LocalDateTime.now());
        sale.setCashier(cashier);
        sale.setDiscount(request.getDiscount() != null ? request.getDiscount() : 0.0);
        sale.setPaymentMethod(request.getPaymentMethod());

        double subtotal = 0.0;

        for (CreateSaleRequest.SaleItemRequest itemReq : request.getItems()) {
            ProductVariant variant = variantRepository.findById(itemReq.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant not found: " + itemReq.getVariantId()));

            if (variant.getQuantity() < itemReq.getQuantity()) {
                throw new RuntimeException("Insufficient stock for variant: " + variant.getBarcode());
            }

            // Deduct stock
            variant.setQuantity(variant.getQuantity() - itemReq.getQuantity());
            variantRepository.save(variant);

            SaleItem saleItem = new SaleItem();
            saleItem.setVariant(variant);
            saleItem.setQuantity(itemReq.getQuantity());
            saleItem.setUnitPrice(itemReq.getUnitPrice());
            saleItem.setSubtotal(itemReq.getQuantity() * itemReq.getUnitPrice());

            subtotal += saleItem.getSubtotal();
            sale.addItem(saleItem);
        }

        sale.setSubtotal(subtotal);
        sale.setTotalAmount(Math.max(0, subtotal - sale.getDiscount()));

        Sale savedSale = saleRepository.save(sale);
        return mapToDto(savedSale);
    }

    public java.util.List<SaleDto> getAllSales() {
        return saleRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private SaleDto mapToDto(Sale sale) {
        SaleDto dto = new SaleDto();
        dto.setId(sale.getId());
        dto.setSaleDate(sale.getSaleDate());
        dto.setCashierName(sale.getCashier().getFullName());
        dto.setSubtotal(sale.getSubtotal());
        dto.setDiscount(sale.getDiscount());
        dto.setTotalAmount(sale.getTotalAmount());
        dto.setPaymentMethod(sale.getPaymentMethod());

        dto.setItems(sale.getItems().stream().map(item -> {
            SaleDto.SaleItemDto itemDto = new SaleDto.SaleItemDto();
            itemDto.setId(item.getId());
            itemDto.setVariantId(item.getVariant().getId());
            if (item.getVariant().getProduct() != null) {
                itemDto.setProductName(item.getVariant().getProduct().getProductName());
            }
            itemDto.setQuantity(item.getQuantity());
            itemDto.setUnitPrice(item.getUnitPrice());
            itemDto.setSubtotal(item.getSubtotal());
            return itemDto;
        }).collect(Collectors.toList()));

        return dto;
    }
}
