package com.decp.mentorship.service;

import com.decp.mentorship.cache.MentorshipCache;
import com.decp.mentorship.dto.MentorshipMatchDTO;
import com.decp.mentorship.dto.MentorshipProfileResponse;
import com.decp.mentorship.model.Availability;
import com.decp.mentorship.model.MentorshipProfile;
import com.decp.mentorship.model.MentorshipRole;
import com.decp.mentorship.repository.MentorshipProfileRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MentorshipMatchService {

    private final MentorshipProfileRepository profileRepository;
    private final MentorshipCache mentorshipCache;
    private final ObjectMapper objectMapper;

    private static final double EXPERTISE_WEIGHT = 35.0;
    private static final double INTEREST_WEIGHT = 25.0;
    private static final double AVAILABILITY_WEIGHT = 15.0;
    private static final double RATING_WEIGHT = 15.0;
    private static final double DEPARTMENT_WEIGHT = 10.0;

    public List<MentorshipMatchDTO> findMatches(Long userId) {
        // Check cache first
        String cached = mentorshipCache.getCachedMatches(userId);
        if (cached != null) {
            try {
                return objectMapper.readValue(cached, new TypeReference<List<MentorshipMatchDTO>>() {});
            } catch (Exception e) {
                log.warn("Failed to deserialize cached matches for user {}", userId);
            }
        }

        MentorshipProfile userProfile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Mentorship profile not found for user: " + userId));

        List<MentorshipProfile> candidates = getCandidates(userProfile);

        List<MentorshipMatchDTO> matches = candidates.stream()
                .filter(c -> !c.getUserId().equals(userId))
                .map(candidate -> calculateMatch(userProfile, candidate))
                .sorted(Comparator.comparingDouble(MentorshipMatchDTO::getCompatibilityScore).reversed())
                .limit(20)
                .toList();

        // Cache results
        try {
            String json = objectMapper.writeValueAsString(matches);
            mentorshipCache.cacheMatches(userId, json);
        } catch (Exception e) {
            log.warn("Failed to cache matches for user {}", userId);
        }

        return matches;
    }

    public List<MentorshipMatchDTO> findMatchesWithFilters(Long userId, String expertise,
                                                            String availability, String department) {
        MentorshipProfile userProfile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Mentorship profile not found for user: " + userId));

        List<MentorshipProfile> candidates = getCandidates(userProfile);

        return candidates.stream()
                .filter(c -> !c.getUserId().equals(userId))
                .filter(c -> expertise == null || c.getExpertise().stream()
                        .anyMatch(e -> e.equalsIgnoreCase(expertise)))
                .filter(c -> availability == null || c.getAvailability().name().equalsIgnoreCase(availability))
                .filter(c -> department == null || department.equalsIgnoreCase(c.getDepartment()))
                .map(candidate -> calculateMatch(userProfile, candidate))
                .sorted(Comparator.comparingDouble(MentorshipMatchDTO::getCompatibilityScore).reversed())
                .limit(50)
                .toList();
    }

    private List<MentorshipProfile> getCandidates(MentorshipProfile userProfile) {
        // If user is MENTEE or BOTH, find mentors; if MENTOR or BOTH, find mentees
        MentorshipRole role = userProfile.getRole();
        if (role == MentorshipRole.MENTEE) {
            return profileRepository.findAvailableMentors();
        } else if (role == MentorshipRole.MENTOR) {
            return profileRepository.findAvailableMentees();
        } else {
            // BOTH — return all available profiles
            List<MentorshipProfile> all = new ArrayList<>();
            all.addAll(profileRepository.findAvailableMentors());
            all.addAll(profileRepository.findAvailableMentees());
            return all.stream().distinct().toList();
        }
    }

    private MentorshipMatchDTO calculateMatch(MentorshipProfile user, MentorshipProfile candidate) {
        double expertiseScore = calculateListOverlap(user.getExpertise(), candidate.getExpertise())
                + calculateListOverlap(user.getInterests(), candidate.getExpertise());
        double interestScore = calculateListOverlap(user.getInterests(), candidate.getInterests());
        double availabilityScore = calculateAvailabilityScore(user.getAvailability(), candidate.getAvailability());
        double ratingScore = calculateRatingScore(candidate);
        double departmentScore = (user.getDepartment() != null && user.getDepartment().equalsIgnoreCase(candidate.getDepartment())) ? 100.0 : 0.0;

        double compatibilityScore = (expertiseScore * EXPERTISE_WEIGHT
                + interestScore * INTEREST_WEIGHT
                + availabilityScore * AVAILABILITY_WEIGHT
                + ratingScore * RATING_WEIGHT
                + departmentScore * DEPARTMENT_WEIGHT) / 100.0;

        // Clamp to 0-100
        compatibilityScore = Math.min(100.0, Math.max(0.0, compatibilityScore));

        List<String> commonInterests = findCommonItems(user.getInterests(), candidate.getInterests());
        double distanceScore = calculateListOverlap(user.getExpertise(), candidate.getExpertise());

        MentorshipProfileResponse profileResponse = MentorshipProfileService.toResponse(candidate);

        return MentorshipMatchDTO.builder()
                .userId(candidate.getUserId())
                .userName(candidate.getUserName())
                .profile(profileResponse)
                .compatibilityScore(Math.round(compatibilityScore * 10.0) / 10.0)
                .commonInterests(commonInterests)
                .distanceScore(Math.round(distanceScore * 10.0) / 10.0)
                .build();
    }

    private double calculateListOverlap(List<String> list1, List<String> list2) {
        if (list1 == null || list2 == null || list1.isEmpty() || list2.isEmpty()) {
            return 0.0;
        }
        Set<String> set1 = list1.stream().map(String::toLowerCase).collect(Collectors.toSet());
        Set<String> set2 = list2.stream().map(String::toLowerCase).collect(Collectors.toSet());

        long commonCount = set1.stream().filter(set2::contains).count();
        int maxSize = Math.max(set1.size(), set2.size());

        return (commonCount * 100.0) / maxSize;
    }

    private List<String> findCommonItems(List<String> list1, List<String> list2) {
        if (list1 == null || list2 == null) return List.of();
        Set<String> set2Lower = list2.stream().map(String::toLowerCase).collect(Collectors.toSet());
        return list1.stream()
                .filter(item -> set2Lower.contains(item.toLowerCase()))
                .toList();
    }

    private double calculateAvailabilityScore(Availability a1, Availability a2) {
        Map<Availability, Integer> scores = Map.of(
                Availability.HIGHLY_AVAILABLE, 4,
                Availability.AVAILABLE, 3,
                Availability.LIMITED, 2,
                Availability.NOT_AVAILABLE, 0
        );
        int s1 = scores.getOrDefault(a1, 0);
        int s2 = scores.getOrDefault(a2, 0);
        int diff = Math.abs(s1 - s2);
        // Closer availability = higher score
        return switch (diff) {
            case 0 -> 100.0;
            case 1 -> 75.0;
            case 2 -> 40.0;
            default -> 10.0;
        };
    }

    private double calculateRatingScore(MentorshipProfile candidate) {
        if (candidate.getRating() == null || candidate.getRatingCount() == null || candidate.getRatingCount() == 0) {
            return 50.0; // Neutral score for unrated
        }
        // Rating 0-5 mapped to 0-100
        double score = (candidate.getRating() / 5.0) * 100.0;
        // Bonus for verified mentors
        if (Boolean.TRUE.equals(candidate.getIsVerified())) {
            score = Math.min(100.0, score + 10.0);
        }
        return score;
    }
}
