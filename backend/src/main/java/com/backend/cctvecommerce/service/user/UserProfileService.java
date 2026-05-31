package com.backend.cctvecommerce.service.user;

import com.backend.cctvecommerce.dto.user.UserProfileResponse;
import com.backend.cctvecommerce.entity.User;
import com.backend.cctvecommerce.exception.ResourceNotFoundException;
import com.backend.cctvecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResourceNotFoundException("Logged in user not found.");
        }
        return user;
    }

    public UserProfileResponse getProfile() {
        User user = getCurrentUser();
        return convertToResponse(user);
    }

    public UserProfileResponse updatePersonalInfo(User updatedUser) {
        User user = getCurrentUser();
        user.setFullName(updatedUser.getFullName());
        user.setPhoneNumber(updatedUser.getPhoneNumber());
        User savedUser = userRepository.save(user);
        return convertToResponse(savedUser);
    }

    public UserProfileResponse updateAddress(User updatedUser) {
        User user = getCurrentUser();
        user.setAddress(updatedUser.getAddress());
        user.setCity(updatedUser.getCity());
        user.setState(updatedUser.getState());
        user.setPostalCode(updatedUser.getPostalCode());
        user.setCountry(updatedUser.getCountry());
        User savedUser = userRepository.save(user);
        return convertToResponse(savedUser);
    }

    public UserProfileResponse updatePassword(String newPassword) {
        User user = getCurrentUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        User savedUser = userRepository.save(user);
        return convertToResponse(savedUser);
    }

    public UserProfileResponse updateAvatar(String avatarUrl) {
        User user = getCurrentUser();
        user.setProfilePictureUrl(avatarUrl);
        User savedUser = userRepository.save(user);
        return convertToResponse(savedUser);
    }

    private UserProfileResponse convertToResponse(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getPhoneNumber(),
                user.getAddress(),
                user.getCity(),
                user.getState(),
                user.getPostalCode(),
                user.getCountry(),
                user.getProfilePictureUrl()
        );
    }
}
