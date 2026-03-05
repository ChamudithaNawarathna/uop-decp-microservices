package com.decp.mentorship.repository;

import com.decp.mentorship.model.Availability;
import com.decp.mentorship.model.MentorshipProfile;
import com.decp.mentorship.model.MentorshipRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MentorshipProfileRepository extends JpaRepository<MentorshipProfile, Long> {

    Optional<MentorshipProfile> findByUserId(Long userId);

    List<MentorshipProfile> findByRole(MentorshipRole role);

    List<MentorshipProfile> findByAvailability(Availability availability);

    @Query("SELECT p FROM MentorshipProfile p WHERE p.role = :role AND p.availability IN ('HIGHLY_AVAILABLE', 'AVAILABLE') ORDER BY p.rating DESC")
    List<MentorshipProfile> findAvailableByRole(@Param("role") MentorshipRole role);

    @Query("SELECT p FROM MentorshipProfile p WHERE (p.role = 'MENTOR' OR p.role = 'BOTH') AND p.isVerified = true ORDER BY p.rating DESC")
    List<MentorshipProfile> findTopRatedMentors();

    @Query("SELECT p FROM MentorshipProfile p WHERE (p.role = 'MENTOR' OR p.role = 'BOTH') AND p.availability IN ('HIGHLY_AVAILABLE', 'AVAILABLE')")
    List<MentorshipProfile> findAvailableMentors();

    @Query("SELECT p FROM MentorshipProfile p WHERE (p.role = 'MENTEE' OR p.role = 'BOTH') AND p.availability IN ('HIGHLY_AVAILABLE', 'AVAILABLE')")
    List<MentorshipProfile> findAvailableMentees();

    @Query("SELECT p FROM MentorshipProfile p JOIN p.expertise e WHERE LOWER(e) = LOWER(:expertise)")
    List<MentorshipProfile> findByExpertiseContaining(@Param("expertise") String expertise);

    @Query("SELECT p FROM MentorshipProfile p WHERE p.department = :department AND (p.role = 'MENTOR' OR p.role = 'BOTH')")
    List<MentorshipProfile> findMentorsByDepartment(@Param("department") String department);
}
