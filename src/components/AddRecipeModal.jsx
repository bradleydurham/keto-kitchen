import { useState } from "react";
import { CloseIcon } from "./Icons.jsx";
import { CATEGORIES } from "../data/recipes.js";

const inputStyle = {
  width: "100%", padding: "10px 12px", border: "1px solid var(--border)",
  borderRadius: "8px", fontSize: "14px", background: "var(--bg)",
  color: "var(--text)", outline: "none", boxSizing: "border-box",
  fontFamily: "inherit",
};

const labelStyle = {
  fontSize: "12px", fontWeight: "600", letterSpacing: "0.05em",
  textTransform: "uppercase", color: "var(--text-muted)",
  display: "block", marginBottom: "6px",
};

export default function AddRecipeModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    title: "", category: "Salads & Bowls", prepTime: "", cookTime: "",
    servings: "", netCarbs: "", description: "",
    ingredients: "", steps: "", notes: "", tags: "",
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onAdd({
      id: `recipe-${Date.now()}`,
      title: form.title,
      category: form.category,
      prepTime: form.prepTime || "—",
      cookTime: form.cookTime || "—",
      servings: parseInt(form.servings) || 2,
      netCarbs: form.netCarbs || "—",
      description: form.description,
      ingredients: form.ingredients.split("\n").filter(Boolean),
      steps: form.steps.split("\n").filter(Boolean),
      notes: form.notes,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
    }} onClick={onClose}>
      <div style={{
        background: "var(--card)", borderRadius: "20px", padding: "28px",
        width: "100%", maxWidth: "600px", maxHeight: "85vh", overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }} onClick={(e) => e.stopPropagation()}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
          <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--text)" }}>
            Add New Recipe
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "4px" }}>
            <CloseIcon />
          </button>
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Recipe Title *</label>
            <input style={inputStyle} value={form.title} onChange={set("title")} placeholder="e.g. Cobb Salad" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select style={inputStyle} value={form.category} onChange={set("category")}>
                {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Net Carbs</label>
              <input style={inputStyle} value={form.netCarbs} onChange={set("netCarbs")} placeholder="e.g. ~5g" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Prep Time</label>
              <input style={inputStyle} value={form.prepTime} onChange={set("prepTime")} placeholder="15 min" />
            </div>
            <div>
              <label style={labelStyle}>Cook Time</label>
              <input style={inputStyle} value={form.cookTime} onChange={set("cookTime")} placeholder="20 min" />
            </div>
            <div>
              <label style={labelStyle}>Servings</label>
              <input style={inputStyle} type="number" value={form.servings} onChange={set("servings")} placeholder="2" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, minHeight: "70px", resize: "vertical" }} value={form.description} onChange={set("description")} placeholder="Brief description of the dish..." />
          </div>

          <div>
            <label style={labelStyle}>Ingredients (one per line)</label>
            <textarea style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }} value={form.ingredients} onChange={set("ingredients")} placeholder={"2 cups romaine lettuce\n1 avocado, sliced\n— Dressing —\n3 tbsp olive oil"} />
          </div>

          <div>
            <label style={labelStyle}>Steps (one per line)</label>
            <textarea style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }} value={form.steps} onChange={set("steps")} placeholder={"Chop all vegetables.\nCook the chicken...\n..."} />
          </div>

          <div>
            <label style={labelStyle}>Tags (comma separated)</label>
            <input style={inputStyle} value={form.tags} onChange={set("tags")} placeholder="Meal Prep, High Protein, Gluten-Free" />
          </div>

          <div>
            <label style={labelStyle}>Notes (optional)</label>
            <textarea style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }} value={form.notes} onChange={set("notes")} placeholder="Prep tips, substitutions, storage advice..." />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!form.title.trim()}
            style={{
              width: "100%", padding: "13px",
              background: form.title.trim() ? "var(--accent)" : "#ccc",
              color: "white", border: "none", borderRadius: "10px", fontSize: "15px",
              fontWeight: "600", cursor: form.title.trim() ? "pointer" : "not-allowed",
              fontFamily: "inherit", transition: "opacity 0.2s",
            }}
          >
            Save Recipe
          </button>
        </div>
      </div>
    </div>
  );
}
