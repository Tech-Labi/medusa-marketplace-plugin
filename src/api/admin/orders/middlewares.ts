import {
  maybeApplyLinkFilter,
  MiddlewareRoute,
} from "@medusajs/framework/http";
import { addStoreIdToFilterableFields } from "../../middlewares/add-store-id-to-filterable-fields";
import { moveIdsToQueryFromFilterableFields } from "../../middlewares/move-ids-to-query-from-filterable-fields";
import { validateOrderInCurrentStore } from "../../middlewares/validate-order-in-current-store";
export const adminOrderRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/orders",
    middlewares: [
      addStoreIdToFilterableFields,
      maybeApplyLinkFilter({
        entryPoint: "order_store",
        resourceId: "order_id",
        filterableField: "store_id",
      }),
      moveIdsToQueryFromFilterableFields,
    ],
  },
  {
    method: ["GET", "POST", "DELETE"],
    matcher: "/admin/orders/:id",
    middlewares: [validateOrderInCurrentStore],
  },
  {
    method: ["GET", "POST", "DELETE"],
    matcher: "/admin/orders/:id/*",
    middlewares: [validateOrderInCurrentStore],
  },
  // :id of order edits is the order id
  {
    method: ["POST"],
    matcher: "/admin/order-edits",
    middlewares: [validateOrderInCurrentStore],
  },
  {
    method: ["GET", "POST", "DELETE"],
    matcher: "/admin/order-edits/:id",
    middlewares: [validateOrderInCurrentStore],
  },
  {
    method: ["GET", "POST", "DELETE"],
    matcher: "/admin/order-edits/:id/*",
    middlewares: [validateOrderInCurrentStore],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-changes/:id",
    middlewares: [validateOrderInCurrentStore],
  },
];
