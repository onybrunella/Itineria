package com.itineria.backend.controller;

import com.itineria.backend.dto.RegisterRequest;
import com.itineria.backend.entity.User;
import com.itineria.backend.service.AuthService;

import java.util.Objects;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        Objects.requireNonNull(authService);
        this.authService = authService;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {
        return authService.register(request.getEmail(), request.getPassword(), request.getPseudo());
    }
}