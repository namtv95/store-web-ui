import { memo, useMemo } from "react";
import type { FlatItem, Shop } from "../types";
import { formatNumber } from "../utils/format";
import { shopIconSrc } from "../utils/inventory";

interface ShopPanelProps {
  shops: Shop[];
  visibleItems: FlatItem[];
  shopKey: string;
  onShopSelect: (shopName: string) => void;
  onClearShop: () => void;
}

export const ShopPanel = memo(function ShopPanel({
  shops,
  visibleItems,
  shopKey,
  onShopSelect,
  onClearShop,
}: ShopPanelProps) {
  const visibleByShop = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of visibleItems) {
      counts.set(item.shop.name, (counts.get(item.shop.name) || 0) + 1);
    }
    return counts;
  }, [visibleItems]);

  return (
    <aside className="shop-panel" aria-label="Shop list">
      <div className="shop-header">
        <h2>Shops</h2>
        <button className="shop-reset" type="button" onClick={onClearShop}>
          Select All
        </button>
      </div>
      <div className="shop-list">
        {shops.map((shop) => {
          const total = Array.isArray(shop.sell_list) ? shop.sell_list.length : 0;
          const visible = visibleByShop.get(shop.name) || 0;
          const active = shop.name === shopKey;

          return (
            <div className="shop-row" key={shop.name}>
              <button
                className={`shop-button${active ? " active" : ""}`}
                type="button"
                onClick={() => onShopSelect(shop.name)}
              >
                <img src={shopIconSrc(shop.icon)} alt="" loading="lazy" />
                <span className="shop-copy">
                  <strong>
                    {shop.name}{" "}
                    <span>
                      {formatNumber(visible)}/{formatNumber(total)}
                    </span>
                  </strong>
                  <small>
                    {shop.job_name}
                    {shop.localtion ? (
                      <a
                        className="shop-location"
                        href={shop.localtion}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${shop.name} location`}
                        onClick={(event) => event.stopPropagation()}
                      >
                        Map
                      </a>
                    ) : null}
                  </small>
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
});
