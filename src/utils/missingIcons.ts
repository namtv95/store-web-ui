import type { FlatItem } from "../types";
import { itemIconSrc } from "./inventory";

export interface MissingIconEntry {
  key: number;
  item_name: string;
  item_type: string;
  string_key: string;
  shop: string;
  src: string;
}

const missingIcons = new Map<string, MissingIconEntry>();
const SCAN_CONCURRENCY = 32;

const isDev = import.meta.env.DEV;

function isShopItem(item: FlatItem): boolean {
  return Boolean(item.shop?.name);
}

function iconKey(entry: MissingIconEntry): string {
  return `${entry.shop}:${entry.item_type}:${entry.key}`;
}

export function recordMissingItemIcon(item: FlatItem, src: string): void {
  if (!isDev || !isShopItem(item)) {
    return;
  }

  const entry: MissingIconEntry = {
    key: item.key,
    item_name: item.item_name,
    item_type: item.item_type,
    string_key: item.string_key,
    shop: item.shop.name,
    src,
  };

  if (missingIcons.has(iconKey(entry))) {
    return;
  }

  missingIcons.set(iconKey(entry), entry);
  console.warn("[missing icon]", entry);
}

export function getMissingIcons(): MissingIconEntry[] {
  return [...missingIcons.values()].sort((a, b) => a.key - b.key);
}

export function logMissingIconsSummary(): void {
  if (!isDev) {
    return;
  }

  const list = getMissingIcons();
  console.group(`Missing shop item icons: ${list.length}`);
  console.table(list);
  console.groupEnd();
}

export function downloadMissingIcons(): void {
  if (!isDev) {
    return;
  }

  const list = getMissingIcons();
  const blob = new Blob([JSON.stringify(list, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "missing-icons.json";
  link.click();
  URL.revokeObjectURL(url);
}

function checkImageExists(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = src;
  });
}

function getShopItems(items: FlatItem[], shopName?: string): FlatItem[] {
  const shopItems = items.filter(isShopItem);
  if (!shopName) {
    return shopItems;
  }
  return shopItems.filter((item) => item.shop.name === shopName);
}

export async function scanMissingItemIcons(
  items: FlatItem[],
  shopName?: string,
): Promise<void> {
  const shopItems = getShopItems(items, shopName);
  if (!isDev || shopItems.length === 0) {
    return;
  }

  const label = shopName ? `shop "${shopName}"` : "all shops";
  console.info(
    `[missing icon] Scanning ${shopItems.length} shop item icons for ${label}...`,
  );
  const queue = [...shopItems];

  while (queue.length > 0) {
    const batch = queue.splice(0, SCAN_CONCURRENCY);
    await Promise.all(
      batch.map(async (item) => {
        const src = itemIconSrc(item);
        const exists = await checkImageExists(src);
        if (!exists) {
          recordMissingItemIcon(item, src);
        }
      }),
    );
  }

  logMissingIconsSummary();
}

export function setupMissingIconsDevTools(items: () => FlatItem[]): void {
  if (!isDev) {
    return;
  }

  Object.assign(window, {
    __missingIcons: {
      list: getMissingIcons,
      summary: logMissingIconsSummary,
      download: downloadMissingIcons,
      scan: (shopName?: string) => scanMissingItemIcons(items(), shopName),
    },
  });

  console.info(
    "[missing icon] Dev tools: .list() | .summary() | .download() | .scan(shopName?)",
  );
}
