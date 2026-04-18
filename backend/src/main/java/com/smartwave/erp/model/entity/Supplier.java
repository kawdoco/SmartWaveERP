package com.smartwave.erp.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "suppliers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String contactPerson;
    private String phoneNumber;
    private String email;
    private String address;
    private String bankDetails;

    // Active, Inactive, etc.
    private String status = "ACTIVE";
}
