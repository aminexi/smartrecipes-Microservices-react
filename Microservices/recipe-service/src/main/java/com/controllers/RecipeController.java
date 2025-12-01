package com.controllers;

import com.dto.CreateRecipeRequest;
import com.dto.UpdateRecipeRequest;
import com.entities.Recipe;
import com.services.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService service;

    @PostMapping
    public Recipe create(@RequestBody CreateRecipeRequest req) {
        return service.createRecipe(req);
    }

    @PutMapping("/{id}")
    public Recipe update(@PathVariable Long id, @RequestBody UpdateRecipeRequest req) {
        return service.updateRecipe(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteRecipe(id);
    }

    @GetMapping("/{id}")
    public Recipe findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping
    public List<Recipe> findAll() {
        return service.findAll();
    }

    @GetMapping("/category/{category}")
    public List<Recipe> findByCategory(@PathVariable String category) {
        return service.findByCategory(category);
    }

    @GetMapping("/user/{userId}")
    public List<Recipe> findByUser(@PathVariable Long userId) {
        return service.findByUser(userId);
    }
}
