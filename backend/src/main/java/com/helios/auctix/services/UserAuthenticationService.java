package com.helios.auctix.services;

import com.helios.auctix.domain.user.User;
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

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public User register(String email, String username, String password, String role) {
        User user = User.builder()
                .email(email)
                .username(username)
                .role(UserRoleEnum.valueOf(role))
                .passwordHash(encoder.encode(password))
                .build();

        userRepository.save(user);
        return user;
    }

    public String verify(User user, String rawPasswordFromLogin) {

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

        Authentication authentication = authenticationManager
                .authenticate(
                        new UsernamePasswordAuthenticationToken(
                                userDetails.getUsername(),
                                rawPasswordFromLogin,
                                userDetails.getAuthorities()
                        )
                );

        if (authentication.isAuthenticated()) {
            String jwt = jwtService.generateToken(user.getEmail(), user.getRole());
            System.out.println("JWT: " + jwt);
            return jwt;
        }
        throw new BadCredentialsException("Invalid username or password");
    }
}