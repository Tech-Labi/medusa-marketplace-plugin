import { type MedusaNextFunction, type MedusaRequest, type MedusaResponse } from "@medusajs/framework/http";
import type { LoggedInUser } from "./logged-in-user";
import { addUserIdToFilterableFields } from "./add-userId-filter";

export async function addUserIdToFilterableFieldsForAdmin(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const loggedInUser = req.scope.resolve("loggedInUser", {
    allowUnregistered: true,
  }) as LoggedInUser | undefined;
  if (!loggedInUser) {
    return next();
  }

  const isSuperAdmin = !!loggedInUser.super_admin?.id && !req.session.impersonate_user_id;

  if (isSuperAdmin) {
    return next();
  }

  return addUserIdToFilterableFields(req, res, next);
}
