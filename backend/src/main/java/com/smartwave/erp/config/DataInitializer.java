package com.smartwave.erp.config;

import com.smartwave.erp.model.entity.Role;
import com.smartwave.erp.model.entity.User;
import com.smartwave.erp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== Initializing Database with Default Users ===");
        
        // Create SUPER_ADMIN if not exists
        if (!userRepository.existsByUsername("superadmin")) {
            User superAdmin = new User();
            superAdmin.setUsername("superadmin");
            superAdmin.setEmail("superadmin@smartwave.com");
            superAdmin.setPassword(passwordEncoder.encode("SuperAdmin@123"));
            superAdmin.setFullName("Super Administrator");
            superAdmin.setRole(Role.SUPER_ADMIN);
            superAdmin.setIsActive(true);
            superAdmin.setEmailVerified(true);
            userRepository.save(superAdmin);
            System.out.println("✅ SUPER_ADMIN user created!");
            System.out.println("   Username: superadmin");
            System.out.println("   Password: SuperAdmin@123");
            System.out.println("   ⚠️  This user cannot be deleted or modified via API");
        } else {
            System.out.println("ℹ️  SUPER_ADMIN user already exists");
        }
        
        // Create Admin if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@smartwave.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("System Administrator");
            admin.setRole(Role.ADMIN);
            admin.setIsActive(true);
            admin.setEmailVerified(true);
            userRepository.save(admin);
            System.out.println("✅ Admin user created!");
            System.out.println("   Username: admin");
            System.out.println("   Password: admin123");
        } else {
            System.out.println("ℹ️  Admin user already exists");
        }
        
        // Create Manager if not exists
        if (!userRepository.existsByUsername("manager")) {
            User manager = new User();
            manager.setUsername("manager");
            manager.setEmail("manager@smartwave.com");
            manager.setPassword(passwordEncoder.encode("manager123"));
            manager.setFullName("Store Manager");
            manager.setRole(Role.MANAGER);
            manager.setIsActive(true);
            manager.setEmailVerified(true);
            userRepository.save(manager);
            System.out.println("✅ Manager user created!");
            System.out.println("   Username: manager");
            System.out.println("   Password: manager123");
        } else {
            System.out.println("ℹ️  Manager user already exists");
        }
        
        // Create Cashier if not exists
        if (!userRepository.existsByUsername("cashier")) {
            User cashier = new User();
            cashier.setUsername("cashier");
            cashier.setEmail("cashier@smartwave.com");
            cashier.setPassword(passwordEncoder.encode("cashier123"));
            cashier.setFullName("Cashier User");
            cashier.setRole(Role.CASHIER);
            cashier.setIsActive(true);
            cashier.setEmailVerified(true);
            userRepository.save(cashier);
            System.out.println("✅ Cashier user created!");
            System.out.println("   Username: cashier");
            System.out.println("   Password: cashier123");
        } else {
            System.out.println("ℹ️  Cashier user already exists");
        }
        
        // Create Inventory Clerk if not exists
        if (!userRepository.existsByUsername("inventory")) {
            User inventory = new User();
            inventory.setUsername("inventory");
            inventory.setEmail("inventory@smartwave.com");
            inventory.setPassword(passwordEncoder.encode("inventory123"));
            inventory.setFullName("Inventory Clerk");
            inventory.setRole(Role.INVENTORY_CLERK);
            inventory.setIsActive(true);
            inventory.setEmailVerified(true);
            userRepository.save(inventory);
            System.out.println("✅ Inventory Clerk user created!");
            System.out.println("   Username: inventory");
            System.out.println("   Password: inventory123");
        } else {
            System.out.println("ℹ️  Inventory Clerk user already exists");
        }
        
        System.out.println("=== Database Initialization Complete ===");
        System.out.println("");
        System.out.println("📋 Default Users Summary:");
        System.out.println("┌─────────────────┬────────────────────────┬──────────────┐");
        System.out.println("│ Username        │ Password                │ Role         │");
        System.out.println("├─────────────────┼────────────────────────┼──────────────┤");
        System.out.println("│ superadmin      │ SuperAdmin@123          │ SUPER_ADMIN  │");
        System.out.println("│ admin           │ admin123                │ ADMIN        │");
        System.out.println("│ manager         │ manager123              │ MANAGER      │");
        System.out.println("│ cashier         │ cashier123              │ CASHIER      │");
        System.out.println("│ inventory       │ inventory123            │ INVENTORY_*  │");
        System.out.println("└─────────────────┴────────────────────────┴──────────────┘");
    }
}