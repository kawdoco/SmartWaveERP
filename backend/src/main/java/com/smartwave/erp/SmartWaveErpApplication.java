package com.smartwave.erp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
/**
 * Main application class for SmartWave ERP Backend
 * 
 * SmartWave ERP is a barcode-based system designed for textile retailers
 * that streamlines purchasing, inventory, POS, and reporting operations.
 */
@SpringBootApplication
@ComponentScan(basePackages = "com.smartwave.erp")
public class SmartWaveErpApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartWaveErpApplication.class, args);
    }
}
