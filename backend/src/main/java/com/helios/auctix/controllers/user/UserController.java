package com.helios.auctix.controllers.user;

import com.helios.auctix.domain.user.User;
import com.helios.auctix.repositories.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/info")
    public String getUserInfo() {
        return "User Module is working!";
    }

    @GetMapping("/addUser")
    public void addSampleUser(){
        User user = User.builder()
                .id("01")
                .username("Jake")
                .email("jake@example.com")
                .passwordHash("testlkjsfs")
                .build();
        userRepository.save(user);
    }
}