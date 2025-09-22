package com.example.dinner_picker_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @Email(message = "Valid email is required")
    @Column(unique = true, nullable = false)
    private String email;

    private String avatar; // URL or emoji

/*
    @ManyToMany(mappedBy = "members")
    @JsonIgnore
    private Set<Group> groups = new HashSet<>();
*/

    // Constructors
    public User() {}

    public User(String name, String email, String avatar) {
        this.name = name;
        this.email = email;
        this.avatar = avatar;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

/*    public Set<Group> getGroups() { return groups; }
    public void setGroups(Set<Group> groups) { this.groups = groups; }*/
}