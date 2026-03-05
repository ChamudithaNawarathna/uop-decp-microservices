package com.decp.mentorship.repository;

import com.decp.mentorship.model.MentorshipRequest;
import com.decp.mentorship.model.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorshipRequestRepository extends JpaRepository<MentorshipRequest, Long> {

    List<MentorshipRequest> findByMenteeIdOrderByCreatedAtDesc(Long menteeId);

    List<MentorshipRequest> findByMentorIdOrderByCreatedAtDesc(Long mentorId);

    @Query("SELECT r FROM MentorshipRequest r WHERE (r.menteeId = :userId OR r.mentorId = :userId) ORDER BY r.createdAt DESC")
    List<MentorshipRequest> findByUserId(@Param("userId") Long userId);

    List<MentorshipRequest> findByStatus(RequestStatus status);

    @Query("SELECT r FROM MentorshipRequest r WHERE r.mentorId = :mentorId AND r.status = 'PENDING' ORDER BY r.createdAt DESC")
    List<MentorshipRequest> findPendingRequestsForMentor(@Param("mentorId") Long mentorId);

    @Query("SELECT r FROM MentorshipRequest r WHERE r.menteeId = :menteeId AND r.mentorId = :mentorId AND r.status = 'PENDING'")
    List<MentorshipRequest> findPendingBetween(@Param("menteeId") Long menteeId, @Param("mentorId") Long mentorId);
}
