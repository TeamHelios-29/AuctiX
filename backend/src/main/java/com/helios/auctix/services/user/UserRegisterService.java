package com.helios.auctix.services.user;


import com.helios.auctix.domain.user.*;
import com.helios.auctix.repositories.*;
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
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    Logger log = Logger.getLogger(UserRegisterService.class.getName());

    public boolean isUserExistsOnUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean isUserExistsOnEmail(String email){
        return userRepository.existsByEmail(email);
    }

    public boolean isUserExistsOnId(UUID Id){
        return userRepository.existsById(Id);
    }


    @Transactional
    public UserServiceResponse addUser(String username, String email, String rawPassword , String firstname, String lastname , UserRoleEnum role) {
        log.info("Adding seller " + username);

        UserRole userRoleId = userRoleRepository.findByName(role);
        if(userRepository.existsByEmail(email)){
            log.warning("User already exists from the given email");
            return new UserServiceResponse(false, "User already exists foer the given email");
        }
        if(userRepository.existsByUsername(username)){
            log.warning("User already exists from the given username");
            return new UserServiceResponse(false, "User already exists for the given username");
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
            return new UserServiceResponse(false, "Invalid role");
        }
        return new UserServiceResponse(true, "User registered successfully");
    }

}

