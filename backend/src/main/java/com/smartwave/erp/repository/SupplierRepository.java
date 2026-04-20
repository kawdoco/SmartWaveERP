package com.smartwave.erp.repository;

import com.smartwave.erp.model.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    List<Supplier> findByStatus(String status);
    boolean existsByName(String name);
    boolean existsByNameIgnoreCase(String name);
}
