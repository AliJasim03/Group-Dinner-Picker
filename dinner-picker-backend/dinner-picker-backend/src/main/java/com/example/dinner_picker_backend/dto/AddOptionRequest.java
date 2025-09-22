package com.example.dinner_picker_backend.dto;

import jakarta.validation.constraints.NotBlank;

public class AddOptionRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Link is required")
    private String link;

    private String imageUrl;
    private String cuisine;
    private String priceRange;

    // Optional - for new functionality
    private Long votingSessionId;

    // Constructors
    public AddOptionRequest() {}

    public AddOptionRequest(String name, String link) {
        this.name = name;
        this.link = link;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCuisine() { return cuisine; }
    public void setCuisine(String cuisine) { this.cuisine = cuisine; }

    public String getPriceRange() { return priceRange; }
    public void setPriceRange(String priceRange) { this.priceRange = priceRange; }

    public Long getVotingSessionId() { return votingSessionId; }
    public void setVotingSessionId(Long votingSessionId) { this.votingSessionId = votingSessionId; }
}