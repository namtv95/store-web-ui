import { useCallback, useEffect, useState } from "react";

const SCROLL_SHOW_OFFSET = 400;

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_SHOW_OFFSET);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      className={`scroll-to-top${visible ? " visible" : ""}`}
      type="button"
      aria-label="Scroll to top"
      onClick={scrollToTop}
    >
      ↑
    </button>
  );
}
