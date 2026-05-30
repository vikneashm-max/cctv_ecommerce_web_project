package com.backend.cctvecommerce.controller;

import com.backend.cctvecommerce.dto.ContactMessageRequest;
import com.backend.cctvecommerce.entity.ContactMessage;
import com.backend.cctvecommerce.service.ContactMessageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ContactMessageController {

    @Autowired
    private ContactMessageService contactMessageService;

    @PostMapping("/api/contact")
    public ResponseEntity<ContactMessage> createContactMessage(@Valid @RequestBody ContactMessageRequest request) {
        ContactMessage created = contactMessageService.saveAndSendEmail(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/api/admin/contact-messages")
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        return ResponseEntity.ok(contactMessageService.getAllMessages());
    }

    @DeleteMapping("/api/admin/contact-messages/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable @org.springframework.lang.NonNull Long id) {
        contactMessageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}
