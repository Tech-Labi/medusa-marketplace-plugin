import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { clearImpersonation, getImpersonatedAs } from "../../utils/impersonate";

const BAR_ID = "impersonation-bar";
const BAR_HEIGHT = 32;
const VISIBLE_HEIGHT = "--impersonation-bar-visible";
const STYLE = `body { padding-bottom: var(${VISIBLE_HEIGHT}); }
#${BAR_ID} ~ * .h-screen { height: calc(100vh - var(${VISIBLE_HEIGHT})); }`;

const ImpersonationIndicator = () => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const impersonatedAs = getImpersonatedAs();

  // full-width bar above the whole admin (as before), not inside the topbar
  useEffect(() => {
    if (!impersonatedAs) {
      return;
    }
    const el = document.createElement("div");
    el.id = BAR_ID;
    document.body.prepend(el);
    setContainer(el);

    const onScroll = () =>
      document.body.style.setProperty(VISIBLE_HEIGHT, `${Math.max(0, BAR_HEIGHT - window.scrollY)}px`);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.body.style.removeProperty(VISIBLE_HEIGHT);
      el.remove();
    };
  }, [impersonatedAs]);

  if (!impersonatedAs || !container) {
    return null;
  }

  const removeImpersonation = async () => {
    setIsRemoving(true);
    try {
      await fetch("/admin/impersonate", {
        method: "DELETE",
        credentials: "include",
      });
    } finally {
      clearImpersonation();
      window.location.href = "/app/merchants";
    }
  };

  return createPortal(
    <div className="flex justify-between items-center bg-ui-tag-purple-icon px-2 py-1 h-8 text-ui-fg-on-inverted text-xs md:text-sm">
      <style>{STYLE}</style>
      <p className="max-w-[156px] md:max-w-full truncate max-h-[1.2em]">Impersonated as {impersonatedAs}</p>
      <button onClick={removeImpersonation} disabled={isRemoving} className="border border-ui-tag-neutral-border px-2">
        Remove Impersonation
      </button>
    </div>,
    container,
  );
};

export const config = defineWidgetConfig({
  zone: "topbar",
  id: "marketplace:impersonation-indicator",
  // @ts-expect-error from the chargx/medusa admin-sdk the core is built with
  hideable: false,
});

export default ImpersonationIndicator;
