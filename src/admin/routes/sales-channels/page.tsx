import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Spinner } from "@medusajs/icons"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { useIsSuperAdmin } from "../../hooks/api/use-is-super-admin";

const SalesChannels = () => {
  const navigate = useNavigate()
  const { isSuperAdmin, isLoading } = useIsSuperAdmin()

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isSuperAdmin) {
      navigate("/settings/sales-channels");
    } else {
      navigate("/404");
    }
  }, [isSuperAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="text-ui-fg-interactive animate-spin" />
      </div>
    )
  }

  return (
    <></>
  )
}


export const config = defineRouteConfig({
  label: "Sales Channels",
  nested: "/products"
})

export default SalesChannels