package com.helios.auctix.services.user;

import com.helios.auctix.domain.user.User;
import com.helios.auctix.repositories.UserRepository;
import com.helios.auctix.services.CustomUserDetailsService;
import org.apache.tomcat.websocket.AuthenticationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsService {

    @Autowired
    UserRepository userRepository;

    public User getUserByEmail(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return user;
    }

    public User getUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
        return user;
    }

    public User getUserById(String id) throws UsernameNotFoundException {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with id: " + id);
        }
        return user;
    }

    public User getAuthenticatedUser(Authentication authentication) throws AuthenticationException,UsernameNotFoundException {
        String userEmail = null;
        if (authentication == null || authentication.getAuthorities() == null || !authentication.isAuthenticated()) {
            throw new AuthenticationException("User not authenticated");
        }
        userEmail = authentication.getName();
        if (userEmail == null || userEmail.equalsIgnoreCase("anonymousUser")) {
            throw new AuthenticationException("User not authenticated");
        }

        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + userEmail);
        }

        return user;
    }
}
