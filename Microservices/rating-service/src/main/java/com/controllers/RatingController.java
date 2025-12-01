package com.controllers;

import com.dto.CreateRatingRequest;
import com.dto.RatingResponse;
import com.dto.RecipeRatingsResponse;
import com.entities.Rating;
import com.services.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService service;

    @PostMapping
    public RatingResponse rate(@RequestBody CreateRatingRequest req) {
        return service.addRating(req);
    }
    @GetMapping
    public List<Rating> getAllRatings() {
        return service.getAllRatings();
    }


    @GetMapping("/recipe/{id}")
    public List<Rating> getRatings(@PathVariable Long id) {
        return service.getRatingsForRecipe(id);
    }

    @GetMapping("/test")
    public String test() {
        return "Rating Service is running!";
    }

    // ✅ Fixed: return RecipeRatingsResponse instead of RatingResponse
    @GetMapping("/recipe/{id}/all")
    public RecipeRatingsResponse getRatingsAndAverage(@PathVariable Long id) {
        return service.getRatingsWithAverage(id);
    }
}
