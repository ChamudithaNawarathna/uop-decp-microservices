package com.decp.user.dto;

import com.decp.user.model.UserRole;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String bio;
    private String profilePictureUrl;
    private UserRole role;
}