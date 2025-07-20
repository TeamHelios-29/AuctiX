package com.helios.auctix.services.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.json.Json;
import com.helios.auctix.domain.user.*;
import com.helios.auctix.dtos.ProfileUpdateDataDTO;
import com.helios.auctix.dtos.UserDTO;
import com.helios.auctix.mappers.impl.UserMapperImpl;
import com.helios.auctix.repositories.UserAddressRepository;
import com.helios.auctix.repositories.UserRepository;
import com.helios.auctix.repositories.UserRequiredActionRepository;
import com.helios.auctix.repositories.UserRoleRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.websocket.AuthenticationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.InvalidParameterException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class UserDetailsService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    UserRequiredActionRepository userRequiredActionRepository;
    @Autowired
    UserAddressRepository userAddressRepository;
    @Autowired
    private UserMapperImpl userMapperImpl;
    @Autowired
    private UserRoleRepository userRoleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

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
    public Page<UserDTO> getAllUsers(int limit, int offset, String order, String sortBy, String search, String filterBy, String filterValue) {

        // validate limit and offset
        if (limit < 0 || offset < 0) {
            throw new InvalidParameterException("Error: limit and offset must be positive");
        }
        if(limit > 100) {
            throw new InvalidParameterException("Error: limit must be less than or equal to 100");
        }

        // validate sortBy and order
        List<String> validSortFields = Arrays.asList("id", "username", "email", "firstName" , "lastName");
        if (!validSortFields.contains(sortBy)) {
            throw new InvalidParameterException("Error: Invalid sortby value. Valid values: id, username, email, role");
        }
        if (!order.equalsIgnoreCase("asc") && !order.equalsIgnoreCase("desc")) {
            throw new InvalidParameterException("Error: Invalid order value. Valid values: asc, desc");
        }

        // validate filterBy and filterValue
        // sample values filterBy=[%22role%22]
        // filterValue=[[%22BIDDER%22,%22SELLER%22,%22ADMIN%22,%22SUPER_ADMIN%22]]
        List<List<String>> filterValues = null;
        List<String> filterByList = null;
        if (filterBy != null && filterValue != null) {
            try {
                // Parse filterValue as JSON array of arrays
                ObjectMapper mapper = new ObjectMapper();
                filterValues = mapper.readValue(filterValue, List.class);

                // parse filterBy as JSON array
                filterByList = mapper.readValue(filterBy, List.class);

                for (int i = 0; i < filterByList.size(); i++) {
                    String filterByItem = filterByList.get(i);
                    if ("role".equals(filterByItem)) {
                        List<String> filterValueItem = filterValues.get(i);
                        List<String> validRoles = Arrays.stream(UserRoleEnum.values()).map(Enum::name).toList();

                        // going through each role in filterValueItem related to filterByItem "role"
                        for (String role : filterValueItem) {
                            if (role == null || role.isEmpty()) {
                                throw new InvalidParameterException("Role cannot be null or empty in filterValue");
                            }
                            // Check if the role is valid
                            if (!validRoles.contains(role)) {
                                throw new InvalidParameterException("Invalid role in filterValue: " + role);
                            }
                        }

                    }
                    // Can add more filterBy conditions here if needed
                    else {
                        throw new InvalidParameterException("Invalid filterBy value: " + filterByItem);
                    }
                }
            } catch (Exception e) {
                throw new InvalidParameterException("Invalid filterValue format: " + e.getMessage());
            }
        }




        Sort.Direction direction = order.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, sortBy);

        // Add additional sort fields from filterBy if present and valid
        Page<UserDTO> userPage = null;
        if (filterBy != null && filterByList != null) {
            ObjectMapper mapper = new ObjectMapper();
            try {
                for (String filterField : filterByList) {
                    if (validSortFields.contains(filterField) && !filterField.equals(sortBy)) {
                        sort = sort.and(Sort.by(direction, filterField));
                    }
                }

                Pageable pageable = PageRequest.of(offset, limit, sort);

                if (search != null && !search.trim().isEmpty()) {
                    userPage = userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(search, search, search, search , pageable)
                            .map(userMapperImpl::mapTo);
                } else {

                    Specification<User> spec = UserSpecification.getFilteredSpec(filterByList, filterValues, userRoleRepository);
                    Page<User> temp = userRepository.findAll(spec, pageable);
                    userPage = temp.map(userMapperImpl::mapTo);
                }


            } catch (Exception e) {
                throw new InvalidParameterException("Invalid filterBy format: " + e.getMessage());
            }
        }

        return userPage;

    }

