package com.helios.auctix.services.user;


import com.helios.auctix.domain.user.*;
import com.helios.auctix.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final BidderRepository bidderRepository;
    private final AdminRepository adminRepository;
    private final UserRoleRepository userRoleRepository;
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    Logger log = Logger.getLogger(UserService.class.getName());

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
    public String addUser(String username, String email, String rawPassword , String firstname, String lastname , UserRoleEnum role) {
        log.info("Adding seller " + username);

        UserRole userRoleId = userRoleRepository.findByName(role);

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
                    .id(user.getId())
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
                    .id(user.getId())
                    .isActive(true)
                    .build();

            log.info("Saving bidder object");
            bidderRepository.save(bidder);
            log.info("User and Bidder saved successfully");
        }
        else if(UserRoleEnum.ADMIN == role) {

            log.info("Creating admin object with id " + user.getId());
            Admin admin = Admin.builder()
                    .id(user.getId())
                    .isActive(true)
                    .build();
            log.info("Saving admin object");
            adminRepository.save(admin);
            log.info("User and Admin saved successfully");
        }
        else{
            log.warning("Invalid role");
            return "Error: Invalid role";
        }
        return "Success: User Created";
    }

}

