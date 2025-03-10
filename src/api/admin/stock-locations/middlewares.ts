import {
  MiddlewareRoute,
  maybeApplyLinkFilter,
} from "@medusajs/framework/http";
import { addStoreIdToFilterableFields } from "../../middlewares/add-store-id-to-filterable-fields";
import { moveIdsToQueryFromFilterableFields } from "../../middlewares/move-ids-to-query-from-filterable-fields";
import {
  UserType,
  blockDataForUser,
} from "../../middlewares/block-data-for-user";

export const adminStockLocationRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/stock-locations",
    middlewares: [
      addStoreIdToFilterableFields,
      maybeApplyLinkFilter({
        entryPoint: "stock_location_store",
        resourceId: "stock_location_id",
        filterableField: "store_id",
      }),
      blockDataForUser(UserType.ADMIN),
      moveIdsToQueryFromFilterableFields,
    ],
  },
];
