package com.decp.post.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.decp.post.model.Post;
import com.decp.post.repository.PostRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final RabbitTemplate rabbitTemplate;

    public Post createPost(Long userId, String username, String fullName, String content, List<String> mediaUrls) {
        Post post = Post.builder()
                .userId(userId)
                .username(username)
                .fullName(fullName)
                .content(content)
                .mediaUrls(mediaUrls)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        Post savedPost = postRepository.save(post);
        
        // Notify other services via RabbitMQ
        rabbitTemplate.convertAndSend("post.exchange", "post.created", savedPost.getId());
        
        return savedPost;
    }

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public Post likePost(String postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (post.getLikedBy().contains(userId)) {
            // Unlike: remove user from likedBy
            post.getLikedBy().remove(userId);
        } else {
            // Like: add user to likedBy
            post.getLikedBy().add(userId);
        }
        return postRepository.save(post);
    }

    public Post addComment(String postId, Post.Comment comment) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        comment.setTimestamp(LocalDateTime.now());
        post.getComments().add(comment);
        return postRepository.save(post);
    }
}