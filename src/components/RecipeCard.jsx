import { useState } from "react";
import { ChevronDown, ChevronUp } from "./Icons.jsx";

export default function RecipeCard({ recipe, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      background: "var(--card)",
      borderRadius: "16px",
      overflow: "hidden",
      border: "1px solid var(--border)",
      transition: "box-shadow 0.2s ease",
      boxShadow: expanded ? "0 8px 32px rgba(0,0,0,0.1)" : "0 2px 8px rgba(0,0,0,0.04)",
    }}>
      <div
        style={{ padding: "20px 22px", cursor: "pointer", userSelect: "none" }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
              <span style={{
                fontSize: "11px", fontWeight: "600", letterSpacing: "0.06em",
                textTransform: "uppercase", color: "var(--accent)", background: "var(--accent-light)",
                padding: "3px 8px", borderRadius: "20px",
              }}>{recipe.category}</span>
              {recipe.tags?.map(tag => (
                <span key={tag} style={{
                  fontSize: "11px", fontWeight: "500", color: "var(--text-muted)",
                  background: "var(--tag-bg)", padding: "3px 8px", borderRadius: "20px",
                }}>{tag}</span>
              ))}
            </div>
            <h3 style={{ margin: "0 0 6px", fontSize: "17px", fontFamily: "var(--font-display)", color: "var(--text)", lineHeight: 1.3 }}>
              {recipe.title}
            </h3>
            <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "var(--text-muted)", flexWrap: "wrap" }}>
              <span>⏱ Prep {recipe.prepTime}</span>
              <span>🔥 Cook {recipe.cookTime}</span>
              <span>🥗 {recipe.servings} servings</span>
              <span style={{ color: "var(--accent)", fontWeight: "600" }}>{recipe.netCarbs} net carbs</span>
            </div>
          </div>
          <div style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: "2px" }}>
            {expanded ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: "0 22px 22px", borderTop: "1px solid var(--border)" }}>
          <p style={{ margin: "16px 0 20px", fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>
            {recipe.description}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <h4 style={{ margin: "0 0 10px", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                Ingredients
              </h4>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} style={{
                    fontSize: "13px",
                    color: ing.startsWith("—") ? "var(--accent)" : "var(--text)",
                    fontWeight: ing.startsWith("—") ? "600" : "400",
                    padding: "3px 0",
                    paddingLeft: ing.startsWith("—") ? "0" : "14px",
                    position: "relative",
                  }}>
                    {!ing.startsWith("—") && (
                      <span style={{ position: "absolute", left: 0, color: "var(--accent)" }}>·</span>
                    )}
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ margin: "0 0 10px", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                Instructions
              </h4>
              <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {recipe.steps.map((step, i) => (
                  <li key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", fontSize: "13px", color: "var(--text)", lineHeight: 1.5 }}>
                    <span style={{
                      flexShrink: 0, width: "22px", height: "22px", borderRadius: "50%",
                      background: "var(--accent)", color: "white", fontSize: "11px", fontWeight: "700",
                      display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px",
                    }}>{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {recipe.notes && (
            <div style={{
              marginTop: "16px", padding: "12px 14px", background: "var(--accent-light)",
              borderRadius: "10px", fontSize: "13px", color: "var(--text)", lineHeight: 1.5,
              borderLeft: "3px solid var(--accent)",
            }}>
              <strong style={{ color: "var(--accent)" }}>💡 Notes: </strong>{recipe.notes}
            </div>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); onDelete(recipe.id); }}
            style={{
              marginTop: "16px", background: "none", border: "1px solid #e0d0c8",
              color: "#c0796a", padding: "6px 14px", borderRadius: "8px",
              fontSize: "12px", cursor: "pointer", fontWeight: "500",
            }}
          >
            Remove Recipe
          </button>
        </div>
      )}
    </div>
  );
}
