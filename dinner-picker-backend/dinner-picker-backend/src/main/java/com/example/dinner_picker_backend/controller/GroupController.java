package com.example.dinner_picker_backend.controller;

import com.example.dinner_picker_backend.dto.CreateGroupRequest;
import com.example.dinner_picker_backend.entity.Group;
import com.example.dinner_picker_backend.service.GroupService;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class GroupController {

    private static final Logger logger = LoggerFactory.getLogger(GroupController.class);

    @Autowired
    private GroupService groupService;

    @GetMapping
    public ResponseEntity<?> getAllGroups() {
        try {
            logger.info("Fetching all groups");
            List<Group> groups = groupService.getAllGroups();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", groups);
            response.put("total", groups.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching groups: ", e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to fetch groups");
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGroup(@PathVariable Long id) {
        try {
            logger.info("Fetching group with ID: {}", id);

            if (id == null || id <= 0) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Invalid group ID");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            return groupService.getGroupById(id)
                    .map(group -> {
                        Map<String, Object> response = new HashMap<>();
                        response.put("success", true);
                        response.put("data", group);
                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> {
                        Map<String, Object> errorResponse = new HashMap<>();
                        errorResponse.put("success", false);
                        errorResponse.put("error", "Group not found");
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            logger.error("Error fetching group with ID {}: ", id, e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to fetch group");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping
    public ResponseEntity<?> createGroup(@Valid @RequestBody CreateGroupRequest request, BindingResult bindingResult) {
        Map<String, Object> response = new HashMap<>();

        try {
            logger.info("Creating new group: {}", request.getName());

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

            // Additional custom validation
            if (request.getName() != null && request.getName().trim().length() > 50) {
                response.put("success", false);
                response.put("error", "Group name must be less than 50 characters");
                return ResponseEntity.badRequest().body(response);
            }

            if (request.getDescription() != null && request.getDescription().length() > 200) {
                response.put("success", false);
                response.put("error", "Description must be less than 200 characters");
                return ResponseEntity.badRequest().body(response);
            }

            // Create the group - For now, assume user ID is 1 (single user application)
            Group group = groupService.createGroup(
                    request.getName().trim(),
                    request.getDescription() != null ? request.getDescription().trim() : null,
                    request.getEmojiIcon(),
                    request.getColorTheme(),
                    1L
            );

            logger.info("Successfully created group with ID: {}", group.getId());

            response.put("success", true);
            response.put("group", group);
            response.put("message", "Group created successfully");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            logger.warn("Invalid argument for group creation: ", e);
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            logger.error("Error creating group: ", e);
            response.put("success", false);
            response.put("error", "Failed to create group");
            response.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserGroups(@PathVariable Long userId) {
        try {
            logger.info("Fetching groups for user ID: {}", userId);

            if (userId == null || userId <= 0) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Invalid user ID");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            List<Group> groups = groupService.getUserGroups(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", groups);
            response.put("total", groups.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error fetching groups for user {}: ", userId, e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to fetch user groups");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGroup(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();

        try {
            logger.info("Deleting group with ID: {}", id);

            if (id == null || id <= 0) {
                response.put("success", false);
                response.put("error", "Invalid group ID");
                return ResponseEntity.badRequest().body(response);
            }

            boolean deleted = groupService.deleteGroup(id);

            if (deleted) {
                logger.info("Successfully deleted group with ID: {}", id);
                response.put("success", true);
                response.put("message", "Group deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("error", "Group not found");
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            logger.error("Error deleting group with ID {}: ", id, e);
            response.put("success", false);
            response.put("error", "Failed to delete group");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}