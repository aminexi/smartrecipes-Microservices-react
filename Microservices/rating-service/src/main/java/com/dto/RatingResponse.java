package com.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data

@Builder
public class RatingResponse {
    private Long id;
    private Long recipeId;
    private Long userId;
    private int stars;
    private String comment;
}
