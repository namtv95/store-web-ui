/// <reference types="vite/client" />

interface MissingIconsDevTools {
  list: () => import("./utils/missingIcons").MissingIconEntry[];
  summary: () => void;
  download: () => void;
  scan: (shopName?: string) => Promise<void>;
}

interface Window {
  __missingIcons?: MissingIconsDevTools;
}
