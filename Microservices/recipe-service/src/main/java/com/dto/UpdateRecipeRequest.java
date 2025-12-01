package com.dto;

import lombok.Data;

@Data
public class UpdateRecipeRequest {
    private String title;
    private String description;
    private String ingredients;
    private String steps;
    private String category;
}
