import { MiddlewareRoute, maybeApplyLinkFilter, validateAndTransformBody, validateAndTransformQuery } from "@medusajs/framework";
import { retrieveTransformQueryConfig } from "@medusajs/medusa/api/admin/shipping-profiles/query-config";
import { AdminCreateShippingProfile, AdminGetShippingProfilesParams } from "@medusajs/medusa/api/admin/shipping-profiles/validators";
import { addStoreIdToFilterableFields } from "../../middlewares/add-store-id-to-filterable-fields";
import { blockDataForUser, UserType } from "../../middlewares/block-data-for-user";
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
            blockDataForUser(UserType.ADMIN),
            moveIdsToQueryFromFilterableFields,
        ],
    },
    {
        method: ["POST"],
        matcher: "/admin/shipping-profiles",
        middlewares: [
            validateAndTransformBody(AdminCreateShippingProfile),
            validateAndTransformQuery(
                AdminGetShippingProfilesParams,
                retrieveTransformQueryConfig
            ),
        ],
    },
]