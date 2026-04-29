# Keto Kitchen — Claude Code Project

A personal keto recipe collection and meal planning app focused on salads and bowls.

## Project Priorities
- **Meal-prep friendliness** — recipes should work for Sunday batch cooking
- **Low net carbs** — all recipes target <10g net carbs per serving
- **Work-lunch portability** — dressings/sauces pack separately, no reheating required

## Stack
- React 18 + Vite
- No external UI libraries — inline styles with CSS custom properties (theme vars)
- localStorage for persistence (key: `"keto-recipes"`)

## Project Structure

```
src/
  App.jsx                     # Root component — layout + state orchestration
  main.jsx                    # ReactDOM entry point
  data/
    recipes.js                # INITIAL_RECIPES seed data + CATEGORIES constant
  hooks/
    useRecipes.js             # localStorage persistence hook (add, delete, load)
  components/
    Icons.jsx                 # All SVG icon components
    RecipeCard.jsx            # Expandable recipe card
    AddRecipeModal.jsx        # Add recipe form modal
    ShoppingListModal.jsx     # Multi-recipe shopping list builder
```

## Recipe Data Shape

```js
{
  id: "recipe-001",           // string — "recipe-" + timestamp for new ones
  title: "...",
  category: "Salads & Bowls", // must match a value in CATEGORIES
  prepTime: "15 min",
  cookTime: "10 min",
  servings: 2,
  netCarbs: "~5g",
  description: "...",
  ingredients: [              // strings; section headers use em-dash prefix: "— Dressing —"
    "4 cups romaine",
    "— Dressing —",
    "3 tbsp olive oil",
  ],
  steps: ["..."],             // array of instruction strings
  notes: "...",               // optional meal-prep/storage tip
  tags: ["Meal Prep", "High Protein", "Gluten-Free"],
}
```

## Theme System

CSS custom properties set on the root `<div>` — no separate CSS file needed.

| Variable | Purpose |
|---|---|
| `--bg` | Page background |
| `--card` | Card / modal background |
| `--border` | Borders and dividers |
| `--text` | Primary text |
| `--text-muted` | Secondary / metadata text |
| `--accent` | Brand color (tags, bullets, buttons) |
| `--accent-light` | Tinted accent background |
| `--tag-bg` | Neutral tag pill background |
| `--font-display` | Serif display font (Playfair Display) |

Light and dark theme objects live in `App.jsx` as `LIGHT_THEME` / `DARK_THEME`.

## Common Tasks for Claude Code

**Add a new recipe** → append to `INITIAL_RECIPES` in `src/data/recipes.js`

**Add a new category** → add the string to the `CATEGORIES` array in `src/data/recipes.js`

**Change accent color** → update `--accent` and `--accent-light` in both theme objects in `App.jsx`

**Add a new tag** → tags are free-form strings; just use them in the recipe data

## Dev Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```
