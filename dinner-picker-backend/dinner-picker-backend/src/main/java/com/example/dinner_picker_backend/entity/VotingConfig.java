package com.example.dinner_picker_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "voting_config")
public class VotingConfig {
    @Id
    private Long id = 1L;

    @Column(nullable = false)
    private Boolean locked = false;

    // Constructors
    public VotingConfig() {}

    public VotingConfig(Boolean locked) {
        this.locked = locked;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Boolean getLocked() { return locked; }
    public void setLocked(Boolean locked) { this.locked = locked; }
}
