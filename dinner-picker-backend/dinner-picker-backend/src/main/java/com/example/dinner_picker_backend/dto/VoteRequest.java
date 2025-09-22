package com.example.dinner_picker_backend.dto;

import jakarta.validation.constraints.NotNull;

public class VoteRequest {
    @NotNull(message = "Option ID is required")
    private Long optionId;

    @NotNull(message = "Delta is required")
    private Integer delta;

    // Constructors
    public VoteRequest() {}

    public VoteRequest(Long optionId, Integer delta) {
        this.optionId = optionId;
        this.delta = delta;
    }

    // Getters and Setters
    public Long getOptionId() { return optionId; }
    public void setOptionId(Long optionId) { this.optionId = optionId; }

    public Integer getDelta() { return delta; }
    public void setDelta(Integer delta) { this.delta = delta; }
}
