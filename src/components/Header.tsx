import { formatNumber } from "../utils/format";
import { assetUrl } from "../utils/inventory";

interface HeaderProps {
  shopCount: number;
  itemCount: number;
}

export function Header({ shopCount, itemCount }: HeaderProps) {
  return (
    <header className="site-header">
      <nav className="topbar" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Expanded Vendor Inventory home">
          <img
            className="brand-mark"
            src={assetUrl("assets/avatar.jpg")}
            alt=""
            loading="lazy"
          />
          <span>
            <strong>Expanded Vendor Inventory</strong>
            <small>Crimson Desert shop browser</small>
          </span>
        </a>
        <a
          className="nexus-link"
          href="https://www.nexusmods.com/crimsondesert/mods/2281"
          target="_blank"
          rel="noreferrer"
        >
          Nexus Mods
        </a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Vendor inventory lookup</p>
          <h1>Find any modded shop item and where it is sold.</h1>
        </div>
        <div className="hero-stats" aria-label="Inventory summary">
          <div>
            <span>{formatNumber(shopCount)}</span>
            <small>shops</small>
          </div>
          <div>
            <span>{formatNumber(itemCount)}</span>
            <small>items</small>
          </div>
        </div>
      </section>
    </header>
  );
}
