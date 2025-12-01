package com.services;

import com.dto.CreateRecipeRequest;
import com.dto.UpdateRecipeRequest;
import com.entities.Recipe;
import com.repositories.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository repo;

    public Recipe createRecipe(CreateRecipeRequest req) {
        Recipe recipe = Recipe.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .ingredients(req.getIngredients())
                .steps(req.getSteps())
                .category(req.getCategory())
                .userId(req.getUserId())
                .build();

        return repo.save(recipe);
    }

    public Recipe updateRecipe(Long id, UpdateRecipeRequest req) {
        Recipe recipe = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        recipe.setTitle(req.getTitle());
        recipe.setDescription(req.getDescription());
        recipe.setIngredients(req.getIngredients());
        recipe.setSteps(req.getSteps());
        recipe.setCategory(req.getCategory());

        return repo.save(recipe);
    }

    public void deleteRecipe(Long id) {
        repo.deleteById(id);
    }

    public Recipe findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
    }

    public List<Recipe> findAll() {
        return repo.findAll();
    }

    public List<Recipe> findByCategory(String category) {
        return repo.findByCategory(category);
    }

    public List<Recipe> findByUser(Long userId) {
        return repo.findByUserId(userId);
    }
}
