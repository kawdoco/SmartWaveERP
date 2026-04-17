package com.smartwave.erp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {
    
    @GetMapping("/")
    public Map<String, String> home() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "SmartWave ERP Backend is running!");
        response.put("status", "UP");
        return response;
    }
    
    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Service is healthy");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }
}