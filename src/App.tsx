import { useCallback, useEffect, useState } from "react";
import { DyeView } from "./components/DyeView";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { ItemsView } from "./components/ItemsView";
import { SearchControls } from "./components/SearchControls";
import { ViewSwitcher } from "./components/ViewSwitcher";
import { useDyeColors } from "./hooks/useDyeColors";
import { useInventory } from "./hooks/useInventory";
import type { SortMode, ViewMode } from "./types";
import { setupMissingIconsDevTools } from "./utils/missingIcons";

export default function App() {
  const { shops, items, loading, error } = useInventory();
  const { dyeGroups, loading: dyeLoading, error: dyeError, load: loadDyeColors } =
    useDyeColors();

  const [view, setView] = useState<ViewMode>("items");
  const [query, setQuery] = useState("");
  const [shopKey, setShopKey] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("shop");

  useEffect(() => {
    void loadDyeColors();
  }, [loadDyeColors]);

  useEffect(() => {
    if (!loading && items.length > 0) {
      setupMissingIconsDevTools(() => items);
    }
  }, [items, loading]);

  const handleShopSelect = useCallback((shopName: string) => {
    setShopKey((current) => (current === shopName ? "" : shopName));
  }, []);

  const handleClearShop = useCallback(() => {
    setShopKey("");
  }, []);

  const handleClear = useCallback(() => {
    setQuery("");
    setShopKey("");
    setSortMode("shop");
  }, []);

  const showItems = view === "items";

  return (
    <>
      <Header shopCount={shops.length} itemCount={items.length} />

      <main>
        <ViewSwitcher view={view} onChange={setView} />

        <section hidden={!showItems} aria-hidden={!showItems}>
          <SearchControls
            query={query}
            shopKey={shopKey}
            sortMode={sortMode}
            shops={shops}
            onQueryChange={setQuery}
            onShopChange={setShopKey}
            onSortChange={setSortMode}
            onClear={handleClear}
          />
          <ItemsView
            shops={shops}
            items={items}
            query={query}
            shopKey={shopKey}
            sortMode={sortMode}
            loading={loading}
            error={error}
            onShopSelect={handleShopSelect}
            onClearShop={handleClearShop}
            collectMissingIcons={showItems}
          />
        </section>

        <section hidden={showItems} aria-hidden={showItems}>
          <DyeView dyeGroups={dyeGroups} loading={dyeLoading} error={dyeError} />
        </section>
      </main>

      <Footer />
    </>
  );
}
