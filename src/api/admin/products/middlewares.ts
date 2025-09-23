import { maybeApplyLinkFilter, MiddlewareRoute } from "@medusajs/framework";
import { moveIdsToQueryFromFilterableFields } from "../../middlewares/move-ids-to-query-from-filterable-fields";
import { addStoreIdToFilterableFields } from "../../middlewares/add-store-id-to-filterable-fields";
import { productStoreAccessMiddleware } from "../../middlewares/product-store-access-middleware";

export const adminProductsRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/products",
    middlewares: [
      addStoreIdToFilterableFields,
      maybeApplyLinkFilter({
        entryPoint: "product_store",
        resourceId: "product_id",
        filterableField: "store_id",
      }),
      productStoreAccessMiddleware,
      moveIdsToQueryFromFilterableFields,
    ],
  },
];
