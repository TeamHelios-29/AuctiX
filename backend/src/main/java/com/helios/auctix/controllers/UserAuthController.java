package com.helios.auctix.controllers;

import com.helios.auctix.domain.user.User;
import com.helios.auctix.domain.user.UserRoleEnum;
import com.helios.auctix.dtos.LoginRequestDTO;
import com.helios.auctix.dtos.RegistrationRequestDTO;
import com.helios.auctix.repositories.UserRepository;
import com.helios.auctix.services.UserAuthenticationService;
import com.helios.auctix.services.user.UserRegisterService;
import com.helios.auctix.services.user.UserServiceResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/auth")
@RestController
public class UserAuthController {

    private final UserRegisterService userRegisterService;
    private UserAuthenticationService userAuthenticationService;

    private UserRepository userRepository; // TODO Replace with UserService when it is implemented

    public UserAuthController(UserAuthenticationService userAuthenticationService, UserRepository userRepository, UserRegisterService userRegisterService) {
        this.userAuthenticationService = userAuthenticationService;
        this.userRepository = userRepository;
        this.userRegisterService = userRegisterService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register( @RequestBody RegistrationRequestDTO registrationRequestDTO) {

        if (registrationRequestDTO == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request");
        }

        // TODO use UserService check if user already exists

        UserServiceResponse registrationResponse = userRegisterService.addUser(
                registrationRequestDTO.getUsername(),
                registrationRequestDTO.getEmail(),
                registrationRequestDTO.getPassword(),
                registrationRequestDTO.getFirstName(),
                registrationRequestDTO.getLastName(),
                UserRoleEnum.valueOf(registrationRequestDTO.getRole()));

        if (!registrationResponse.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(registrationResponse.getMessage());
        }

        // send a jwt to log the user in when registration is successful
        return ResponseEntity.status(HttpStatus.CREATED).body(
                userAuthenticationService.verify(registrationResponse.getUser(), registrationRequestDTO.getPassword()));

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
