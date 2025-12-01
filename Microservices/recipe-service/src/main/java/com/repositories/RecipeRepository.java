package com.repositories;

import com.entities.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    List<Recipe> findByCategory(String category);

    List<Recipe> findByUserId(Long userId);
}
