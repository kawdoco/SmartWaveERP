package com.smartwave.erp.controller.pos;

import com.smartwave.erp.model.dto.CreateSaleRequest;
import com.smartwave.erp.model.dto.SaleDto;
import com.smartwave.erp.service.PosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pos")
public class PosController {

    @Autowired private PosService posService;

    @PostMapping("/sale")
    public ResponseEntity<SaleDto> createSale(@RequestBody CreateSaleRequest request, Authentication authentication) {
        return ResponseEntity.ok(posService.processSale(request, authentication.getName()));
    }

    @GetMapping("/sales")
    public ResponseEntity<java.util.List<SaleDto>> getAllSales() {
        return ResponseEntity.ok(posService.getAllSales());
    }
}
