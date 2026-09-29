import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Button, Text } from "@medusajs/ui";
import { useState } from "react";
import { clearImpersonation, getImpersonatedAs } from "../../utils/impersonate";

/**
 * Shows who the super admin is impersonating and lets them stop it.
 *
 * Replaces the old `MainLayout` chunk patch from `patch-admin` ("5) add
 * Impersonate block"): since Medusa 2.17.2 the admin top bar is an injection
 * zone, so this no longer depends on the dashboard's compiled bundle.
 */
const ImpersonationIndicator = () => {
  const [isRemoving, setIsRemoving] = useState(false);
  const impersonatedAs = getImpersonatedAs();

  if (!impersonatedAs) {
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

  return (
    <div className="bg-ui-tag-purple-bg border-ui-tag-purple-border flex h-8 items-center gap-x-3 rounded-md border px-2">
      <Text
        size="small"
        leading="compact"
        className="text-ui-tag-purple-text max-w-[156px] truncate md:max-w-[320px]"
        title={impersonatedAs}
      >
        Impersonated as {impersonatedAs}
      </Text>
      <Button
        size="small"
        variant="secondary"
        onClick={removeImpersonation}
        isLoading={isRemoving}
      >
        Remove Impersonation
      </Button>
    </div>
  );
};

export const config = defineWidgetConfig({
  zone: "topbar",
  id: "marketplace:impersonation-indicator",
});

export default ImpersonationIndicator;
