package com.dto;

import lombok.Data;

@Data
public class CreateRatingRequest {
    private Long recipeId;
    private Long userId;
    private int stars;
    private String comment;
}
