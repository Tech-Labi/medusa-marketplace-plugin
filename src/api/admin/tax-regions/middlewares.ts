import { MiddlewareRoute, validateAndTransformQuery } from "@medusajs/framework";
import { AdminGetTaxRegionsParams } from "@medusajs/medusa/api/admin/tax-regions/validators";
import { onlyForSuperAdmins } from "../../middlewares/only-for-super-admin";
import * as QueryConfig from '@medusajs/medusa/api/admin/tax-regions/query-config';
import { UserType, blockDataForUser } from "../..//middlewares/block-data-for-user";
import { moveIdsToQueryFromFilterableFields } from "../../middlewares/move-ids-to-query-from-filterable-fields";

export const adminTaxRegionsRoutesMiddlewares: MiddlewareRoute[] = [
    {
        method: "GET",
        matcher: "/admin/tax-regions",
        middlewares: [
            validateAndTransformQuery(
                AdminGetTaxRegionsParams,
                QueryConfig.listTransformQueryConfig
            ),
            blockDataForUser(UserType.VENDOR),
            moveIdsToQueryFromFilterableFields,
        ],
    },
    {
        method: "POST",
        matcher: "/admin/tax-regions",
        middlewares: [onlyForSuperAdmins],
    },
    {
        method: "POST",
        matcher: "/admin/tax-regions/:id",
        middlewares: [onlyForSuperAdmins],
    },
    {
        method: "DELETE",
        matcher: "/admin/tax-regions/:id",
        middlewares: [onlyForSuperAdmins],
    },
]