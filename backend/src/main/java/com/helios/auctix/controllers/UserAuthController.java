package com.helios.auctix.controllers;

import com.helios.auctix.domain.User;
import com.helios.auctix.dtos.LoginRequestDTO;
import com.helios.auctix.dtos.RegistrationRequestDTO;
import com.helios.auctix.repositories.UserRepository;
import com.helios.auctix.services.UserAuthenticationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/auth")
@RestController
public class UserAuthController {

    private UserAuthenticationService userAuthenticationService;

    private UserRepository userRepository; // TODO Replace with UserService when it is implemented

    public UserAuthController(UserAuthenticationService userAuthenticationService, UserRepository userRepository) {
        this.userAuthenticationService = userAuthenticationService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register( @RequestBody RegistrationRequestDTO registrationRequestDTO) {
//        if (true) {
//            return ResponseEntity.status(HttpStatus.OK).body("HI");
//        }

        if (registrationRequestDTO == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request");
        }

        // TODO use UserService check if user already exists

        User user = userAuthenticationService.register(
                registrationRequestDTO.getEmail(),
                registrationRequestDTO.getUsername(),
                registrationRequestDTO.getPassword(),
                registrationRequestDTO.getRole());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request");
        } else {
            return ResponseEntity.ok("User registered successfully");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDTO loginRequestDTO) {

        if (loginRequestDTO == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication Request is invalid");
        }

        User user = userRepository.findByEmail(loginRequestDTO.getEmail());

        System.out.println("Menna user: "+user);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email or password is incorrect 1");
        }

        String jwt = userAuthenticationService.verify(user, loginRequestDTO.getPassword());

        System.out.println("Menna jwt: "+jwt);

        if (jwt == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email or password is incorrect 2");
        }

        System.out.println("mesnn dekama jwt: "+jwt + " user: "+user);

        return ResponseEntity.ok(jwt);


    }
}
