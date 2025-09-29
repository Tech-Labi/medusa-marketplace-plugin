import { MiddlewareRoute, validateAndTransformQuery } from "@medusajs/framework";
import { AdminGetRegionsParams } from "@medusajs/medusa/api/admin/regions/validators";
import * as QueryConfig from '@medusajs/medusa/api/admin/regions/query-config';
import { onlyForSuperAdmins } from "../../middlewares/only-for-super-admin";
import { moveIdsToQueryFromFilterableFields } from "../../middlewares/move-ids-to-query-from-filterable-fields";

export const adminRegionsRoutesMiddlewares: MiddlewareRoute[] = [
    {
        method: ["GET"],
        matcher: "/admin/regions",
        middlewares: [
            validateAndTransformQuery(
                AdminGetRegionsParams,
                QueryConfig.listTransformQueryConfig
            ),
            moveIdsToQueryFromFilterableFields,
        ],
    },
    {
        method: ["POST"],
        matcher: "/admin/regions",
        middlewares: [onlyForSuperAdmins],
    },
    {
        method: ["POST"],
        matcher: "/admin/regions/:id",
        middlewares: [onlyForSuperAdmins],
    },
    {
        method: ["DELETE"],
        matcher: "/admin/regions/:id",
        middlewares: [onlyForSuperAdmins],
    },
]