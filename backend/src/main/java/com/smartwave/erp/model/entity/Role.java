package com.smartwave.erp.model.entity;

public enum Role {
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