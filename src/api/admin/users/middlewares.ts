import { maybeApplyLinkFilter, MiddlewareRoute } from "@medusajs/framework";
import { moveIdsToQueryFromFilterableFields } from "../../middlewares/move-ids-to-query-from-filterable-fields";
import { addStoreIdToFilterableFields } from "../../middlewares/add-store-id-to-filterable-fields";

export const adminUsersRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/users",
    middlewares: [
      addStoreIdToFilterableFields,
      maybeApplyLinkFilter({
        entryPoint: "user_store",
        resourceId: "user_id",
        filterableField: "store_id",
      }),
      moveIdsToQueryFromFilterableFields,
    ],
  },
];
