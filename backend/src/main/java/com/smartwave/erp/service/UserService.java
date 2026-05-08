package com.smartwave.erp.service;

import com.smartwave.erp.model.dto.UserDTO;
import com.smartwave.erp.model.entity.Role;
import com.smartwave.erp.model.entity.User;
import com.smartwave.erp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
     @Autowired
    private EmailService emailService;
    

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return UserDTO.fromEntity(user);
    }
    
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setFullName(userDTO.getFullName());
        user.setEmail(userDTO.getEmail());
        user.setRole(userDTO.getRole());
        user.setIsActive(userDTO.getIsActive());
        
        userRepository.save(user);
        return UserDTO.fromEntity(user);
    
    }
    

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        userRepository.delete(user);
    
    
    // public UserDTO changeUserRole(Long id, Role newRole) {
    //     User user = userRepository.findById(id)
    //             .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    //     user.setRole(newRole);
    //     userRepository.save(user);
    //     return UserDTO.fromEntity(user);
    // }
    
    // public UserDTO toggleUserStatus(Long id) {
    //     User user = userRepository.findById(id)
    //             .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    //     user.setIsActive(!user.getIsActive());
    //     userRepository.save(user);
    //     return UserDTO.fromEntity(user);
    // }
    // Prevent deletion of SUPER_ADMIN
        if (user.getRole() == Role.SUPER_ADMIN) {
            throw new RuntimeException("Cannot delete SUPER_ADMIN user");
        }
        
        userRepository.delete(user);
    }
    
    public UserDTO changeUserRole(Long id, Role newRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        // Prevent changing SUPER_ADMIN role
        if (user.getRole() == Role.SUPER_ADMIN && newRole != Role.SUPER_ADMIN) {
            throw new RuntimeException("Cannot change SUPER_ADMIN role");
        }
        
        // Prevent assigning SUPER_ADMIN via API
        if (newRole == Role.SUPER_ADMIN) {
            throw new RuntimeException("Cannot assign SUPER_ADMIN role via API");
        }
        
        user.setRole(newRole);
        userRepository.save(user);
        return UserDTO.fromEntity(user);
    }
    
    public UserDTO toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        // Prevent disabling SUPER_ADMIN
        if (user.getRole() == Role.SUPER_ADMIN) {
            throw new RuntimeException("Cannot disable SUPER_ADMIN user");
        }
        
        user.setIsActive(!user.getIsActive());
        userRepository.save(user);
        return UserDTO.fromEntity(user);
    }
}