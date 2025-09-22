package com.example.dinner_picker_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class CreateVotingSessionRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private LocalDateTime deadline;

    @NotNull(message = "Group ID is required")
    private Long groupId;

    // Constructors, getters, setters
    public CreateVotingSessionRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }

    public Long getGroupId() { return groupId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }
}