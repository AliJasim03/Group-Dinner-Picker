package com.example.dinner_picker_backend.repository;

import com.example.dinner_picker_backend.entity.VotingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VotingSessionRepository extends JpaRepository<VotingSession, Long> {

    List<VotingSession> findByGroupIdOrderByCreatedAtDesc(Long groupId);

    @Query("SELECT vs FROM VotingSession vs WHERE vs.group.id = :groupId AND vs.locked = false ORDER BY vs.createdAt DESC")
    List<VotingSession> findActiveSessionsByGroupId(Long groupId);
}