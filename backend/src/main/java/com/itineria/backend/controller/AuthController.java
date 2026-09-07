package com.itineria.backend.controller;

import com.itineria.backend.dto.LoginRequest;
import com.itineria.backend.dto.RegisterRequest;
import com.itineria.backend.dto.RegisterResponse;
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
    public RegisterResponse register(@RequestBody RegisterRequest request) {
        var user = authService.register(request.getEmail(), request.getPassword(), request.getPseudo());
        return toResponse(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        return authService.login(request.getEmail(), request.getPassword());
    }

    private RegisterResponse toResponse(User user) {
        return new RegisterResponse(user.getId(), user.getEmail(), user.getPseudo());
    }
}