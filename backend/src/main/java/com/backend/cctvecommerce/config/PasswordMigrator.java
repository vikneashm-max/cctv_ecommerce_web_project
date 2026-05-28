package com.backend.cctvecommerce.config;

import com.backend.cctvecommerce.entity.User;
import com.backend.cctvecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PasswordMigrator implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Starting password security migration check...");
        List<User> users = userRepository.findAll();
        int migratedCount = 0;

        for (User user : users) {
            String password = user.getPassword();
            // BCrypt hashes are 60 characters long and start with $2a$, $2b$, or $2y$
            if (password != null && !password.startsWith("$2a$") && !password.startsWith("$2b$") && !password.startsWith("$2y$")) {
                String hashedPassword = passwordEncoder.encode(password);
                user.setPassword(hashedPassword);
                
                // Ensure a valid role is assigned if not set
                if (user.getRole() == null || user.getRole().isEmpty()) {
                    user.setRole("ROLE_USER");
                } else {
                    String roleUpper = user.getRole().toUpperCase();
                    if (!roleUpper.startsWith("ROLE_")) {
                        roleUpper = "ROLE_" + roleUpper;
                    }
                    user.setRole(roleUpper);
                }

                userRepository.save(user);
                migratedCount++;
                System.out.println("Migrated plaintext password for user: " + user.getEmail());
            }
        }
        System.out.println("Password security migration check finished. Migrated users: " + migratedCount);
    }
}
