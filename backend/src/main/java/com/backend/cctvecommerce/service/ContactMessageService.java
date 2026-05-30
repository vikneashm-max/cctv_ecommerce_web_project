package com.backend.cctvecommerce.service;

import com.backend.cctvecommerce.dto.ContactMessageRequest;
import com.backend.cctvecommerce.entity.ContactMessage;
import com.backend.cctvecommerce.exception.ResourceNotFoundException;
import com.backend.cctvecommerce.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactMessageService {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.mail.receiver}")
    private String mailReceiver;

    @Value("${spring.mail.username}")
    private String mailSenderAccount;

    public ContactMessage saveAndSendEmail(ContactMessageRequest request) {
        ContactMessage contactMessage = new ContactMessage();
        contactMessage.setFullName(request.getFullName());
        contactMessage.setEmail(request.getEmail());
        contactMessage.setPhoneNumber(request.getPhoneNumber());
        contactMessage.setSubject(request.getSubject());
        contactMessage.setMessage(request.getMessage());

        // 1. Save to PostgreSQL database
        ContactMessage savedMessage = contactMessageRepository.save(contactMessage);

        // 2. Dispatch Email notification to APP_MAIL_RECEIVER
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(mailSenderAccount);
            mailMessage.setTo(mailReceiver);
            mailMessage.setReplyTo(request.getEmail());
            mailMessage.setSubject("New Contact Form Submission");
            
            String emailBody = String.format(
                "Name: %s\n\nEmail: %s\n\nPhone Number: %s\n\nSubject: %s\n\nMessage:\n%s",
                request.getFullName(),
                request.getEmail(),
                request.getPhoneNumber(),
                request.getSubject(),
                request.getMessage()
            );
            mailMessage.setText(emailBody);

            mailSender.send(mailMessage);
        } catch (Exception e) {
            // Log warning but proceed so that API response succeeds even if SMTP is failing
            System.err.println("CRITICAL WARNING: SMTP Contact Email Dispatch Failed: " + e.getMessage());
        }

        return savedMessage;
    }

    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc();
    }

    public void deleteMessage(@org.springframework.lang.NonNull Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact message not found with id: " + id));
        contactMessageRepository.delete(java.util.Objects.requireNonNull(message));
    }
}
