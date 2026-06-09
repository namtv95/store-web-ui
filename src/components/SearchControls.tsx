import { memo } from "react";
import type { Shop, SortMode } from "../types";

interface SearchControlsProps {
  query: string;
  shopKey: string;
  sortMode: SortMode;
  shops: Shop[];
  onQueryChange: (value: string) => void;
  onShopChange: (value: string) => void;
  onSortChange: (value: SortMode) => void;
  onClear: () => void;
}

export const SearchControls = memo(function SearchControls({
  query,
  shopKey,
  sortMode,
  shops,
  onQueryChange,
  onShopChange,
  onSortChange,
  onClear,
}: SearchControlsProps) {
  return (
    <section className="controls" aria-label="Search controls">
      <label className="search-box">
        <span>Search inventory</span>
        <input
          type="search"
          autoComplete="off"
          placeholder="Type item name, shop name..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value.trim())}
        />
      </label>
      <label className="select-box">
        <span>Shop</span>
        <select value={shopKey} onChange={(event) => onShopChange(event.target.value)}>
          <option value="">All shops</option>
          {shops.map((shop) => (
            <option key={shop.name} value={shop.name}>
              {shop.name} - {shop.job_name}
            </option>
          ))}
        </select>
      </label>
      <label className="select-box">
        <span>Sort</span>
        <select
          value={sortMode}
          onChange={(event) => onSortChange(event.target.value as SortMode)}
        >
          <option value="shop">Shop order</option>
          <option value="name">Item name</option>
          <option value="key">Item key</option>
          <option value="string_key">String key</option>
        </select>
      </label>
      <button className="clear-button" type="button" onClick={onClear}>
        Clear
      </button>
    </section>
  );
});
