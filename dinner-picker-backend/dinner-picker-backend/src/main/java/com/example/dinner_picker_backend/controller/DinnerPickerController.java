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
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class DinnerPickerController {

    private static final Logger logger = LoggerFactory.getLogger(DinnerPickerController.class);

    @Autowired
    private DinnerPickerService dinnerPickerService;

    // Get all options (for backward compatibility)
    @GetMapping("/options")
    public ResponseEntity<?> getOptions() {
        try {
            logger.info("Fetching all options");
            List<Option> options = dinnerPickerService.getAllOptions();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", options);
            response.put("total", options.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching options: ", e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to fetch options");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Get options by session
    @GetMapping("/sessions/{sessionId}/options")
    public ResponseEntity<?> getSessionOptions(@PathVariable Long sessionId) {
        try {
            logger.info("Fetching options for session ID: {}", sessionId);

            if (sessionId == null || sessionId <= 0) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Invalid session ID");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            List<Option> options = dinnerPickerService.getSessionOptions(sessionId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", options);
            response.put("total", options.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching options for session {}: ", sessionId, e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to fetch session options");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Add option to session
    @PostMapping("/options")
    public ResponseEntity<?> addOption(@Valid @RequestBody AddOptionRequest request, BindingResult bindingResult) {
        Map<String, Object> response = new HashMap<>();

        try {
            logger.info("Adding new option: {}", request.getName());

            // Handle validation errors
            if (bindingResult.hasErrors()) {
                Map<String, String> errors = new HashMap<>();

                for (FieldError error : bindingResult.getFieldErrors()) {
                    errors.put(error.getField(), error.getDefaultMessage());
                }

                response.put("success", false);
                response.put("error", "Validation failed");
                response.put("errors", errors);

                return ResponseEntity.badRequest().body(response);
            }

            Option option;

            // If votingSessionId is provided, use new method (preferred)
            if (request.getVotingSessionId() != null) {
                logger.info("Adding option to session ID: {}", request.getVotingSessionId());
                option = dinnerPickerService.addOptionToSession(
                        request.getName().trim(),
                        request.getLink().trim(),
                        request.getImageUrl(),
                        request.getCuisine(),
                        request.getPriceRange(),
                        request.getVotingSessionId()
                );
            } else {
                // Use old method for backward compatibility
                logger.info("Adding option without session (backward compatibility)");
                option = dinnerPickerService.addOption(
                        request.getName().trim(),
                        request.getLink().trim()
                );
            }

            logger.info("Successfully added option with ID: {}", option.getId());

            response.put("success", true);
            response.put("option", option);
            response.put("message", "Restaurant added successfully");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            logger.warn("Business logic error adding option: ", e);
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (Exception e) {
            logger.error("Error adding option: ", e);
            response.put("success", false);
            response.put("error", "Failed to add restaurant");
            response.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Vote for an option
    @PostMapping("/options/{optionId}/vote")
    public ResponseEntity<?> vote(@PathVariable Long optionId, @Valid @RequestBody VoteRequest request, BindingResult bindingResult) {
        Map<String, Object> response = new HashMap<>();

        try {
            logger.info("Processing vote for option ID: {} with delta: {}", optionId, request.getDelta());

            // Handle validation errors
            if (bindingResult.hasErrors()) {
                Map<String, String> errors = new HashMap<>();

                for (FieldError error : bindingResult.getFieldErrors()) {
                    errors.put(error.getField(), error.getDefaultMessage());
                }

                response.put("success", false);
                response.put("error", "Validation failed");
                response.put("errors", errors);

                return ResponseEntity.badRequest().body(response);
            }

            if (optionId == null || optionId <= 0) {
                response.put("success", false);
                response.put("error", "Invalid option ID");
                return ResponseEntity.badRequest().body(response);
            }

            dinnerPickerService.vote(optionId, request.getDelta());

            logger.info("Successfully processed vote for option ID: {}", optionId);

            response.put("success", true);
            response.put("message", "Vote processed successfully");

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            logger.warn("Business logic error processing vote: ", e);
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (Exception e) {
            logger.error("Error processing vote: ", e);
            response.put("success", false);
            response.put("error", "Failed to process vote");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Legacy vote endpoint (for backward compatibility)
    @PostMapping("/vote")
    public ResponseEntity<?> legacyVote(@Valid @RequestBody VoteRequest request) {
        return vote(request.getOptionId(), request, null);
    }

    // Lock voting globally
    @PostMapping("/lock")
    public ResponseEntity<?> lockVoting(@Valid @RequestBody LockRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            logger.info("Setting global voting lock to: {}", request.getLocked());

            dinnerPickerService.lockVoting(request.getLocked());

            response.put("success", true);
            response.put("locked", request.getLocked());
            response.put("message", request.getLocked() ? "Voting locked" : "Voting unlocked");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error locking/unlocking voting: ", e);
            response.put("success", false);
            response.put("error", "Failed to update voting status");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get winner
    @GetMapping("/winner")
    public ResponseEntity<?> getWinner() {
        try {
            logger.info("Fetching winner");

            Option winner = dinnerPickerService.getWinner();
            boolean isLocked = dinnerPickerService.isVotingLocked();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("winner", winner);
            response.put("locked", isLocked);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error fetching winner: ", e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to fetch winner");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Get voting status
    @GetMapping("/status")
    public ResponseEntity<?> getStatus() {
        try {
            logger.info("Fetching voting status");

            boolean isLocked = dinnerPickerService.isVotingLocked();
            int totalOptions = dinnerPickerService.getAllOptions().size();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("locked", isLocked);
            response.put("totalOptions", totalOptions);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error fetching status: ", e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to fetch status");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}