import { memo, useMemo, useState } from "react";
import type { DyeGroup } from "../types";
import { formatNumber } from "../utils/format";
import { assetUrl } from "../utils/inventory";

interface DyeViewProps {
  dyeGroups: DyeGroup[];
  loading: boolean;
  error: string | null;
}

export const DyeView = memo(function DyeView({
  dyeGroups,
  loading,
  error,
}: DyeViewProps) {
  const [activeTab, setActiveTab] = useState(0);
  const group = dyeGroups[activeTab];
  const colors = useMemo(
    () =>
      group ? [null, ...(Array.isArray(group.list) ? group.list : [])] : [],
    [group],
  );

  const subtitle = error
    ? "Serve this site with GitHub Pages or a local web server so the browser can fetch dye_color.json."
    : loading
      ? "Loading dye colors..."
      : group
        ? `Group ${(group.id ?? activeTab) + 1}: ${formatNumber(colors.length)} colors`
        : "No dye colors found.";

  return (
    <section className="dye-view">
      <div className="dye-header">
        <div>
          <h2>Dye Color View</h2>
          <p id="dyeSubtitle">{subtitle}</p>
        </div>
      </div>

      <div className="dye-tabs" role="tablist" aria-label="Dye color groups">
        {dyeGroups.map((dyeGroup, index) => (
          <button
            key={dyeGroup.id ?? index}
            className={`dye-tab${index === activeTab ? " active" : ""}`}
            type="button"
            role="tab"
            aria-selected={index === activeTab}
            onClick={() => setActiveTab(index)}
          >
            <span className="dye-tab-icon">
              <img
                src={assetUrl(`assets/dye/${index + 1}.webp`)}
                alt=""
                loading="lazy"
                onError={(event) => event.currentTarget.remove()}
              />
            </span>
          </button>
        ))}
      </div>

      {!loading && colors.length === 0 ? (
        <div className="empty-state">
          {error || "No colors found in this dye group."}
        </div>
      ) : null}

      <div className="dye-grid">
        {colors.map((color, index) => (
          <article
            key={`${activeTab}-${index}`}
            className={`dye-swatch${color ? "" : " null-color"}`}
            title={color ?? ""}
            data-id={index === 0 ? null : index - 1}
          >
            <span
              className="dye-color"
              style={color ? { background: color } : undefined}
            />
            <span className="dye-code">{color ?? ""}</span>
          </article>
        ))}
      </div>
    </section>
  );
});
