package com.decp.mentorship.repository;

import com.decp.mentorship.model.FeedbackRole;
import com.decp.mentorship.model.MentorshipFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorshipFeedbackRepository extends JpaRepository<MentorshipFeedback, Long> {

    List<MentorshipFeedback> findByRelationshipIdOrderByCreatedAtDesc(Long relationshipId);

    List<MentorshipFeedback> findByRelationshipIdAndGivenByRole(Long relationshipId, FeedbackRole givenByRole);

    @Query("SELECT AVG(f.rating) FROM MentorshipFeedback f " +
           "JOIN MentorshipRelationship r ON f.relationshipId = r.id " +
           "WHERE r.mentorId = :mentorId AND f.givenByRole = 'MENTEE'")
    Double calculateAverageRatingForMentor(@Param("mentorId") Long mentorId);

    @Query("SELECT COUNT(f) FROM MentorshipFeedback f " +
           "JOIN MentorshipRelationship r ON f.relationshipId = r.id " +
           "WHERE r.mentorId = :mentorId AND f.givenByRole = 'MENTEE'")
    Long countRatingsForMentor(@Param("mentorId") Long mentorId);
}
