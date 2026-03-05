package com.decp.mentorship.repository;

import com.decp.mentorship.model.MentorshipRelationship;
import com.decp.mentorship.model.RelationshipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorshipRelationshipRepository extends JpaRepository<MentorshipRelationship, Long> {

    @Query("SELECT r FROM MentorshipRelationship r WHERE (r.mentorId = :userId OR r.menteeId = :userId) ORDER BY r.createdAt DESC")
    List<MentorshipRelationship> findByUserId(@Param("userId") Long userId);

    @Query("SELECT r FROM MentorshipRelationship r WHERE (r.mentorId = :userId OR r.menteeId = :userId) AND r.status = :status ORDER BY r.createdAt DESC")
    List<MentorshipRelationship> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") RelationshipStatus status);

    @Query("SELECT r FROM MentorshipRelationship r WHERE r.status = 'ACTIVE' AND (r.mentorId = :userId OR r.menteeId = :userId)")
    List<MentorshipRelationship> findActiveRelationships(@Param("userId") Long userId);

    List<MentorshipRelationship> findByStatus(RelationshipStatus status);

    @Query("SELECT r FROM MentorshipRelationship r WHERE r.mentorId = :mentorId AND r.menteeId = :menteeId AND r.status = 'ACTIVE'")
    List<MentorshipRelationship> findActiveBetween(@Param("mentorId") Long mentorId, @Param("menteeId") Long menteeId);
}
