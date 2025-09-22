package com.example.dinner_picker_backend.dto;

import jakarta.validation.constraints.NotNull;

public class LockRequest {
    @NotNull(message = "Locked status is required")
    private Boolean locked;

    // Constructors
    public LockRequest() {}

    public LockRequest(Boolean locked) {
        this.locked = locked;
    }

    // Getters and Setters
    public Boolean getLocked() { return locked; }
    public void setLocked(Boolean locked) { this.locked = locked; }
}
