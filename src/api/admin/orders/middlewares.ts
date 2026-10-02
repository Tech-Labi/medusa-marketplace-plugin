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
];
