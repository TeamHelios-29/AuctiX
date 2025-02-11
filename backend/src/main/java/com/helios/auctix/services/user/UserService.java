package com.helios.auctix.services.user;


import com.helios.auctix.domain.user.User;
import com.helios.auctix.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public boolean isUserExistsOnUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean isUserExistsOnEmail(String email){
        return userRepository.existsByEmail(email);
    }

    public boolean isUserExistsOnId(UUID Id){
        return userRepository.existsById(Id);
    }

    public String addUser(String username, String email, String pswHash){
        if(isUserExistsOnUsername(username)){
            return "Error: Username already taken.";
        }
        if(isUserExistsOnEmail(email)){
            return "Error: you have created an account with this email";
        }
        User user = User.builder()
                .id(UUID.randomUUID())
                .username(username)
                .email(email)
                .passwordHash(pswHash)
                .build();
        userRepository.save(user);
        return "Success: User Created";
    }


}

