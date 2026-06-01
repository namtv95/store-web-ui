import { useCallback, useState } from "react";
import type { DyeGroup } from "../types";

interface UseDyeColorsResult {
  dyeGroups: DyeGroup[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
  load: () => Promise<void>;
}

export function useDyeColors(): UseDyeColorsResult {
  const [dyeGroups, setDyeGroups] = useState<DyeGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    if (loaded) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}dye_color.json`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = (await response.json()) as DyeGroup[];
      setDyeGroups(data);
      setError(null);
      setLoaded(true);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load dye_color.json",
      );
    } finally {
      setLoading(false);
    }
  }, [loaded]);

  return { dyeGroups, loading, error, loaded, load };
}
