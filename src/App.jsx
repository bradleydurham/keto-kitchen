import { useState, useEffect } from "react";
import { useRecipes } from "./hooks/useRecipes.js";
import { CATEGORIES } from "./data/recipes.js";
import RecipeCard from "./components/RecipeCard.jsx";
import AddRecipeModal from "./components/AddRecipeModal.jsx";
import ShoppingListModal from "./components/ShoppingListModal.jsx";
import { LeafIcon, PlusIcon, CartIcon } from "./components/Icons.jsx";
import { GoogleLogin } from "@react-oauth/google";

const ALLOWED_EMAIL = "bradley@6smaker.com";

function parseJwt(token) {
  const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
}

const LIGHT_THEME = {
  "--bg": "#faf7f4",
  "--card": "#ffffff",
  "--border": "#ede8e3",
  "--text": "#2c1f17",
  "--text-muted": "#8a7060",
  "--accent": "#7a6b4e",
  "--accent-light": "#f5f0e8",
  "--tag-bg": "#f0ebe4",
  "--font-display": "'Playfair Display', Georgia, serif",
};

const DARK_THEME = {
  "--bg": "#1a1410",
  "--card": "#251e18",
  "--border": "#3a2e24",
  "--text": "#f0e8df",
  "--text-muted": "#9a8070",
  "--accent": "#c9a96e",
  "--accent-light": "#2a2218",
  "--tag-bg": "#2e2520",
  "--font-display": "'Playfair Display', Georgia, serif",
};

export default function KetoRecipes() {
  const { recipes, loading, addRecipe, deleteRecipe } = useRecipes();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("keto-user")) || null; }
    catch { return null; }
  });
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (user) localStorage.setItem("keto-user", JSON.stringify(user));
    else localStorage.removeItem("keto-user");
  }, [user]);

  const handleLoginSuccess = (response) => {
    const payload = parseJwt(response.credential);
    if (payload.email !== ALLOWED_EMAIL) {
      setAuthError("Access denied.");
      return;
    }
    setAuthError("");
    setUser({ name: payload.name, email: payload.email, picture: payload.picture });
  };

  const handleSignOut = () => setUser(null);

  const theme = darkMode ? DARK_THEME : LIGHT_THEME;

  const filtered = recipes.filter((r) => {
    const matchesCat = category === "All" || r.category === category;
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      r.title.toLowerCase().includes(q) ||
      r.tags?.some((t) => t.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const handleAdd = (recipe) => {
    addRecipe(recipe);
    setShowAdd(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c0a890; border-radius: 3px; }
      `}</style>

      <div style={{
        ...theme,
        background: "var(--bg)",
        minHeight: "100vh",
        fontFamily: "'Helvetica Neue', sans-serif",
        transition: "background 0.3s",
      }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ padding: "28px 28px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ color: "var(--accent)" }}><LeafIcon /></div>
            <div>
              <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "24px", color: "var(--text)", lineHeight: 1 }}>
                Keto Kitchen
              </h1>
              <p style={{ margin: "3px 0 0", fontSize: "12px", color: "var(--text-muted)", letterSpacing: "0.04em" }}>
                {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"} saved
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button
              onClick={() => setShowShoppingList(true)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)",
                padding: "10px 16px", borderRadius: "10px", fontSize: "13px",
                fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <CartIcon /> Shop
            </button>
            {user ? (
              <>
                <button
                  onClick={() => setShowAdd(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    background: "var(--accent)", color: "white", border: "none",
                    padding: "10px 16px", borderRadius: "10px", fontSize: "13px",
                    fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  <PlusIcon /> Add Recipe
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <img src={user.picture} alt={user.name} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid var(--border)" }} />
                  <button
                    onClick={handleSignOut}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", padding: 0 }}
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                <GoogleLogin onSuccess={handleLoginSuccess} onError={() => setAuthError("Sign-in failed.")} size="medium" shape="pill" />
                {authError && <span style={{ fontSize: "11px", color: "#c0392b" }}>{authError}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Search + Filter */}
        <div style={{ padding: "20px 28px 0" }}>
          <input
            style={{
              width: "100%", padding: "11px 14px", border: "1px solid var(--border)",
              borderRadius: "10px", fontSize: "14px", background: "var(--card)",
              color: "var(--text)", outline: "none", marginBottom: "14px", fontFamily: "inherit",
            }}
            placeholder="Search recipes or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: "7px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                  border: "1px solid var(--border)", cursor: "pointer", fontFamily: "inherit",
                  background: category === cat ? "var(--accent)" : "var(--card)",
                  color: category === cat ? "white" : "var(--text-muted)",
                  transition: "all 0.15s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Recipe List */}
        <div style={{ padding: "20px 28px 40px", display: "grid", gap: "14px" }}>
          {loading ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px" }}>Loading your recipes...</p>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🥗</div>
              <p style={{ fontSize: "15px" }}>No recipes found. Add your first one!</p>
            </div>
          ) : (
            filtered.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} onDelete={deleteRecipe} />
            ))
          )}
        </div>

        {showAdd && <AddRecipeModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
        {showShoppingList && <ShoppingListModal recipes={recipes} onClose={() => setShowShoppingList(false)} />}
        </div>
      </div>
    </>
  );
}
