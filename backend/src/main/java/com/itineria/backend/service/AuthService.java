package com.itineria.backend.service;

import com.itineria.backend.entity.User;
import com.itineria.backend.repository.UserRepository;

import java.util.Objects;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtService jwtService){
        Objects.requireNonNull(userRepository);
        this.userRepository=userRepository;
        Objects.requireNonNull(passwordEncoder);
        this.passwordEncoder =passwordEncoder;
        Objects.requireNonNull(jwtService);
        this.jwtService=jwtService;
    }
    public User register(String email, String password, String pseudo) {
        if(userRepository.existsByEmail(email)){
            throw new IllegalArgumentException("Un compte existe déjà avec l'adresse " + email + ".");
        }
        var hashedPassword = passwordEncoder.encode(password);
        var user = new User(email, hashedPassword, pseudo);
        var savedUser = userRepository.save(user);
        return savedUser;
    }

    public String login(String email, String password) {
        Optional<User> foundUser = userRepository.findByEmail(email);
        if (foundUser.isEmpty()) {
            throw new IllegalArgumentException("Cet email n'existe pas dans la base de données.");
        }
        User user = foundUser.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Mot de passe incorrect.");
        }
        return jwtService.generateToken(user.getEmail());
      //  return user;
    }
}
