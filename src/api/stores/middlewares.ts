import { MiddlewareRoute } from "@medusajs/framework";
import { checkApiKey } from "../middlewares/check-api-key";
import { addStoreIdToFilterableFields } from "../middlewares/add-store-id-to-filterable-fields";
import { moveIdsToQueryFromFilterableFields } from "../middlewares/move-ids-to-query-from-filterable-fields";
import { applyStoreCors } from "../middlewares/apply-store-cors";

export const storesRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/stores*",
    middlewares: [applyStoreCors],
  },
  {
    method: ["GET"],
    matcher: "/admin/stores",
    middlewares: [
      addStoreIdToFilterableFields,
      moveIdsToQueryFromFilterableFields,
    ],
  },
  {
    method: ["POST"],
    matcher: "/stores/super",
    middlewares: [checkApiKey],
  },
];
