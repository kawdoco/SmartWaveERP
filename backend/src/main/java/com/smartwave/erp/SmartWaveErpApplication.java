package com.smartwave.erp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class for SmartWave ERP Backend
 * 
 * SmartWave ERP is a barcode-based system designed for textile retailers
 * that streamlines purchasing, inventory, POS, and reporting operations.
 */
@SpringBootApplication
public class SmartWaveErpApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartWaveErpApplication.class, args);
    }
}
