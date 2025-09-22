package com.example.dinner_picker_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

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

    @NotNull
    @Column(nullable = false)
    private Integer votes = 0;

    // Constructors
    public Option() {}

    public Option(String name, String link) {
        this.name = name;
        this.link = link;
        this.votes = 0;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }

    public Integer getVotes() { return votes; }
    public void setVotes(Integer votes) { this.votes = votes; }

    // Helper methods
    public void incrementVotes() { this.votes++; }
    public void decrementVotes() { this.votes--; }
}
