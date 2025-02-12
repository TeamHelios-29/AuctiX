package com.helios.auctix.controllers;

import com.helios.auctix.domain.UserRoleEnum;
import com.helios.auctix.services.JwtService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RequestMapping("/api/public")
@RestController
public class HelloController {

    private JwtService jwtService;

    public HelloController(JwtService jwtService) {
        this.jwtService = jwtService;
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


}