import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { clearImpersonation, getImpersonatedAs } from "../../utils/impersonate";

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
    document.body.prepend(el);
    setContainer(el);
    return () => el.remove();
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
});

export default ImpersonationIndicator;
