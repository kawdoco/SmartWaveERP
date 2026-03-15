package com.smartwave.erp.service;

import com.smartwave.erp.model.dto.ProductDto;
import com.smartwave.erp.model.entity.Product;
import com.smartwave.erp.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ProductDto createProduct(ProductDto productDto) {
        Product product = new Product(
                productDto.getName(),
                productDto.getSku(),
                productDto.getPrice(),
                productDto.getQuantity()
        );
        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    private ProductDto convertToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSku(product.getSku());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        return dto;
    }
}