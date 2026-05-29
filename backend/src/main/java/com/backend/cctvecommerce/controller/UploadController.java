package com.backend.cctvecommerce.controller;


import com.backend.cctvecommerce.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class UploadController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file) {

        String imageUrl = cloudinaryService.uploadImage(file);

        return ResponseEntity.ok(imageUrl);
    }
}