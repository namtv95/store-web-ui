import { memo, useCallback } from "react";
import type { FlatItem } from "../types";
import { itemIconSrc, replaceWithDefaultIcon } from "../utils/inventory";
import { recordMissingItemIcon } from "../utils/missingIcons";

interface ItemCardProps {
  item: FlatItem;
  collectMissing?: boolean;
}

export const ItemCard = memo(function ItemCard({
  item,
  collectMissing = true,
}: ItemCardProps) {
  const onError = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      if (collectMissing) {
        recordMissingItemIcon(item, event.currentTarget.src);
      }
      replaceWithDefaultIcon(event.currentTarget);
    },
    [collectMissing, item],
  );

  return (
    <article className="item-card" data-id={item.key}>
      <img
        className="item-icon"
        src={itemIconSrc(item)}
        alt={item.item_name}
        loading="lazy"
        width={42}
        height={42}
        onError={onError}
      />
      <div className="item-copy">
        <h3 title={item.item_name}>{item.item_name}</h3>
        <div className="store">{item.shop.name}</div>
        <div className="job">{item.shop.job_name}</div>
      </div>
    </article>
  );
});
