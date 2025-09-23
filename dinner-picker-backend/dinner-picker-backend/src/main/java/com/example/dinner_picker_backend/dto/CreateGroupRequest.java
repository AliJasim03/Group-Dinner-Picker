package com.example.dinner_picker_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public class CreateGroupRequest {

    @NotBlank(message = "Group name is required")
    @Size(min = 2, max = 50, message = "Group name must be between 2 and 50 characters")
    private String name;

    @Size(max = 200, message = "Description must be less than 200 characters")
    private String description;

    @Pattern(regexp = "^.{1,4}$", message = "Emoji icon must be 1-4 characters")
    private String emojiIcon = "🍽️";

    @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", message = "Color theme must be a valid hex color")
    private String colorTheme = "#667eea";

    // Constructors
    public CreateGroupRequest() {}

    public CreateGroupRequest(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public CreateGroupRequest(String name, String description, String emojiIcon, String colorTheme) {
        this.name = name;
        this.description = description;
        this.emojiIcon = emojiIcon;
        this.colorTheme = colorTheme;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEmojiIcon() {
        return emojiIcon;
    }

    public void setEmojiIcon(String emojiIcon) {
        this.emojiIcon = emojiIcon != null ? emojiIcon : "🍽️";
    }

    public String getColorTheme() {
        return colorTheme;
    }

    public void setColorTheme(String colorTheme) {
        this.colorTheme = colorTheme != null ? colorTheme : "#667eea";
    }

    // Utility methods
    public boolean isValid() {
        return name != null && !name.trim().isEmpty() && name.trim().length() >= 2 && name.trim().length() <= 50;
    }

    @Override
    public String toString() {
        return "CreateGroupRequest{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", emojiIcon='" + emojiIcon + '\'' +
                ", colorTheme='" + colorTheme + '\'' +
                '}';
    }
}