package com.example.dinner_picker_backend.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateGroupRequest {
    @NotBlank(message = "Group name is required")
    private String name;

    private String description;
    private String emojiIcon = "🍽️";
    private String colorTheme = "#667eea";

    // Constructors, getters, setters
    public CreateGroupRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getEmojiIcon() { return emojiIcon; }
    public void setEmojiIcon(String emojiIcon) { this.emojiIcon = emojiIcon; }

    public String getColorTheme() { return colorTheme; }
    public void setColorTheme(String colorTheme) { this.colorTheme = colorTheme; }
}