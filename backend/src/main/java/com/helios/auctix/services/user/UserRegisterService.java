package com.helios.auctix.services.user;


import com.helios.auctix.domain.user.*;
import com.helios.auctix.repositories.*;
import com.helios.auctix.services.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class UserRegisterService {

    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final BidderRepository bidderRepository;
    private final AdminRepository adminRepository;
    private final UserRoleRepository userRoleRepository;
    private final JwtService jwtService;
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    Logger log = Logger.getLogger(UserRegisterService.class.getName());

    /**
     * Checks if a user exists in the system based on the provided username.
     *
     * @param username the username to check for existence
     * @return {@code true} if a user with the given username exists, {@code false} otherwise
     */
    public boolean isUserExistsOnUsername(String username) {
        return userRepository.existsByUsername(username);
    }


    /**
     * Checks if a user exists in the system with the given email address.
     *
     * @param email the email address to check for existence
     * @return {@code true} if a user with the specified email exists, {@code false} otherwise
     */
    public boolean isUserExistsOnEmail(String email){
        return userRepository.existsByEmail(email);
    }


    /**
     * Checks if a user exists in the repository by their unique identifier (UUID).
     *
     * @param Id the unique identifier (UUID) of the user to check.
     * @return {@code true} if a user with the specified UUID exists, {@code false} otherwise.
     */
    public boolean isUserExistsOnId(UUID Id){
        return userRepository.existsById(Id);
    }


    /**
     * Registers a new user in the system with the specified details.
     *
     * @param username   The username of the new user.
     * @param email      The email address of the new user.
     * @param rawPassword The raw password of the new user, which will be hashed before saving.
     * @param firstname  The first name of the new user.
     * @param lastname   The last name of the new user.
     * @param role       The role of the new user (SELLER, BIDDER, or ADMIN).
     * @return A {@link UserServiceResponse} object containing the success status, message, 
     *         and the created {@link User} object if successful.
     * 
     * This method performs the following steps:
     * <ul>
     *   <li>Checks if a user with the given email or username already exists.</li>
     *   <li>Hashes the provided password.</li>
     *   <li>Creates and saves a new {@link User} object.</li>
     *   <li>Based on the role, creates and saves a corresponding {@link Seller}, {@link Bidder}, 
     *       or {@link Admin} object.</li>
     *   <li>Logs the process at each step for traceability.</li>
     * </ul>
     * If the role is invalid, returns a failure response.
     */
    @Transactional
    public UserServiceResponse addUser(String username, String email, String rawPassword , String firstname, String lastname , UserRoleEnum role) {
        log.info("Creating account " + username);

        UserRole userRoleId = userRoleRepository.findByName(role);
        if(userRepository.existsByEmail(email)){
            log.warning("User already exists from the given email");
            return new UserServiceResponse(false, "User already exists for the given email",null);
        }
        if(userRepository.existsByUsername(username)){
            log.warning("User already exists from the given username");
            return new UserServiceResponse(false, "User already exists for the given username",null);
        }

        String hashedPassword = encoder.encode(rawPassword);

        log.info("Creating user object");
        User user = User.builder()
                .username(username)
                .email(email)
                .passwordHash(hashedPassword)
                .firstName(firstname)
                .lastName(lastname)
                .role(userRoleId)
                .build();

        log.info("Saving user object");
        user = userRepository.save(user);

        if(UserRoleEnum.SELLER == role) {

            log.info("Creating seller object with id " + user.getId());
            Seller seller = Seller.builder()
                    .user(user)
                    .isVerified(false)
                    .isActive(true)
                    .build();

            log.info("Saving seller object");
            sellerRepository.save(seller);
            log.info("User and Seller saved successfully");
        }
        else if(UserRoleEnum.BIDDER == role) {

            log.info("Creating bidder object with id " + user.getId());
            Bidder bidder = Bidder.builder()
                    .user(user)
                    .isActive(true)
                    .build();

            log.info("Saving bidder object");
            bidderRepository.save(bidder);
            log.info("User and Bidder saved successfully");
        }
        else if(UserRoleEnum.ADMIN == role) {

            log.info("Creating admin object with id " + user.getId());
            Admin admin = Admin.builder()
                    .user(user)
                    .isActive(true)
                    .build();
            log.info("Saving admin object");
            adminRepository.save(admin);
            log.info("User and Admin saved successfully");
        }
        else{
            log.warning("Invalid role");
            return new UserServiceResponse(false, "Invalid role",null);
        }
        return new UserServiceResponse(true, "User registered successfully",user);
    }

    // TODO refactor later to a seperate service
    public User getUser(UUID userId) {
        return userRepository.findById(String.valueOf(userId)).orElse(null);
    }

    public User getUserFromToken(String token) {
        String email = jwtService.extractEmail(token);
        return userRepository.findByEmail(email);
    }

    public User getUserFromEmail(String email) {
        return userRepository.findByEmail(email);
    }




}

