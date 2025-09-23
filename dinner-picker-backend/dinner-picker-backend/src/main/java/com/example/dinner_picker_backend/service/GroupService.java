package com.example.dinner_picker_backend.service;

import com.example.dinner_picker_backend.entity.Group;
import com.example.dinner_picker_backend.entity.User;
import com.example.dinner_picker_backend.repository.GroupRepository;
import com.example.dinner_picker_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class GroupService {

    private static final Logger logger = LoggerFactory.getLogger(GroupService.class);

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Group> getAllGroups() {
        try {
            return groupRepository.findAllOrderByCreatedAtDesc();
        } catch (Exception e) {
            logger.error("Error fetching all groups: ", e);
            throw new RuntimeException("Failed to fetch groups", e);
        }
    }

    public Optional<Group> getGroupById(Long id) {
        try {
            if (id == null || id <= 0) {
                throw new IllegalArgumentException("Invalid group ID: " + id);
            }
            return groupRepository.findById(id);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error fetching group with ID {}: ", id, e);
            throw new RuntimeException("Failed to fetch group", e);
        }
    }

    public Group createGroup(String name, String description, String emojiIcon, String colorTheme, Long userId) {
        try {
            // Validate input parameters
            if (name == null || name.trim().isEmpty()) {
                throw new IllegalArgumentException("Group name cannot be empty");
            }

            if (name.trim().length() < 2) {
                throw new IllegalArgumentException("Group name must be at least 2 characters");
            }

            if (name.trim().length() > 50) {
                throw new IllegalArgumentException("Group name must be less than 50 characters");
            }

            if (description != null && description.length() > 200) {
                throw new IllegalArgumentException("Description must be less than 200 characters");
            }

            // Check if group with same name exists for this user
            if (userId != null) {
                List<Group> existingGroups = groupRepository.findByMembersId(userId);
                boolean nameExists = existingGroups.stream()
                        .anyMatch(group -> group.getName().equalsIgnoreCase(name.trim()));

                if (nameExists) {
                    throw new IllegalArgumentException("You already have a group with this name");
                }
            }

            // Create the group
            Group group = new Group();
            group.setName(name.trim());
            group.setDescription(description != null ? description.trim() : null);
            group.setEmojiIcon(emojiIcon != null ? emojiIcon : "🍽️");
            group.setColorTheme(colorTheme != null ? colorTheme : "#667eea");
            group.setCreatedAt(LocalDateTime.now());

            // Add current user to the group
            if (userId != null) {
                Optional<User> userOpt = userRepository.findById(userId);
                if (userOpt.isPresent()) {
                    group.getMembers().add(userOpt.get());
                    logger.info("Added user {} to group {}", userId, group.getName());
                } else {
                    logger.warn("User with ID {} not found when creating group", userId);
                }
            }

            Group savedGroup = groupRepository.save(group);
            logger.info("Successfully created group: {} with ID: {}", savedGroup.getName(), savedGroup.getId());

            return savedGroup;

        } catch (IllegalArgumentException e) {
            logger.warn("Invalid input for group creation: ", e);
            throw e;
        } catch (Exception e) {
            logger.error("Error creating group: ", e);
            throw new RuntimeException("Failed to create group", e);
        }
    }

    public List<Group> getUserGroups(Long userId) {
        try {
            if (userId == null || userId <= 0) {
                throw new IllegalArgumentException("Invalid user ID: " + userId);
            }

            return groupRepository.findByMembersId(userId);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error fetching groups for user {}: ", userId, e);
            throw new RuntimeException("Failed to fetch user groups", e);
        }
    }

    public Group joinGroup(Long groupId, Long userId) {
        try {
            if (groupId == null || groupId <= 0) {
                throw new IllegalArgumentException("Invalid group ID: " + groupId);
            }

            if (userId == null || userId <= 0) {
                throw new IllegalArgumentException("Invalid user ID: " + userId);
            }

            Optional<Group> groupOpt = groupRepository.findById(groupId);
            Optional<User> userOpt = userRepository.findById(userId);

            if (groupOpt.isEmpty()) {
                throw new RuntimeException("Group not found with ID: " + groupId);
            }

            if (userOpt.isEmpty()) {
                throw new RuntimeException("User not found with ID: " + userId);
            }

            Group group = groupOpt.get();
            User user = userOpt.get();

            // Check if user is already a member
            if (group.getMembers().contains(user)) {
                throw new IllegalArgumentException("User is already a member of this group");
            }

            group.getMembers().add(user);
            Group savedGroup = groupRepository.save(group);

            logger.info("User {} joined group {}", userId, groupId);
            return savedGroup;

        } catch (IllegalArgumentException e) {
            logger.warn("Invalid input for joining group: ", e);
            throw e;
        } catch (Exception e) {
            logger.error("Error adding user {} to group {}: ", userId, groupId, e);
            throw new RuntimeException("Failed to join group", e);
        }
    }

    public boolean deleteGroup(Long groupId) {
        try {
            if (groupId == null || groupId <= 0) {
                throw new IllegalArgumentException("Invalid group ID: " + groupId);
            }

            Optional<Group> groupOpt = groupRepository.findById(groupId);

            if (groupOpt.isEmpty()) {
                logger.warn("Attempted to delete non-existent group with ID: {}", groupId);
                return false;
            }

            Group group = groupOpt.get();

            // Check if group has active voting sessions
            if (group.getVotingSessions() != null && !group.getVotingSessions().isEmpty()) {
                boolean hasActiveSessions = group.getVotingSessions().stream()
                        .anyMatch(session -> !Boolean.TRUE.equals(session.getLocked()));

                if (hasActiveSessions) {
                    throw new IllegalArgumentException("Cannot delete group with active voting sessions");
                }
            }

            groupRepository.delete(group);
            logger.info("Successfully deleted group: {} with ID: {}", group.getName(), groupId);

            return true;

        } catch (IllegalArgumentException e) {
            logger.warn("Invalid input for deleting group: ", e);
            throw e;
        } catch (Exception e) {
            logger.error("Error deleting group with ID {}: ", groupId, e);
            throw new RuntimeException("Failed to delete group", e);
        }
    }

    public Group updateGroup(Long groupId, String name, String description, String emojiIcon, String colorTheme) {
        try {
            if (groupId == null || groupId <= 0) {
                throw new IllegalArgumentException("Invalid group ID: " + groupId);
            }

            Optional<Group> groupOpt = groupRepository.findById(groupId);

            if (groupOpt.isEmpty()) {
                throw new RuntimeException("Group not found with ID: " + groupId);
            }

            Group group = groupOpt.get();

            // Update fields if provided
            if (name != null && !name.trim().isEmpty()) {
                if (name.trim().length() < 2 || name.trim().length() > 50) {
                    throw new IllegalArgumentException("Group name must be between 2 and 50 characters");
                }
                group.setName(name.trim());
            }

            if (description != null) {
                if (description.length() > 200) {
                    throw new IllegalArgumentException("Description must be less than 200 characters");
                }
                group.setDescription(description.trim());
            }

            if (emojiIcon != null) {
                group.setEmojiIcon(emojiIcon);
            }

            if (colorTheme != null) {
                group.setColorTheme(colorTheme);
            }

            Group updatedGroup = groupRepository.save(group);
            logger.info("Successfully updated group: {} with ID: {}", updatedGroup.getName(), groupId);

            return updatedGroup;

        } catch (IllegalArgumentException e) {
            logger.warn("Invalid input for updating group: ", e);
            throw e;
        } catch (Exception e) {
            logger.error("Error updating group with ID {}: ", groupId, e);
            throw new RuntimeException("Failed to update group", e);
        }
    }
}