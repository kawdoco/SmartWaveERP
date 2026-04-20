package com.smartwave.erp.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/test")
public class SecurityTestController {

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> details = new HashMap<>();
        
        if (auth != null) {
            details.put("username", auth.getName());
            details.put("authorities", auth.getAuthorities().stream()
                    .map(a -> a.getAuthority())
                    .collect(Collectors.toList()));
            details.put("isAuthenticated", auth.isAuthenticated());
        } else {
            details.put("error", "No authentication found in context");
        }
        
        return details;
    }
}
