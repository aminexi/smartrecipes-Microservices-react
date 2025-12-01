package com.services;

import com.dto.CreateRatingRequest;
import com.dto.RatingResponse;
import com.dto.RecipeRatingsResponse;
import com.entities.Rating;
import com.repositories.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository repo;

    public RatingResponse addRating(CreateRatingRequest req) {
        Rating rating = Rating.builder()
                .recipeId(req.getRecipeId())
                .userId(req.getUserId())
                .stars(req.getStars())
                .comment(req.getComment())
                .build();

        repo.save(rating);

        return RatingResponse.builder()
                .id(rating.getId())
                .recipeId(rating.getRecipeId())
                .userId(rating.getUserId())
                .stars(rating.getStars())
                .comment(rating.getComment())
                .build();
    }

    public List<Rating> getRatingsForRecipe(Long recipeId) {
        return repo.findByRecipeId(recipeId);
    }
    public List<Rating> getAllRatings() {
        return repo.findAll();
    }

    public RecipeRatingsResponse getRatingsWithAverage(Long recipeId) {
        List<Rating> ratings = repo.findByRecipeId(recipeId);

        double average = ratings.stream()
                .mapToInt(Rating::getStars)
                .average()
                .orElse(0.0);

        List<RatingResponse> ratingResponses = ratings.stream()
                .map(r -> RatingResponse.builder()
                        .id(r.getId())
                        .recipeId(r.getRecipeId())
                        .userId(r.getUserId())
                        .stars(r.getStars())
                        .comment(r.getComment())
                        .build())
                .toList();

        return RecipeRatingsResponse.builder()
                .ratings(ratingResponses)
                .averageRating(average)
                .build();
    }


}
