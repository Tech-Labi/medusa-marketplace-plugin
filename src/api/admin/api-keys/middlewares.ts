import {
  MiddlewareRoute,
  validateAndTransformQuery,
} from "@medusajs/framework/http";
import * as QueryConfig from "@medusajs/medusa/api/admin/api-keys/query-config";
import { AdminGetApiKeysParams } from "@medusajs/medusa/api/admin/api-keys/validators";
import {
  blockDataForUser,
  UserType,
} from "../../middlewares/block-data-for-user";
import { moveIdsToQueryFromFilterableFields } from "../../middlewares/move-ids-to-query-from-filterable-fields";
import { onlyForSuperAdmins } from "../../middlewares/only-for-super-admin";

export const adminApiKeyRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/api-keys",
    middlewares: [
      validateAndTransformQuery(
        AdminGetApiKeysParams,
        QueryConfig.listTransformQueryConfig
      ),
      blockDataForUser(UserType.VENDOR),
      moveIdsToQueryFromFilterableFields,
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys",
    middlewares: [onlyForSuperAdmins],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys/:id",
    middlewares: [onlyForSuperAdmins],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/api-keys/:id",
    middlewares: [onlyForSuperAdmins],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys/:id/revoke",
    middlewares: [onlyForSuperAdmins],
  },
  {
    method: ["POST"],
    matcher: "/admin/api-keys/:id/sales-channels",
    middlewares: [onlyForSuperAdmins],
  },
];
