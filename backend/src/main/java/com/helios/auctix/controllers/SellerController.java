package com.helios.auctix.controllers;

import com.helios.auctix.domain.user.SellerVerificationStatusEnum;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.services.user.SellerService;
import com.helios.auctix.services.user.UserDetailsService;
import lombok.AllArgsConstructor;
import org.apache.tomcat.websocket.AuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/seller")
@AllArgsConstructor
public class SellerController {

    private final SellerService sellerService;
    private final UserDetailsService userDetailsService;

    @GetMapping("/hello")
    public String hello() {
        return "Hello from SellerController!";
    }

    @GetMapping("/sellerVerificationStatus")
    public SellerVerificationStatusEnum getSellerVerificationStatus() throws AuthenticationException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userDetailsService.getAuthenticatedUser(authentication);

        return sellerService.sellerVerifiedStatus(currentUser);
    }

    @PostMapping("/submitSellerVerifications")
    public SellerVerificationStatusEnum submitSellerVerifications(
            @RequestParam("files") MultipartFile[] files
    ) throws AuthenticationException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userDetailsService.getAuthenticatedUser(authentication);

        return sellerService.submitSellerVerifications(currentUser,files);
    }

}
