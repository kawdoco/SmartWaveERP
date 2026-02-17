package com.smartwave.erp.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Health Status DTO
 * 
 * Contains information about the backend service health status.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthStatus {
    private String status;
    private LocalDateTime timestamp;
    private String service;
    private String version;
}
