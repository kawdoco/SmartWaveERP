package com.smartwave.erp.model.entity;

public enum Role {
    SUPER_ADMIN("Super Administrator - Full system access, cannot be deleted"),
    ADMIN("Administrator - Full system access"),
    MANAGER("Manager - Access to reports and approvals"),
    CASHIER("Cashier - POS operations only"),
    INVENTORY_CLERK("Inventory Clerk - Stock management");
    
    private final String description;
    
    Role(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}