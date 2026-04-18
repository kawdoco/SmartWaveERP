package com.smartwave.erp.controller;

import com.smartwave.erp.model.dto.AuthRequest;
import com.smartwave.erp.model.dto.AuthResponse;
import com.smartwave.erp.model.dto.RegisterRequest;
import com.smartwave.erp.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.authenticate(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(response);
    }
}