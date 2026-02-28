package com.decp.auth.controller;

import com.decp.auth.dto.AuthRequest;
import com.decp.auth.dto.AuthResponse;
import com.decp.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth Service is reachable!");
    }

    @GetMapping("/validate")
    public ResponseEntity<String> validate(@RequestParam String token) {
        boolean isValid = authService.validate(token);
        if (isValid) {
            return ResponseEntity.ok("Token is valid");
        } else {
            return ResponseEntity.status(401).body("Invalid token");
        }
    }
}