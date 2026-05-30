package com.backend.cctvecommerce.controller;

import com.backend.cctvecommerce.dto.ServiceRequestCreateRequest;
import com.backend.cctvecommerce.entity.ServiceRequest;
import com.backend.cctvecommerce.service.ServiceRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @PostMapping("/api/service-requests")
    public ResponseEntity<ServiceRequest> createServiceRequest(@Valid @RequestBody ServiceRequestCreateRequest request) {
        ServiceRequest created = serviceRequestService.createServiceRequest(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/api/admin/service-requests")
    public ResponseEntity<List<ServiceRequest>> getAllServiceRequests() {
        return ResponseEntity.ok(serviceRequestService.getAllServiceRequests());
    }

    @GetMapping("/api/admin/service-requests/{id}")
    public ResponseEntity<ServiceRequest> getServiceRequestById(@PathVariable @org.springframework.lang.NonNull Long id) {
        return ResponseEntity.ok(serviceRequestService.getServiceRequestById(id));
    }

    @PutMapping("/api/admin/service-requests/{id}/status")
    public ResponseEntity<ServiceRequest> updateStatus(@PathVariable @org.springframework.lang.NonNull Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status field is required");
        }
        return ResponseEntity.ok(serviceRequestService.updateStatus(id, status));
    }

    @DeleteMapping("/api/admin/service-requests/{id}")
    public ResponseEntity<Void> deleteServiceRequest(@PathVariable @org.springframework.lang.NonNull Long id) {
        serviceRequestService.deleteServiceRequest(id);
        return ResponseEntity.noContent().build();
    }
}
