import type { ViewMode } from "../types";

interface ViewSwitcherProps {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}

export function ViewSwitcher({ view, onChange }: ViewSwitcherProps) {
  return (
    <section className="view-switcher" aria-label="Shop view switcher">
      <button
        className={`view-button${view === "items" ? " active" : ""}`}
        type="button"
        aria-pressed={view === "items"}
        onClick={() => onChange("items")}
      >
        Shop View
      </button>
      <button
        className={`view-button${view === "dye" ? " active" : ""}`}
        type="button"
        aria-pressed={view === "dye"}
        onClick={() => onChange("dye")}
      >
        Dye Color View
      </button>
    </section>
  );
}
