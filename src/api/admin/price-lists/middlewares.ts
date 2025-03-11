import {
  maybeApplyLinkFilter,
  MiddlewareRoute,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework";
import {
  AdminCreatePriceList,
  AdminGetPriceListPricesParams,
} from "@medusajs/medusa/api/admin/price-lists/validators";
import { retrivePriceListQueryConfig } from "@medusajs/medusa/api/admin/price-lists/query-config";
import { addStoreIdToFilterableFields } from "../../middlewares/add-store-id-to-filterable-fields";
import { moveIdsToQueryFromFilterableFields } from "../../middlewares/move-ids-to-query-from-filterable-fields";

export const adminPriceListRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/price-lists",
    middlewares: [
      addStoreIdToFilterableFields,
      maybeApplyLinkFilter({
        entryPoint: "price_list_store",
        resourceId: "price_list_id",
        filterableField: "store_id",
      }),
      moveIdsToQueryFromFilterableFields,
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/price-lists",
    middlewares: [
      validateAndTransformBody(AdminCreatePriceList),
      validateAndTransformQuery(
        AdminGetPriceListPricesParams,
        retrivePriceListQueryConfig
      ),
    ],
  },
];
