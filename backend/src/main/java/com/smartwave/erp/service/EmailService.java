package com.smartwave.erp.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    private TemplateEngine templateEngine;
    
    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;
    
    public void sendPasswordResetEmail(String to, String token) {
        String resetUrl = baseUrl + "/auth/reset-password?token=" + token;
        String subject = "Password Reset Request - SmartWave ERP";
        
        Context context = new Context();
        context.setVariable("resetUrl", resetUrl);
        context.setVariable("username", to);
        context.setVariable("expiryHours", 24);
        
        String htmlContent = templateEngine.process("password-reset-email", context);
        sendHtmlEmail(to, subject, htmlContent);
    }
    
    public void sendWelcomeEmail(String to, String username) {
        String subject = "Welcome to SmartWave ERP!";
        
        Context context = new Context();
        context.setVariable("username", username);
        context.setVariable("loginUrl", baseUrl + "/auth/login");
        
        String htmlContent = templateEngine.process("welcome-email", context);
        sendHtmlEmail(to, subject, htmlContent);
    }
    
    public void sendVerificationEmail(String to, String token) {
        String verifyUrl = baseUrl + "/auth/verify?token=" + token;
        String subject = "Verify Your Email - SmartWave ERP";
        
        Context context = new Context();
        context.setVariable("verifyUrl", verifyUrl);
        context.setVariable("username", to);
        
        String htmlContent = templateEngine.process("verification-email", context);
        sendHtmlEmail(to, subject, htmlContent);
    }
    
    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            helper.setFrom("noreply@smartwave.com");
            
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email to: " + to, e);
        }
    }
}