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
import java.util.UUID;

@Service
public class UserDetailsService {

    @Autowired
    UserRepository userRepository;

    /**
     * Retrieves a user by {@link Authentication}.
     *
     * @return the User object associated with current user
     * @throws UsernameNotFoundException if no user is found
     */
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


    /**
     * Retrieves a paginated list of users with optional sorting and search functionality.
     *
     * @param limit  the maximum number of users to retrieve per page. Must be a positive integer and less than or equal to 100.
     * @param offset the page number to retrieve. Must be a non-negative integer.
     * @param order  the sorting order, either "asc" for ascending or "desc" for descending.
     * @param sortBy the field to sort by. Valid values are "id", "username", "email", "firstName", and "lastName".
     * @param search an optional search string to filter users by username, email, first name, or last name. If null or empty, no filtering is applied.
     * @return a paginated {@link Page} of {@link User} objects matching the criteria.
     * @throws InvalidParameterException if any of the parameters are invalid:
     *                                   - limit or offset is negative.
     *                                   - limit exceeds 100.
     *                                   - sortBy is not one of the valid fields.
     *                                   - order is not "asc" or "desc".
     */
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

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id).orElse(null);
    }

}
