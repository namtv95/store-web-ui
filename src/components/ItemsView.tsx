import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { FlatItem, Shop, SortMode } from "../types";
import { formatNumber } from "../utils/format";
import { filterItems, sortItems } from "../utils/inventory";
import { ItemCard } from "./ItemCard";
import { ShopPanel } from "./ShopPanel";

const GRID_GAP = 8;
const ESTIMATED_ROW_HEIGHT = 76;

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
}: ItemsViewProps) {
  const filtered = useMemo(
    () => sortItems(filterItems(items, query, shopKey), sortMode),
    [items, query, shopKey, sortMode],
  );
  const gridRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(4);
  const [gridTop, setGridTop] = useState(0);
  const rowCount = Math.ceil(filtered.length / columnCount);
  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    gap: GRID_GAP,
    overscan: 6,
    scrollMargin: gridTop,
  });

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) {
      return;
    }

    const updateGridMetrics = () => {
      const width = grid.getBoundingClientRect().width;
      setColumnCount(width <= 540 ? 1 : width <= 820 ? 2 : 4);
      setGridTop(grid.offsetTop);
    };

    updateGridMetrics();
    const observer = new ResizeObserver(updateGridMetrics);
    observer.observe(grid);
    window.addEventListener("resize", updateGridMetrics);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateGridMetrics);
    };
  }, []);

  useEffect(() => {
    rowVirtualizer.measure();
  }, [columnCount, filtered.length, rowVirtualizer]);

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
  const gridStyle = { "--result-columns": columnCount } as CSSProperties;

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
        <div className="results-grid" ref={gridRef} style={gridStyle}>
          <div
            className="results-grid-spacer"
            style={{ height: rowVirtualizer.getTotalSize() }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const start = virtualRow.index * columnCount;
              const rowItems = filtered.slice(start, start + columnCount);

              return (
                <div
                  key={virtualRow.key}
                  ref={rowVirtualizer.measureElement}
                  className="results-grid-row"
                  data-index={virtualRow.index}
                  style={{
                    transform: `translateY(${
                      virtualRow.start - rowVirtualizer.options.scrollMargin
                    }px)`,
                  }}
                >
                  {rowItems.map((item) => (
                    <ItemCard
                      key={`${item.shopIndex}-${item.itemIndex}-${item.key}`}
                      item={item}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </section>
  );
});
