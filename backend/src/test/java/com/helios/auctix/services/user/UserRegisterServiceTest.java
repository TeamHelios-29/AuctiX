package com.helios.auctix.services.user;

import com.helios.auctix.domain.user.User;
import com.helios.auctix.domain.user.UserRoleEnum;
import com.helios.auctix.repositories.*;
import com.helios.auctix.services.JwtService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;


@Slf4j
class UserRegisterServiceTest {

    private final UserRepository userRepository = Mockito.mock(UserRepository.class);
    private final SellerRepository sellerRepository = Mockito.mock(SellerRepository.class);
    private final BidderRepository bidderRepository = Mockito.mock(BidderRepository.class);
    private final AdminRepository adminRepository = Mockito.mock(AdminRepository.class);
    private final UserRoleRepository userRoleRepository = Mockito.mock(UserRoleRepository.class);
    private final JwtService jwtService = Mockito.mock(JwtService.class);



    @BeforeEach
    void setUp() {
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    @DisplayName("Test Registering a user with role bidder")
    void addBidder() {

//
//        try {
//            UserRegisterService userRegisterService = new UserRegisterService(userRepository, sellerRepository, bidderRepository, adminRepository, userRoleRepository, jwtService);
//            for (int j = 0; j < 10; j++) {
//                userRegisterService.addUser(
//                        "testuser_username" + j,
//                        "testemail_email" + j + "@example.com",
//                        "password123",
//                        "FirstName" + j,
//                        "LastName" + j,
//                        UserRoleEnum.BIDDER,
//                        null
//                );
//                Thread.sleep(100);
//            }
//        } catch (Exception e) {
//            log.error("ERROR occurred while adding user ");
//        }
    }
}