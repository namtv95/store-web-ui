import { useEffect, useMemo, useState } from "react";
import type { Shop } from "../types";
import { flattenInventory } from "../utils/inventory";

interface UseInventoryResult {
  shops: Shop[];
  items: ReturnType<typeof flattenInventory>;
  loading: boolean;
  error: string | null;
}

export function useInventory(): UseInventoryResult {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}store_info.json`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = (await response.json()) as Shop[];
        if (!cancelled) {
          setShops(data);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load store_info.json",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => flattenInventory(shops), [shops]);

  return { shops, items, loading, error };
}
