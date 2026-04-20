package com.smartwave.erp.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.smartwave.erp.model.entity.Supplier;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierDTO {
    private Long id;
    private String name;
    private String contactPerson;
    private String phoneNumber;
    private String email;
    private String address;
    private String bankDetails;
    private String status;

    public static SupplierDTO fromEntity(Supplier supplier) {
        SupplierDTO supplierDTO = new SupplierDTO();
        supplierDTO.setId(supplier.getId());
        supplierDTO.setName(supplier.getName());
        supplierDTO.setContactPerson(supplier.getContactPerson());
        supplierDTO.setPhoneNumber(supplier.getPhoneNumber());
        supplierDTO.setEmail(supplier.getEmail());
        supplierDTO.setAddress(supplier.getAddress());
        supplierDTO.setBankDetails(supplier.getBankDetails());
        supplierDTO.setStatus(supplier.getStatus());
        return supplierDTO;
    }
}
