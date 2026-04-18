package com.smartwave.erp.config;

import com.smartwave.erp.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security Configuration
 *
 * CHANGE 1: cors().disable() was replaced with cors(Customizer.withDefaults()).
 *   The old `.cors(cors -> cors.disable())` was silently ignoring the CORS
 *   mappings defined in WebConfig, meaning every cross-origin request from
 *   the frontend would be blocked by the browser *before* reaching the
 *   controller. Now Spring Security delegates CORS pre-flight handling to
 *   the WebMvcConfigurer (WebConfig.java) which reads allowed origins from
 *   the ALLOWED_ORIGINS environment variable.
 *
 * CHANGE 2: Added @EnableMethodSecurity so @PreAuthorize on UserController
 *   endpoints actually works.
 *
 * CHANGE 3: Wired in JwtAuthenticationFilter so protected routes validate
 *   the Bearer token sent by the frontend after login.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // enables @PreAuthorize / @PostAuthorize on controller methods
public class SecurityConfig {

    /**
     * CHANGE: JwtAuthenticationFilter is injected here so it can be added
     * to the filter chain, validating the JWT on every protected request.
     */
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())        // stateless JWT API — no CSRF needed

            // CHANGE: was cors(cors -> cors.disable()) which blocked all browser
            // cross-origin requests. Now we use the CORS config from WebConfig.
            .cors(cors -> cors.configure(http))

            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth
                // Public endpoints — no token required
                .requestMatchers("/auth/**", "/health", "/").permitAll()
                // Everything else requires a valid JWT
                .anyRequest().authenticated()
            )

            // CHANGE: Register the JWT filter BEFORE Spring's own username/password
            // filter so the token is validated on every incoming request.
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}