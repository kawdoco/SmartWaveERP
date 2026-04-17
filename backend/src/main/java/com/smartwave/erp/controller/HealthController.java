// package com.smartwave.erp.controller;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.time.LocalDateTime;
// import java.util.HashMap;
// import java.util.Map;

// @RestController
// @RequestMapping("/api")
// @CrossOrigin(origins = "http://localhost:3000")
// public class HealthController {
    
//     @GetMapping("/health")
//     public ResponseEntity<Map<String, Object>> healthCheck() {
//         Map<String, Object> response = new HashMap<>();
//         Map<String, Object> data = new HashMap<>();
        
//         response.put("success", true);
//         response.put("message", "Service is healthy");
        
//         data.put("status", "UP");
//         data.put("timestamp", LocalDateTime.now().toString());
//         data.put("service", "SmartWave ERP Backend");
//         data.put("version", "0.0.1-SNAPSHOT");
        
//         response.put("data", data);
//         response.put("timestamp", LocalDateTime.now().toString());
        
//         return ResponseEntity.ok(response);
//     }
// }
package com.smartwave.erp.controller;

import com.smartwave.erp.model.dto.ApiResponse;
import com.smartwave.erp.model.dto.HealthStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/health")
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