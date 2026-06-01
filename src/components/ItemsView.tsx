import { memo, useMemo } from "react";
import type { FlatItem, Shop, SortMode } from "../types";
import { formatNumber } from "../utils/format";
import { filterItems, sortItems } from "../utils/inventory";
import { ItemCard } from "./ItemCard";
import { ShopPanel } from "./ShopPanel";

interface ItemsViewProps {
  shops: Shop[];
  items: FlatItem[];
  query: string;
  shopKey: string;
  sortMode: SortMode;
  loading: boolean;
  error: string | null;
  onShopSelect: (shopName: string) => void;
  onClearShop: () => void;
  collectMissingIcons?: boolean;
}

export const ItemsView = memo(function ItemsView({
  shops,
  items,
  query,
  shopKey,
  sortMode,
  loading,
  error,
  onShopSelect,
  onClearShop,
  collectMissingIcons = true,
}: ItemsViewProps) {
  const filtered = useMemo(
    () => sortItems(filterItems(items, query, shopKey), sortMode),
    [items, query, shopKey, sortMode],
  );

  const shop = shops.find((candidate) => candidate.name === shopKey);
  const title = error
    ? "Inventory could not be loaded"
    : shop
      ? `${shop.name} Inventory`
      : "All Items";

  const subtitle = error
    ? "Serve this site with GitHub Pages or a local web server so the browser can fetch store_info.json."
    : loading
      ? "Loading inventory data..."
      : query
        ? `${formatNumber(filtered.length)} matching items for "${query}"`
        : `${formatNumber(filtered.length)} visible items`;

  return (
    <section className="layout">
      <ShopPanel
        shops={shops}
        visibleItems={filtered}
        shopKey={shopKey}
        onShopSelect={onShopSelect}
        onClearShop={onClearShop}
      />

      <section className="results-panel" aria-live="polite">
        <div className="results-header">
          <div>
            <h2>{title}</h2>
            <p id="resultsSubtitle">{subtitle}</p>
          </div>
        </div>
        {!loading && filtered.length === 0 ? (
          <div className="empty-state">
            {error ||
              "No matching item found. Try the exact numeric key or part of the string key."}
          </div>
        ) : null}
        <div className="results-grid">
          {filtered.map((item) => (
            <ItemCard
              key={`${item.shopIndex}-${item.itemIndex}-${item.key}`}
              item={item}
              collectMissing={collectMissingIcons}
            />
          ))}
        </div>
      </section>
    </section>
  );
});
