package com.decp.post.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "posts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {

    @Id
    private String id;

    private Long userId;
    private String username;
    private String fullName;
    private String content;
    @Builder.Default
    private List<String> mediaUrls = new ArrayList<>();
    
    @Builder.Default
    private List<Long> likedBy = new ArrayList<>();
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Comment {
        private Long userId;
        private String username;
        private String text;
        private LocalDateTime timestamp;
    }
}