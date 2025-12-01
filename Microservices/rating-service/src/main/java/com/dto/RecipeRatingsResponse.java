package com.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class RecipeRatingsResponse {
    private List<RatingResponse> ratings;
    private double averageRating;
}
