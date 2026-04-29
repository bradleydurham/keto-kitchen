import { useState, useEffect } from "react";
import { INITIAL_RECIPES } from "../data/recipes.js";

const STORAGE_KEY = "keto-recipes";

export function useRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setRecipes(stored ? JSON.parse(stored) : INITIAL_RECIPES);
    } catch {
      setRecipes(INITIAL_RECIPES);
    }
    setLoading(false);
  }, []);

  function saveRecipes(updated) {
    setRecipes(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save recipes:", e);
    }
  }

  function addRecipe(recipe) {
    saveRecipes([...recipes, recipe]);
  }

  function deleteRecipe(id) {
    saveRecipes(recipes.filter((r) => r.id !== id));
  }

  return { recipes, loading, addRecipe, deleteRecipe };
}
