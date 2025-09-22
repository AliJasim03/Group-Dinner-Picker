package com.example.dinner_picker_backend.service;

import com.example.dinner_picker_backend.entity.Group;
import com.example.dinner_picker_backend.entity.VotingSession;
import com.example.dinner_picker_backend.repository.GroupRepository;
import com.example.dinner_picker_backend.repository.VotingSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VotingSessionService {

    @Autowired
    private VotingSessionRepository votingSessionRepository;

    @Autowired
    private GroupRepository groupRepository;

    public List<VotingSession> getGroupSessions(Long groupId) {
        return votingSessionRepository.findByGroupIdOrderByCreatedAtDesc(groupId);
    }

    public Optional<VotingSession> getSessionById(Long id) {
        return votingSessionRepository.findById(id);
    }

    public VotingSession createSession(String title, String description, Long groupId, LocalDateTime deadline) {
        Optional<Group> groupOpt = groupRepository.findById(groupId);
        if (groupOpt.isEmpty()) {
            throw new RuntimeException("Group not found");
        }

        VotingSession session = new VotingSession(title, description, groupOpt.get());
        session.setDeadline(deadline);

        return votingSessionRepository.save(session);
    }

    public VotingSession lockSession(Long sessionId, Boolean locked) {
        Optional<VotingSession> sessionOpt = votingSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            throw new RuntimeException("Session not found");
        }

        VotingSession session = sessionOpt.get();
        session.setLocked(locked);
        return votingSessionRepository.save(session);
    }
}