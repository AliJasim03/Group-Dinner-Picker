package com.example.dinner_picker_backend.controller;

import com.example.dinner_picker_backend.dto.AddOptionRequest;
import com.example.dinner_picker_backend.dto.LockRequest;
import com.example.dinner_picker_backend.dto.VoteRequest;
import com.example.dinner_picker_backend.entity.Option;
import com.example.dinner_picker_backend.service.DinnerPickerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class DinnerPickerController {

    @Autowired
    private DinnerPickerService dinnerPickerService;

    // Original endpoints for backward compatibility
    @GetMapping("/options")
    public ResponseEntity<List<Option>> getOptions() {
        try {
            List<Option> options = dinnerPickerService.getAllOptions();
            return ResponseEntity.ok(options);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/options")
    public ResponseEntity<Map<String, Object>> addOption(@Valid @RequestBody AddOptionRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            Option option;

            // If votingSessionId is provided, use new method
            if (request.getVotingSessionId() != null) {
                option = dinnerPickerService.addOptionToSession(
                        request.getName(),
                        request.getLink(),
                        request.getImageUrl(),
                        request.getCuisine(),
                        request.getPriceRange(),
                        request.getVotingSessionId()
                );
            } else {
                // Use old method for backward compatibility
                option = dinnerPickerService.addOption(request.getName(), request.getLink());
            }

            response.put("success", true);
            response.put("option", option);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/vote")
    public ResponseEntity<Map<String, Object>> vote(@Valid @RequestBody VoteRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            dinnerPickerService.vote(request.getOptionId(), request.getDelta());
            response.put("success", true);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/lock")
    public ResponseEntity<Map<String, Object>> lockVoting(@Valid @RequestBody LockRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            dinnerPickerService.lockVoting(request.getLocked());
            response.put("success", true);
            response.put("locked", request.getLocked());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/winner")
    public ResponseEntity<Map<String, Object>> getWinner() {
        Map<String, Object> response = new HashMap<>();

        try {
            Option winner = dinnerPickerService.getWinner();
            response.put("winner", winner);
            response.put("locked", dinnerPickerService.isVotingLocked());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("locked", dinnerPickerService.isVotingLocked());
        response.put("totalOptions", dinnerPickerService.getAllOptions().size());
        return ResponseEntity.ok(response);
    }
}