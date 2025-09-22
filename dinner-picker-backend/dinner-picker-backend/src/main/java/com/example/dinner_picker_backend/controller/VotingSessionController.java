package com.example.dinner_picker_backend.controller;

import com.example.dinner_picker_backend.dto.CreateVotingSessionRequest;
import com.example.dinner_picker_backend.entity.VotingSession;
import com.example.dinner_picker_backend.service.VotingSessionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "http://localhost:3000")
public class VotingSessionController {

    @Autowired
    private VotingSessionService votingSessionService;

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<VotingSession>> getGroupSessions(@PathVariable Long groupId) {
        try {
            List<VotingSession> sessions = votingSessionService.getGroupSessions(groupId);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<VotingSession> getSession(@PathVariable Long id) {
        return votingSessionService.getSessionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createSession(@Valid @RequestBody CreateVotingSessionRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            VotingSession session = votingSessionService.createSession(
                    request.getTitle(),
                    request.getDescription(),
                    request.getGroupId(),
                    request.getDeadline()
            );

            response.put("success", true);
            response.put("session", session);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to create session: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/{id}/lock")
    public ResponseEntity<Map<String, Object>> lockSession(@PathVariable Long id, @RequestBody Map<String, Boolean> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            VotingSession session = votingSessionService.lockSession(id, request.get("locked"));
            response.put("success", true);
            response.put("session", session);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}