public UserServiceResponse updateUserProfile(User user, ProfileUpdateDataDTO profileData) {
    log.info("Updating user profile" + profileData.getBio() + "  " + profileData.getFirstName() + " " + profileData.getLastName());

    user.setFirstName(profileData.getFirstName());
    user.setLastName(profileData.getLastName());

    UserAddress address;
    if(user.getUserAddress() != null) {
        address = userAddressRepository.findById(user.getUserAddress().getId()).orElse(new UserAddress());
    }
    else{
        address = new UserAddress();
    }
    if (profileData.getAddress() != null) {
        address.setCountry(profileData.getAddress().getCountry());
        address.setAddressNumber(profileData.getAddress().getAddressNumber());
        address.setAddressLine1(profileData.getAddress().getAddressLine1());
        address.setAddressLine2(profileData.getAddress().getAddressLine2());
        address.setUser(user);
    }
    userAddressRepository.save(address);
    userRepository.save(user);
    log.info("Updated user profile");

    this.resolveUserRequiredAction(user, UserRequiredActionEnum.COMPLETE_PROFILE);
    log.info("Resolved required action COMPLETE_PROFILE for user: {}", user.getUsername());

    return new UserServiceResponse(true, "User profile updated successfully");
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

    public List<UserRequiredAction> getRequiredActions(User currentUser) {
        List<UserRequiredAction> requiredActions = userRequiredActionRepository.findByUserIdAndIsResolvedFalse(currentUser.getId());

        if (requiredActions == null || requiredActions.isEmpty()) {
            log.info("No required actions found for user: {}", currentUser.getUsername());
            return List.of();
        } else {
            log.info("Found {} required actions for user: {}", requiredActions.size(), currentUser.getUsername());
            return requiredActions;
        }
    }

    public void registerUserRequiredAction(User user, UserRequiredActionEnum action) {
        if (action == null) {
            throw new InvalidParameterException("Action cannot be null");
        }

        boolean exists = userRequiredActionRepository.existsByUserIdAndActionTypeAndIsResolvedFalse(user.getId(), action);
        if (exists) {
            log.warn("Required action {} already exists for user: {}", action, user.getUsername());
            throw new InvalidParameterException("Required action already exists for user: " + user.getUsername());
        }

        UserRequiredAction requiredAction = UserRequiredAction.builder()
                .user(user)
                .actionType(action)
                .isResolved(false)
                .context(null)
                .build();

        userRequiredActionRepository.save(requiredAction);
    }

    public void resolveUserRequiredAction(User user, UserRequiredActionEnum action) {
        if (action == null) {
            throw new InvalidParameterException("Action cannot be null");
        }

        UserRequiredAction requiredAction = userRequiredActionRepository.findByUserIdAndActionTypeAndIsResolvedFalse(user.getId(), action);
        if (requiredAction == null) {
            log.info("No required action {} found for user: {}", action, user.getUsername());
            return;
        }

        requiredAction.setResolved(true);
        requiredAction.setResolvedAt(java.time.LocalDateTime.now());
        userRequiredActionRepository.save(requiredAction);
        log.info("Resolved required action {} for user: {}", action, user.getUsername());
    }

    public UserServiceResponse changePassword(User currentUser, String oldPassword, String newPassword) {
        if (currentUser == null) {
            return new UserServiceResponse(false, "Current user is null");
        }
        if (oldPassword == null || oldPassword.isEmpty()) {
            return new UserServiceResponse(false, "Old password is empty");
        }
        if (newPassword == null || newPassword.isEmpty()) {
            return new UserServiceResponse(false, "New password is empty");
        }
        if (newPassword.contentEquals(oldPassword)) {
            return  new UserServiceResponse(false, "New password cannot be the same as old password");
        }
        // encode the passwords
        String encodedNewPassword = passwordEncoder.encode(newPassword);

        // check if the old password matches the current user's password
        if (!passwordEncoder.matches(oldPassword, currentUser.getPasswordHash())) {
            throw new InvalidParameterException("Old password does not match current password");
        }
        // update the user's password
        currentUser.setPasswordHash(encodedNewPassword);
        currentUser = userRepository.save(currentUser);
        return  new UserServiceResponse(true, "Password changed successfully", currentUser);
    }
}
