package com.helios.auctix.services.user;

import com.helios.auctix.domain.user.User;
import com.helios.auctix.repositories.UserRepository;
import org.apache.tomcat.websocket.AuthenticationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.security.InvalidParameterException;
import java.util.Arrays;
import java.util.List;

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


    public Page getAllUsers(int limit, int offset, String order, String sortBy, String search) {

        if (limit < 0 || offset < 0) {
            throw new InvalidParameterException("Error: limit and offset must be positive");
        }
        if(limit > 100) {
            throw new InvalidParameterException("Error: limit must be less than or equal to 100");
        }

        List<String> validSortFields = Arrays.asList("id", "username", "email", "firstName" , "lastName");
        if (!validSortFields.contains(sortBy)) {
            throw new InvalidParameterException("Error: Invalid sortby value. Valid values: id, username, email, role");
        }

        if (!order.equalsIgnoreCase("asc") && !order.equalsIgnoreCase("desc")) {
            throw new InvalidParameterException("Error: Invalid order value. Valid values: asc, desc");
        }

        Sort.Direction direction = order.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(offset, limit, Sort.by(direction, sortBy));

        Page<User> userPage;
        if (search != null && !search.trim().isEmpty()) {
            userPage = userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(search, search, search, search , pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }

        return userPage;

    }

}
