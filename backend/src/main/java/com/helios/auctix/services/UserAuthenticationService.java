package com.helios.auctix.services;

import com.helios.auctix.domain.User;
import com.helios.auctix.domain.UserRoleEnum;
import com.helios.auctix.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserAuthenticationService {

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final CustomUserDetailsService userDetailsService;

    public UserAuthenticationService(JwtService jwtService,
                                     AuthenticationManager authenticationManager,
                                     UserRepository userRepository, CustomUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.userDetailsService = userDetailsService;
    }

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(15);

    public User register(String email, String username, String password, String role) {
        User user = User.builder()
                .id("1 " + email)
                .email(email)
                .username(username)
                .role(UserRoleEnum.valueOf(role))
                .passwordHash(encoder.encode(password))
                .build();

        userRepository.save(user);
        return user;
    }

    public String verify(User user) {

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

        Authentication authentication = authenticationManager
                .authenticate(
                        new UsernamePasswordAuthenticationToken(
                                userDetails.getUsername(),
                                userDetails.getPassword(),
                                userDetails.getAuthorities()
                        )
                );

//        SecurityContextHolder.getContext().setAuthentication(authentication);//  TODO check this: https://stackoverflow.com/a/78259831

        if (authentication.isAuthenticated()) {
            String jwt = jwtService.generateToken(user.getUsername(), user.getRole());
            System.out.println("JWT: " + jwt);
            return jwt;
        }
        throw new BadCredentialsException("Invalid username or password");
    }
}