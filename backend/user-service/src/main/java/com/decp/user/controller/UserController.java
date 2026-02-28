package com.decp.user.controller;

import com.decp.user.dto.UserDTO;
import com.decp.user.dto.UserRegistrationRequest;
import com.decp.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserRegistrationRequest request) {
        return ResponseEntity.ok(userService.registerUser(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<UserDTO> getUserByUsername(@RequestParam String username) {
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }

    @GetMapping("/internal/{username}")
    public ResponseEntity<com.decp.user.dto.UserAuthDTO> getUserAuthByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserAuthByUsername(username));
    }

    @GetMapping("/alumni")
    public ResponseEntity<List<UserDTO>> getAlumni() {
        return ResponseEntity.ok(userService.getAlumni());
    }
}