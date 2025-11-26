import {
  type MedusaNextFunction,
  type MedusaRequest,
  type MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { UserDTO } from "@medusajs/framework/types";
import { SUPER_ADMIN_STORE_NAME } from "../../constants";

import * as cookie from "cookie";

export async function addStoreIdToFilterableFields(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
  const storeId = cookies?.store_id;

  const loggedInUser = req.scope.resolve("loggedInUser", {
    allowUnregistered: true,
  }) as UserDTO;
  if (!loggedInUser) {
    // TODO: allow to call this via API (not only admin)
    res.status(403).json({
      type: "invalid_request_error",
      message: "You do not have access to any stores.",
    });
    return;
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data: stores } = await query.graph({
    entity: "user_store",
    fields: ["id", "store_id"],
    filters: {
      user_id: [loggedInUser.id],
    },
  });

  if (!req.filterableFields) {
    req.filterableFields = {};
  }
  if (stores?.length > 0) {
    const id = stores.find((store) => store.store_id === storeId)
      ? storeId
      : stores[0].store_id;
    if (req.url.includes("/admin/stores") && req.method === "GET") {
      req.filterableFields["id"] = id;
    } else {
      // set 'filterableFields' so then the 'maybeApplyLinkFilter' middleware will process it
      req.filterableFields["store_id"] = id;
    }
    // super admin?
  } else if (loggedInUser.metadata?.is_super_admin) {
    if (req.url.includes("/admin/stores") && req.method === "GET") {
      req.filterableFields["name"] = SUPER_ADMIN_STORE_NAME;
    }
  } else {
    // user w/o stores - should not have access
     if (req.url.includes("/admin/stores") && req.method === "GET") {
       req.filterableFields["id"] = [];
     } else {
       req.filterableFields["store_id"] = [];
     }
  }

  return next();
}
