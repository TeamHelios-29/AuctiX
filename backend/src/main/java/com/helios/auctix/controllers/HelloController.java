package com.helios.auctix.controllers;

import com.helios.auctix.domain.user.User;
import com.helios.auctix.domain.UserRoleEnum;
import com.helios.auctix.repositories.UserRepository;
import com.helios.auctix.services.CustomUserDetailsService;
import com.helios.auctix.services.JwtService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RequestMapping("/api/public")
@RestController
public class HelloController {

    private JwtService jwtService;
    private UserRepository userRepository;
    private CustomUserDetailsService customUserDetailsService;

    public HelloController(JwtService jwtService, UserRepository userRepository, CustomUserDetailsService customUserDetailsService) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.customUserDetailsService = customUserDetailsService;
    }

    @GetMapping("/hello")
    public String sayHello() {
        return "Hello World";
    }

    @GetMapping("/hello2")
    public String helloPrincipal(Principal principal) {
        return "Hello, " + principal.getName();
    }

    @GetMapping("/getjwt/{email}")
    public String getJwt(@PathVariable String email) {
        return jwtService.generateToken(email, UserRoleEnum.BIDDER);
    }

    @GetMapping("/jwt/verify/{token}")
    public Boolean verifyJwt(@PathVariable String token) {
        try {
            jwtService.isValidToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @GetMapping("/jwt/role/{email}/{token}")
    public String getRole(@PathVariable String email, @PathVariable String token) {

//        return "hi" + email + " " + token;
        User user = userRepository.findByEmail(email);

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());

        boolean isValid = jwtService.isValidToken(token, userDetails);

        System.out.println("User : " + user + "userDetails" + userDetails + " isValid : " + isValid);

        if (isValid) {
            return jwtService.extractRole(token).name();
        } else {
            return null;
        }
    }


}