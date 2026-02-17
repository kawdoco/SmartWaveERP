package com.smartwave.erp.controller;

import com.smartwave.erp.model.dto.ApiResponse;
import com.smartwave.erp.model.dto.HealthStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

/**
 * Health Check Controller
 * 
 * Provides basic health check endpoint for monitoring
 * backend service availability.
 */
@RestController
@RequestMapping("/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<HealthStatus>> checkHealth() {
        HealthStatus health = HealthStatus.builder()
                .status("UP")
                .timestamp(LocalDateTime.now())
                .service("SmartWave ERP Backend")
                .version("0.0.1-SNAPSHOT")
                .build();
        
        ApiResponse<HealthStatus> response = ApiResponse.<HealthStatus>builder()
                .success(true)
                .message("Service is healthy")
                .data(health)
                .timestamp(LocalDateTime.now())
                .build();
        
        return ResponseEntity.ok(response);
    }
}
