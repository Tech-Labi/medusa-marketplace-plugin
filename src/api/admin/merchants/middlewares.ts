import { validateAndTransformQuery } from "@medusajs/framework";
import { MiddlewareRoute } from "@medusajs/framework/http";
import * as QueryConfig from "./query-config";
import { AdminGetMerchantsParams } from "./validators";

export const adminMerchantsRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/merchants",
    middlewares: [validateAndTransformQuery(AdminGetMerchantsParams, QueryConfig.listTransformQueryConfig)],
  },
];
