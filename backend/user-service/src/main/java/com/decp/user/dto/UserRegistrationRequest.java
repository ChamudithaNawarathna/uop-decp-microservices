package com.decp.user.dto;

import com.decp.user.model.UserRole;
import lombok.Data;

@Data
public class UserRegistrationRequest {
    private String username;
    private String email;
    private String password;
    private String fullName;
    private UserRole role;
}