package com.backend.cctvecommerce.service;

import com.backend.cctvecommerce.entity.User;
import com.backend.cctvecommerce.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User register(@NonNull User user) {

        return userRepository.save(user);
    }

    public User login(String email, String password) {

        User user = userRepository.findByEmail(email);

        if (user != null &&
                user.getPassword().equals(password)) {

            return user;
        }

        return null;
    }

    public User updatePersonalInfo(
            @NonNull Long id,
            User updatedUser
    ) {

        User user = userRepository.findById(id)
                .orElseThrow();

        user.setFullName(
                updatedUser.getFullName()
        );

        user.setPhoneNumber(
                updatedUser.getPhoneNumber()
        );

        return userRepository.save(user);
    }

    public User updateAddress(
            @NonNull Long id,
            User updatedUser
    ) {

        User user = userRepository.findById(id)
                .orElseThrow();

        user.setAddress(
                updatedUser.getAddress()
        );

        user.setCity(
                updatedUser.getCity()
        );

        user.setState(
                updatedUser.getState()
        );

        user.setPostalCode(
                updatedUser.getPostalCode()
        );

        user.setCountry(
                updatedUser.getCountry()
        );

        return userRepository.save(user);
    }

    public User updatePassword(
            @NonNull Long id,
            String newPassword
    ) {

        User user = userRepository.findById(id)
                .orElseThrow();

        user.setPassword(newPassword);

        return userRepository.save(user);
    }

    public User getUserById(@NonNull Long id) {

        return userRepository.findById(id)
                .orElse(null);
    }
}
