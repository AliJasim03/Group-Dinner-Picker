package com.example.dinner_picker_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "dinner_groups")
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Group name is required")
    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "emoji_icon")
    private String emojiIcon = "🍽️";

    @Column(name = "color_theme")
    private String colorTheme = "#667eea";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToMany
    @JoinTable(
            name = "group_members",
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> members = new HashSet<>();

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<VotingSession> votingSessions = new ArrayList<>();

    // Constructors
    public Group() {}

    public Group(String name, String description, String emojiIcon, String colorTheme) {
        this.name = name;
        this.description = description;
        this.emojiIcon = emojiIcon;
        this.colorTheme = colorTheme;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getEmojiIcon() { return emojiIcon; }
    public void setEmojiIcon(String emojiIcon) { this.emojiIcon = emojiIcon; }

    public String getColorTheme() { return colorTheme; }
    public void setColorTheme(String colorTheme) { this.colorTheme = colorTheme; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Set<User> getMembers() { return members; }
    public void setMembers(Set<User> members) { this.members = members; }

    public List<VotingSession> getVotingSessions() { return votingSessions; }
    public void setVotingSessions(List<VotingSession> votingSessions) { this.votingSessions = votingSessions; }
}