// package com.smartwave.erp;

// import org.junit.jupiter.api.Test;
// import org.springframework.boot.test.context.SpringBootTest;

// @SpringBootTest
// class SmartWaveErpApplicationTests {

//     @Test
//     void contextLoads() {
//     }
// }
package com.smartwave.erp;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class SmartWaveErpApplicationTests {

    @Test
    void contextLoads() {
        // Test passes if application context loads successfully
    }

}