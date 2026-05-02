package com.smartwave.erp.service;

import com.smartwave.erp.model.dto.ProductDto;
import com.smartwave.erp.model.dto.ProductVariantDto;
import com.smartwave.erp.model.entity.Product;
import com.smartwave.erp.model.entity.ProductVariant;
import com.smartwave.erp.repository.ProductRepository;
import com.smartwave.erp.repository.ProductVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * ProductService — Handles hierarchical inventory with variant-level barcodes.
 */
@Service
@Transactional
@SuppressWarnings("null")
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;

    @Autowired
    public ProductService(ProductRepository productRepository, ProductVariantRepository variantRepository) {
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
    }

    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return convertToDto(product);
    }

    @Transactional
    public ProductDto createProduct(ProductDto dto) {
        Product product = new Product();
        product.setProductName(dto.getProductName());
        product.setCategory(dto.getCategory());

        // Handle initial variants if provided
        if (dto.getVariants() != null) {
            for (ProductVariantDto vDto : dto.getVariants()) {
                ProductVariant variant = new ProductVariant();
                mapVariantDtoToEntity(vDto, variant);
                product.addVariant(variant);
            }
        }

        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        product.setProductName(dto.getProductName());
        product.setCategory(dto.getCategory());

        return convertToDto(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete: Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    @Transactional
    public void bulkUpload(org.springframework.web.multipart.MultipartFile file) {
        try (java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isFirstLine = true;
            while ((line = reader.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue; // skip header
                }
                String[] data = line.split(",");
                if (data.length < 10) continue;
                
                String productName = data[0].trim();
                String category = data[1].trim();
                String barcode = data[2].trim();
                String brand = data[3].trim();
                String size = data[4].trim();
                String color = data[5].trim();
                Double purchasePrice = Double.parseDouble(data[6].trim());
                Double sellingPrice = Double.parseDouble(data[7].trim());
                Integer quantity = Integer.parseInt(data[8].trim());
                String status = data[9].trim();
                
                // Find or create product
                Product product = productRepository.findByProductNameAndCategory(productName, category)
                        .orElseGet(() -> {
                            Product newProduct = new Product();
                            newProduct.setProductName(productName);
                            newProduct.setCategory(category);
                            return productRepository.save(newProduct);
                        });
                
                // Check if variant barcode already exists
                if (variantRepository.findByBarcode(barcode).isPresent()) {
                    continue; // Skip existing barcodes
                }
                
                ProductVariant variant = new ProductVariant();
                variant.setBarcode(barcode);
                variant.setBrand(brand);
                variant.setSize(size);
                variant.setColor(color);
                variant.setPurchasePrice(purchasePrice);
                variant.setSellingPrice(sellingPrice);
                variant.setQuantity(quantity);
                variant.setStatus(status);
                
                product.addVariant(variant);
                variantRepository.save(variant);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to process CSV file: " + e.getMessage());
        }
    }

    // --- VARIANT MANAGEMENT ---

    @Transactional
    public ProductVariantDto addVariant(Long productId, ProductVariantDto vDto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Parent product not found"));
        
        ProductVariant variant = new ProductVariant();
        mapVariantDtoToEntity(vDto, variant);
        product.addVariant(variant);
        
        ProductVariant saved = variantRepository.save(variant);
        return convertVariantToDto(saved);
    }

    public ProductVariantDto getVariantByBarcode(String barcode) {
        ProductVariant variant = variantRepository.findByBarcode(barcode)
                .orElseThrow(() -> new RuntimeException("Varient not found for barcode: " + barcode));
        return convertVariantToDto(variant);
    }

    public ProductVariantDto getVariantById(Long variantId) {
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Varient not found with id: " + variantId));
        return convertVariantToDto(variant);
    }

    @Transactional
    public ProductVariantDto updateVariant(Long variantId, ProductVariantDto vDto) {
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Varient not found for update with id: " + variantId));
        
        mapVariantDtoToEntity(vDto, variant);
        ProductVariant saved = variantRepository.save(variant);
        return convertVariantToDto(saved);
    }

    @Transactional
    public void deleteVariant(Long variantId) {
        if (!variantRepository.existsById(variantId)) {
            throw new RuntimeException("Cannot delete: Varient not found with id: " + variantId);
        }
        variantRepository.deleteById(variantId);
    }

    // --- MAPPERS ---

    private void mapVariantDtoToEntity(ProductVariantDto dto, ProductVariant entity) {
        entity.setBrand(dto.getBrand());
        entity.setBarcode(dto.getBarcode()); // Barcode is now at Variant level
        entity.setSize(dto.getSize());
        entity.setColor(dto.getColor());
        entity.setPurchasePrice(dto.getPurchasePrice());
        entity.setSellingPrice(dto.getSellingPrice());
        entity.setQuantity(dto.getQuantity() != null ? dto.getQuantity() : 0);
        if (dto.getStatus() != null) {
            entity.setStatus(dto.getStatus());
        }
    }

    private ProductDto convertToDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .productName(product.getProductName())
                .category(product.getCategory())
                .variants(product.getVariants().stream()
                        .map(this::convertVariantToDto)
                        .collect(Collectors.toList()))
                .build();
    }

    private ProductVariantDto convertVariantToDto(ProductVariant v) {
        return ProductVariantDto.builder()
                .id(v.getId())
                .productName(v.getProduct() != null ? v.getProduct().getProductName() : null)
                .category(v.getProduct() != null ? v.getProduct().getCategory() : null)
                .brand(v.getBrand())
                .barcode(v.getBarcode())
                .size(v.getSize())
                .color(v.getColor())
                .purchasePrice(v.getPurchasePrice())
                .sellingPrice(v.getSellingPrice())
                .status(v.getStatus())
                .quantity(v.getQuantity())
                .build();
    }
}