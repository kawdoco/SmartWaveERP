package com.smartwave.erp.service;

import com.smartwave.erp.model.dto.SupplierDTO;
import com.smartwave.erp.model.entity.Supplier;
import com.smartwave.erp.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    public List<SupplierDTO> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(SupplierDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public SupplierDTO getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        return SupplierDTO.fromEntity(supplier);
    }

    @Transactional
    public SupplierDTO createSupplier(SupplierDTO dto) {
        String trimmedName = dto.getName().trim();
        if (supplierRepository.existsByNameIgnoreCase(trimmedName)) {
            throw new RuntimeException("Supplier with name '" + trimmedName + "' already exists!");
        }
        
        Supplier supplier = new Supplier();
        supplier.setName(trimmedName);
        supplier.setContactPerson(dto.getContactPerson());
        supplier.setPhoneNumber(dto.getPhoneNumber());
        supplier.setEmail(dto.getEmail());
        supplier.setAddress(dto.getAddress());
        supplier.setBankDetails(dto.getBankDetails());
        supplier.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");

        return SupplierDTO.fromEntity(supplierRepository.save(supplier));
    }

    @Transactional
    public SupplierDTO updateSupplier(Long id, SupplierDTO dto) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        
        supplier.setName(dto.getName());
        supplier.setContactPerson(dto.getContactPerson());
        supplier.setPhoneNumber(dto.getPhoneNumber());
        supplier.setEmail(dto.getEmail());
        supplier.setAddress(dto.getAddress());
        supplier.setBankDetails(dto.getBankDetails());
        supplier.setStatus(dto.getStatus());

        return SupplierDTO.fromEntity(supplierRepository.save(supplier));
    }

    @Transactional
    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }
}
