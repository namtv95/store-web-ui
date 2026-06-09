import { useEffect, useState } from "react";
import type { ViewMode } from "../types";

const VIEW_TAGS: Record<ViewMode, string> = {
  items: "items",
  dye: "dye",
};

const TAG_TO_VIEW: Record<string, ViewMode> = {
  items: "items",
  shop: "items",
  dye: "dye",
  colors: "dye",
};

function parseViewFromHash(fallback: ViewMode): ViewMode {
  const tag = window.location.hash.replace(/^#/, "").toLowerCase();
  return TAG_TO_VIEW[tag] ?? fallback;
}

function hashForView(view: ViewMode): string {
  return `#${VIEW_TAGS[view]}`;
}

export function useViewFromUrl(defaultView: ViewMode = "items"): ViewMode {
  const [view, setView] = useState<ViewMode>(() => parseViewFromHash(defaultView));

  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, "", hashForView(defaultView));
    }
  }, [defaultView]);

  useEffect(() => {
    const onHashChange = () => {
      setView(parseViewFromHash(defaultView));
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [defaultView]);

  return view;
}
