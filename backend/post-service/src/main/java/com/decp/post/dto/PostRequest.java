package com.decp.post.dto;

import lombok.Data;
import java.util.List;

@Data
public class PostRequest {
    private Long userId;
    private String fullName;
    private String content;
    private List<String> mediaUrls;
}
