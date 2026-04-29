import { useState } from "react";
import { CloseIcon, CopyIcon } from "./Icons.jsx";

export default function ShoppingListModal({ recipes, onClose }) {
  const [selected, setSelected] = useState({});
  const [checked, setChecked] = useState({});
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState("pick");

  const toggleRecipe = (id) => setSelected((s) => ({ ...s, [id]: !s[id] }));
  const selectedRecipes = recipes.filter((r) => selected[r.id]);

  const buildList = () => {
    const seen = new Set();
    return selectedRecipes
      .flatMap((r) => r.ingredients.filter((ing) => !ing.startsWith("—")))
      .filter((item) => {
        const key = item.toLowerCase().replace(/[^a-z]/g, "").slice(0, 20);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  };

  const shoppingItems = buildList();
  const toggleCheck = (item) => setChecked((c) => ({ ...c, [item]: !c[item] }));
  const unchecked = shoppingItems.filter((i) => !checked[i]);
  const checkedItems = shoppingItems.filter((i) => checked[i]);

  const copyList = () => {
    const text = shoppingItems.map((i) => `${checked[i] ? "✓" : "○"} ${i}`).join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const rowStyle = {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "9px 0", borderBottom: "1px solid var(--border)", cursor: "pointer",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
    }} onClick={onClose}>
      <div style={{
        background: "var(--card)", borderRadius: "20px", padding: "28px",
        width: "100%", maxWidth: "540px", maxHeight: "85vh", overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }} onClick={(e) => e.stopPropagation()}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--text)" }}>Shopping List</h2>
            {view === "list" && (
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-muted)" }}>
                {selectedRecipes.length} {selectedRecipes.length === 1 ? "recipe" : "recipes"} · {shoppingItems.length} items
              </p>
            )}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
            <CloseIcon />
          </button>
        </div>

        {view === "pick" ? (
          <>
            <p style={{ margin: "0 0 16px", fontSize: "13px", color: "var(--text-muted)" }}>
              Select the recipes you want to make this week:
            </p>
            <div style={{ display: "grid", gap: "8px", marginBottom: "20px" }}>
              {recipes.map((recipe) => (
                <label key={recipe.id} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "12px 14px", borderRadius: "10px", cursor: "pointer",
                  border: `1px solid ${selected[recipe.id] ? "var(--accent)" : "var(--border)"}`,
                  background: selected[recipe.id] ? "var(--accent-light)" : "var(--bg)",
                  transition: "all 0.15s",
                }}>
                  <input
                    type="checkbox"
                    checked={!!selected[recipe.id]}
                    onChange={() => toggleRecipe(recipe.id)}
                    style={{ accentColor: "var(--accent)", width: "16px", height: "16px", flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: "500", color: "var(--text)" }}>{recipe.title}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      {recipe.netCarbs} net carbs · {recipe.ingredients.filter((i) => !i.startsWith("—")).length} ingredients
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <button
              onClick={() => setView("list")}
              disabled={selectedRecipes.length === 0}
              style={{
                width: "100%", padding: "13px", borderRadius: "10px", fontSize: "14px",
                fontWeight: "600", border: "none",
                cursor: selectedRecipes.length ? "pointer" : "not-allowed",
                background: selectedRecipes.length ? "var(--accent)" : "#ccc",
                color: "white", fontFamily: "inherit",
              }}
            >
              {selectedRecipes.length === 0
                ? "Select at least one recipe"
                : `Build List for ${selectedRecipes.length} ${selectedRecipes.length === 1 ? "Recipe" : "Recipes"}`}
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setView("pick")} style={{
              background: "none", border: "none", color: "var(--accent)", fontSize: "13px",
              cursor: "pointer", padding: 0, marginBottom: "16px", fontWeight: "500",
            }}>
              ← Change recipes
            </button>

            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
              {selectedRecipes.map((r) => (
                <span key={r.id} style={{
                  fontSize: "11px", background: "var(--accent-light)", color: "var(--accent)",
                  padding: "3px 10px", borderRadius: "20px", fontWeight: "600",
                }}>
                  {r.title.split(" ").slice(0, 3).join(" ")}{r.title.split(" ").length > 3 ? "…" : ""}
                </span>
              ))}
            </div>

            {unchecked.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>
                  To Buy ({unchecked.length})
                </div>
                {unchecked.map((item) => (
                  <label key={item} style={rowStyle}>
                    <input type="checkbox" checked={false} onChange={() => toggleCheck(item)}
                      style={{ accentColor: "var(--accent)", width: "16px", height: "16px", flexShrink: 0 }} />
                    <span style={{ fontSize: "14px", color: "var(--text)" }}>{item}</span>
                  </label>
                ))}
              </div>
            )}

            {checkedItems.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>
                  Got It ({checkedItems.length})
                </div>
                {checkedItems.map((item) => (
                  <label key={item} style={{ ...rowStyle, opacity: 0.5 }}>
                    <input type="checkbox" checked={true} onChange={() => toggleCheck(item)}
                      style={{ accentColor: "var(--accent)", width: "16px", height: "16px", flexShrink: 0 }} />
                    <span style={{ fontSize: "14px", color: "var(--text)", textDecoration: "line-through" }}>{item}</span>
                  </label>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <button onClick={copyList} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                padding: "11px", borderRadius: "10px", fontSize: "13px", fontWeight: "600",
                border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)",
                cursor: "pointer", fontFamily: "inherit",
              }}>
                <CopyIcon /> {copied ? "Copied!" : "Copy List"}
              </button>
              <button onClick={() => setChecked({})} style={{
                padding: "11px 16px", borderRadius: "10px", fontSize: "13px", fontWeight: "600",
                border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-muted)",
                cursor: "pointer", fontFamily: "inherit",
              }}>
                Reset
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
