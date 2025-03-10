import { MiddlewareRoute, validateAndTransformQuery } from "@medusajs/framework";
import { AdminGetTaxRatesParams } from "@medusajs/medusa/api/admin/tax-rates/validators";
import * as QueryConfig from '@medusajs/medusa/api/admin/tax-rates/query-config';
import { UserType, blockDataForUser } from "../../middlewares/block-data-for-user";
import { moveIdsToQueryFromFilterableFields } from "../../middlewares/move-ids-to-query-from-filterable-fields";
import { onlyForSuperAdmins } from "../../middlewares/only-for-super-admin";

export const adminTaxRatesRoutesMiddlewares: MiddlewareRoute[] = [
    {
        method: "GET",
        matcher: "/admin/tax-rates",
        middlewares: [
            validateAndTransformQuery(
                AdminGetTaxRatesParams,
                QueryConfig.listTransformQueryConfig
            ),
            blockDataForUser(UserType.VENDOR, {name: "tax_region_id", value: []}),
            moveIdsToQueryFromFilterableFields,
        ],
    },
    {
        method: "POST",
        matcher: "/admin/tax-rates",
        middlewares: [onlyForSuperAdmins],
    },
    {
        method: "POST",
        matcher: "/admin/tax-rates/:id",
        middlewares: [onlyForSuperAdmins],
    },
    {
        method: "DELETE",
        matcher: "/admin/tax-rates/:id",
        middlewares: [onlyForSuperAdmins],
    },
    {
        method: "POST",
        matcher: "/admin/tax-rates/:id/rules",
        middlewares: [onlyForSuperAdmins],
    },
    {
        method: "DELETE",
        matcher: "/admin/tax-rates/:id/rules/:rule_id",
        middlewares: [onlyForSuperAdmins],
    },
]