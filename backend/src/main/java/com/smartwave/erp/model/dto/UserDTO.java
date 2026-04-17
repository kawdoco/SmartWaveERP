package com.smartwave.erp.model.dto;

import lombok.Data;
import com.smartwave.erp.model.entity.Role;
import com.smartwave.erp.model.entity.User;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private Role role;
    private Boolean isActive;
    
    public static UserDTO fromEntity(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole());
        dto.setIsActive(user.getIsActive());
        return dto;
    }
}