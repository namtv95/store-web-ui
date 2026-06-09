import type { ViewMode } from "../types";

interface ViewSwitcherProps {
  view: ViewMode;
}

export function ViewSwitcher({ view }: ViewSwitcherProps) {
  return (
    <section className="view-switcher" aria-label="Shop view switcher">
      <a
        className={`view-button${view === "items" ? " active" : ""}`}
        href="#items"
        aria-current={view === "items" ? "page" : undefined}
      >
        Shop View
      </a>
      <a
        className={`view-button${view === "dye" ? " active" : ""}`}
        href="#dye"
        aria-current={view === "dye" ? "page" : undefined}
      >
        Dye Color View
      </a>
    </section>
  );
}
