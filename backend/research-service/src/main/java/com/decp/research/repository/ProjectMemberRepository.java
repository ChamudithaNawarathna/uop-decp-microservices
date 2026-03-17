package com.decp.research.repository;

import com.decp.research.model.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
    List<ProjectMember> findByResearchId(Long researchId);
    void deleteByResearchId(Long researchId);
}
