package com.itineria.backend.service;

import com.itineria.backend.entity.User;
import com.itineria.backend.repository.UserRepository;

import java.util.Objects;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder){
        Objects.requireNonNull(userRepository);
        this.userRepository=userRepository;
        Objects.requireNonNull(passwordEncoder);
        this.passwordEncoder =passwordEncoder;
        
    }
    public User register(String email, String password, String pseudo) {
        if(userRepository.existsByEmail(email)){
            throw new IllegalArgumentException("Un compte existe déjà avec l'adresse " + email);
        }
        var hashedPassword = passwordEncoder.encode(password);
        var user = new User(email, hashedPassword, pseudo);
        var savedUser = userRepository.save(user);
        return savedUser;
    }
}
