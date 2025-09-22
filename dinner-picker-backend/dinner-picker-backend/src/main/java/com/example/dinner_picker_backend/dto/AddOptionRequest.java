package com.example.dinner_picker_backend.dto;

import jakarta.validation.constraints.NotBlank;

public class AddOptionRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Link is required")
    private String link;

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
}
