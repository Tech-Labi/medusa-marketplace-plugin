import {
  maybeApplyLinkFilter,
  MiddlewareRoute,
} from "@medusajs/framework/http";
import { addStoreIdToFilterableFields } from "../../middlewares/add-store-id-to-filterable-fields";
import { moveIdsToQueryFromFilterableFields } from "../../middlewares/move-ids-to-query-from-filterable-fields";
export const adminCustomerRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/customers",
    middlewares: [
      addStoreIdToFilterableFields,
      maybeApplyLinkFilter({
        entryPoint: "customer_store",
        resourceId: "customer_id",
        filterableField: "store_id",
      }),
      moveIdsToQueryFromFilterableFields,
    ],
  },
];
