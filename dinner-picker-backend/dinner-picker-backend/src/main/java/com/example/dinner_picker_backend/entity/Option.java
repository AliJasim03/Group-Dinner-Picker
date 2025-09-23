package com.example.dinner_picker_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "options")
public class Option {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Link is required")
    @Column(nullable = false)
    private String link;

    private String imageUrl;

    private String cuisine; // e.g., "Italian", "Mexican"

    @Column(name = "price_range")
    private String priceRange; // "$", "$$", "$$$"

    @NotNull
    @Column(nullable = false)
    private Integer votes = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voting_session_id")
    @JsonIgnore
    private VotingSession votingSession;

    // Constructors
    public Option() {}

    // Constructor for backward compatibility (name, link only)
    public Option(String name, String link) {
        this.name = name;
        this.link = link;
        this.votes = 0;
        this.createdAt = LocalDateTime.now();
    }

    // Constructor with voting session
    public Option(String name, String link, VotingSession votingSession) {
        this.name = name;
        this.link = link;
        this.votingSession = votingSession;
        this.votes = 0;
        this.createdAt = LocalDateTime.now();
    }

    // Full constructor
    public Option(String name, String link, String imageUrl, String cuisine, String priceRange, VotingSession votingSession) {
        this.name = name;
        this.link = link;
        this.imageUrl = imageUrl;
        this.cuisine = cuisine;
        this.priceRange = priceRange;
        this.votingSession = votingSession;
        this.votes = 0;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public Integer getVotes() { return votes; }
    public void setVotes(Integer votes) { this.votes = votes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public VotingSession getVotingSession() { return votingSession; }
    public void setVotingSession(VotingSession votingSession) { this.votingSession = votingSession; }

    // Helper methods
    public void incrementVotes() { this.votes++; }
    public void decrementVotes() { this.votes = Math.max(0, this.votes - 1); }
}