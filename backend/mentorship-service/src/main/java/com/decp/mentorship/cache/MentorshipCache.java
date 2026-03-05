package com.decp.mentorship.cache;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class MentorshipCache {

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String PREFIX = "mentorship:";
    private static final String MATCHES_KEY = PREFIX + "matches:";
    private static final String TOP_MENTORS_KEY = PREFIX + "top-mentors";
    private static final String MENTOR_RATING_KEY = PREFIX + "rating:";
    private static final Duration MATCHES_TTL = Duration.ofHours(24);
    private static final Duration TOP_MENTORS_TTL = Duration.ofHours(6);

    public void cacheMatches(Long userId, String matchesJson) {
        try {
            redisTemplate.opsForValue().set(MATCHES_KEY + userId, matchesJson, MATCHES_TTL);
        } catch (Exception e) {
            log.warn("Redis cacheMatches failed for user {}: {}", userId, e.getMessage());
        }
    }

    public String getCachedMatches(Long userId) {
        try {
            return redisTemplate.opsForValue().get(MATCHES_KEY + userId);
        } catch (Exception e) {
            log.warn("Redis getCachedMatches failed for user {}: {}", userId, e.getMessage());
            return null;
        }
    }

    public void invalidateMatches(Long userId) {
        try {
            redisTemplate.delete(MATCHES_KEY + userId);
        } catch (Exception e) {
            log.warn("Redis invalidateMatches failed for user {}: {}", userId, e.getMessage());
        }
    }

    public void cacheTopMentors(String topMentorsJson) {
        try {
            redisTemplate.opsForValue().set(TOP_MENTORS_KEY, topMentorsJson, TOP_MENTORS_TTL);
        } catch (Exception e) {
            log.warn("Redis cacheTopMentors failed: {}", e.getMessage());
        }
    }

    public String getCachedTopMentors() {
        try {
            return redisTemplate.opsForValue().get(TOP_MENTORS_KEY);
        } catch (Exception e) {
            log.warn("Redis getCachedTopMentors failed: {}", e.getMessage());
            return null;
        }
    }

    public void cacheMentorRating(Long mentorId, Double rating) {
        try {
            redisTemplate.opsForValue().set(MENTOR_RATING_KEY + mentorId, String.valueOf(rating));
        } catch (Exception e) {
            log.warn("Redis cacheMentorRating failed for mentor {}: {}", mentorId, e.getMessage());
        }
    }

    public Double getCachedMentorRating(Long mentorId) {
        try {
            String val = redisTemplate.opsForValue().get(MENTOR_RATING_KEY + mentorId);
            return val != null ? Double.parseDouble(val) : null;
        } catch (Exception e) {
            log.warn("Redis getCachedMentorRating failed for mentor {}: {}", mentorId, e.getMessage());
            return null;
        }
    }
}
