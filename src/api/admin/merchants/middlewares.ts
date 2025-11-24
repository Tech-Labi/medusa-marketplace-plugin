import { validateAndTransformQuery } from "@medusajs/framework";
import { maybeApplyLinkFilter, MiddlewareRoute } from "@medusajs/framework/http";
import * as QueryConfig from "./query-config";
import { AdminGetMerchantsParams } from "./validators";
import { addUserIdToFilterableFieldsForAdmin } from "../../middlewares/add-userId-filter-for-admin";
import { maybeApplyStoreSearchFilter } from "../../middlewares/maybe-apply-store-filter";

export const adminMerchantsRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/merchants",
    middlewares: [
      validateAndTransformQuery(AdminGetMerchantsParams, QueryConfig.listTransformQueryConfig),
      addUserIdToFilterableFieldsForAdmin,
      maybeApplyStoreSearchFilter(),
      maybeApplyLinkFilter({
        entryPoint: "user_store",
        resourceId: "store_id",
        filterableField: "user_id",
      }),
    ],
  },
];
