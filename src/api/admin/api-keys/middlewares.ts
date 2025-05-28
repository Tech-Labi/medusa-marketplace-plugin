import {
  maybeApplyLinkFilter,
  MiddlewareRoute,
} from "@medusajs/framework/http";
import {
  blockDataForUser,
  UserType,
} from "../../middlewares/block-data-for-user";
import { moveIdsToQueryFromFilterableFields } from "../../middlewares/move-ids-to-query-from-filterable-fields";
import { onlyForSuperAdmins } from "../../middlewares/only-for-super-admin";
import { addStoreIdToFilterableFields } from "../../middlewares/add-store-id-to-filterable-fields";

const allowApiKeysForVendors = process.env.ALLOW_API_KEYS_FOR_VENDORS == "true";

export const adminApiKeyRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/api-keys",
    middlewares: [
      moveIdsToQueryFromFilterableFields,
      allowApiKeysForVendors
        ? [
            addStoreIdToFilterableFields,
            maybeApplyLinkFilter({
              entryPoint: "api_key_store",
              resourceId: "api_key_id",
              filterableField: "store_id",
            }),
          ]
        : [blockDataForUser(UserType.VENDOR)],
    ].flat(),
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys",
    middlewares: allowApiKeysForVendors ? [] : [onlyForSuperAdmins],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys/:id",
    middlewares: allowApiKeysForVendors ? [] : [onlyForSuperAdmins],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/api-keys/:id",
    middlewares: allowApiKeysForVendors ? [] : [onlyForSuperAdmins],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys/:id/revoke",
    middlewares: allowApiKeysForVendors ? [] : [onlyForSuperAdmins],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys/:id/sales-channels",
    middlewares: allowApiKeysForVendors ? [] : [onlyForSuperAdmins],
  },
];
