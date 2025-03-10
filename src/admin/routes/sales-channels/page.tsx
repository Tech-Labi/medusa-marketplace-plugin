import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Spinner } from "@medusajs/icons"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { useMe } from "../../hooks/api/users";

const SalesChannels = () => {
  const navigate = useNavigate()
  const { user, isLoading } = useMe()

  useEffect(() => {
    if (user?.metadata?.is_super_admin && !isLoading) {
      navigate("/settings/sales-channels");
    } else {
      navigate("/404");
    }
  }, [user, navigate]);

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