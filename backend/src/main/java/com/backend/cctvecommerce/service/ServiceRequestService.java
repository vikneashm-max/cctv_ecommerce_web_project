package com.backend.cctvecommerce.service;

import com.backend.cctvecommerce.dto.ServiceRequestCreateRequest;
import com.backend.cctvecommerce.entity.ServiceRequest;
import com.backend.cctvecommerce.exception.ResourceNotFoundException;
import com.backend.cctvecommerce.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceRequestService {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    public ServiceRequest createServiceRequest(ServiceRequestCreateRequest request) {
        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setCustomerName(request.getCustomerName());
        serviceRequest.setPhoneNumber(request.getPhoneNumber());
        serviceRequest.setServiceType(request.getServiceType());
        serviceRequest.setMessage(request.getMessage());
        serviceRequest.setStatus("PENDING");
        return serviceRequestRepository.save(serviceRequest);
    }

    public List<ServiceRequest> getAllServiceRequests() {
        return serviceRequestRepository.findAllByOrderByCreatedAtDesc();
    }

    public @org.springframework.lang.NonNull ServiceRequest getServiceRequestById(@org.springframework.lang.NonNull Long id) {
        return java.util.Objects.requireNonNull(serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found with id: " + id)));
    }

    public ServiceRequest updateStatus(@org.springframework.lang.NonNull Long id, String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status cannot be empty");
        }
        
        String upperStatus = status.trim().toUpperCase();
        validateStatus(upperStatus);
        
        ServiceRequest serviceRequest = getServiceRequestById(id);
        serviceRequest.setStatus(upperStatus);
        return serviceRequestRepository.save(java.util.Objects.requireNonNull(serviceRequest));
    }

    public void deleteServiceRequest(@org.springframework.lang.NonNull Long id) {
        ServiceRequest serviceRequest = getServiceRequestById(id);
        serviceRequestRepository.delete(java.util.Objects.requireNonNull(serviceRequest));
    }

    private void validateStatus(String status) {
        if (!status.equals("PENDING") && !status.equals("IN_PROGRESS") && 
            !status.equals("COMPLETED") && !status.equals("CANCELLED")) {
            throw new IllegalArgumentException("Invalid status: " + status + ". Allowed values: PENDING, IN_PROGRESS, COMPLETED, CANCELLED");
        }
    }
}
