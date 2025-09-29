import { MiddlewareRoute, maybeApplyLinkFilter } from "@medusajs/framework";
import { addStoreIdToFilterableFields } from "../../middlewares/add-store-id-to-filterable-fields";
import { moveIdsToQueryFromFilterableFields } from "../../middlewares/move-ids-to-query-from-filterable-fields";

export const adminShippingProfileRoutesMiddlewares: MiddlewareRoute[] = [
    {
        method: ["GET"],
        matcher: "/admin/shipping-profiles",
        middlewares: [
            addStoreIdToFilterableFields,
            maybeApplyLinkFilter({
                entryPoint: "shipping_profile_store",
                resourceId: "shipping_profile_id",
                filterableField: "store_id",
            }),
            moveIdsToQueryFromFilterableFields,
        ],
    },
]