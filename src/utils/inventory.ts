import type { FlatItem, Shop, SortMode } from "../types";
import { normalize } from "./format";

function itemSearchText(item: Omit<FlatItem, "searchText">): string {
  return [
    item.item_name,
    item.string_key,
    item.key,
    item.shop.name,
    item.shop.job_name,
  ]
    .map(normalize)
    .join(" ");
}

export function flattenInventory(shops: Shop[]): FlatItem[] {
  return shops
    .flatMap((shop, shopIndex) => {
      const sellList = Array.isArray(shop.sell_list) ? shop.sell_list : [];
      return sellList.map((item, itemIndex) => ({
        ...item,
        shop,
        shopIndex,
        itemIndex,
        searchText: "",
      }));
    })
    .map((item) => ({
      ...item,
      searchText: itemSearchText(item),
    }));
}

export function filterItems(
  items: FlatItem[],
  query: string,
  shopKey: string,
): FlatItem[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return items.filter((item) => {
    if (shopKey && String(item.shop.name) !== shopKey) {
      return false;
    }
    return terms.every((term) => item.searchText.includes(term));
  });
}

export function sortItems(items: FlatItem[], sortMode: SortMode): FlatItem[] {
  const sorted = [...items];
  sorted.sort((a, b) => {
    if (sortMode === "name") {
      return String(a.item_name).localeCompare(String(b.item_name));
    }
    if (sortMode === "key") {
      return Number(a.key) - Number(b.key);
    }
    if (sortMode === "string_key") {
      return String(a.string_key).localeCompare(String(b.string_key));
    }
    return a.shopIndex - b.shopIndex || a.itemIndex - b.itemIndex;
  });
  return sorted;
}

export const DEFAULT_ITEM_ICON_SRC = `${import.meta.env.BASE_URL}assets/icons/missing-icon.svg`;

const missingItemIconSrcs = new Set<string>();

export function itemIconSrc(item: FlatItem): string {
  const src = originalItemIconSrc(item);
  return hasMissingItemIcon(src) ? DEFAULT_ITEM_ICON_SRC : src;
}

export function originalItemIconSrc(item: FlatItem): string {
  const base = import.meta.env.BASE_URL;
  if (item.item_type === "Disc9") {
    return `${base}assets/icons/${encodeURIComponent(String(item.key) + "_9")}.webp`;
  }
  return `${base}assets/icons/${encodeURIComponent(item.key)}.webp`;
}

export function rememberMissingItemIcon(src: string): void {
  if (src !== DEFAULT_ITEM_ICON_SRC) {
    missingItemIconSrcs.add(src);
    missingItemIconSrcs.add(toAbsoluteAssetUrl(src));
  }
}

function hasMissingItemIcon(src: string): boolean {
  return missingItemIconSrcs.has(src) || missingItemIconSrcs.has(toAbsoluteAssetUrl(src));
}

function toAbsoluteAssetUrl(src: string): string {
  if (typeof window === "undefined") {
    return src;
  }
  return new URL(src, window.location.href).href;
}

export function shopIconSrc(icon: string): string {
  return `${import.meta.env.BASE_URL}assets/vendors/${encodeURIComponent(icon)}.webp`;
}

export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`;
}

export function replaceWithDefaultIcon(image: HTMLImageElement): void {
  if (image.classList.contains("item-icon--fallback")) {
    image.onerror = null;
    return;
  }
  rememberMissingItemIcon(image.src);
  image.src = DEFAULT_ITEM_ICON_SRC;
  image.classList.add("item-icon--fallback");
}
