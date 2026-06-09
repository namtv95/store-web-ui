export interface ShopItem {
  key: number;
  item_name: string;
  item_type: string;
  string_key: string;
}

export interface Shop {
  name: string;
  job_name: string;
  icon: string;
  localtion?: string;
  sell_list: ShopItem[];
}

export interface FlatItem extends ShopItem {
  shop: Shop;
  shopIndex: number;
  itemIndex: number;
  searchText: string;
}

export interface DyeGroup {
  id: number;
  list: string[];
}

export type SortMode = "shop" | "name" | "key" | "string_key";
export type ViewMode = "items" | "dye";
