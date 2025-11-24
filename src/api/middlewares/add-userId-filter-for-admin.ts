import { type MedusaNextFunction, type MedusaRequest, type MedusaResponse } from "@medusajs/framework/http";
import { UserDTO } from "@medusajs/framework/types";
import { addUserIdToFilterableFields } from "./add-userId-filter";

export async function addUserIdToFilterableFieldsForAdmin(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const loggedInUser = req.scope.resolve("loggedInUser", {
    allowUnregistered: true,
  }) as UserDTO;
  if (!loggedInUser) {
    return next();
  }

  const isSuperAdmin = loggedInUser.metadata?.is_super_admin && !req.session.impersonate_user_id;

  if (isSuperAdmin) {
    return next();
  }

  return addUserIdToFilterableFields(req, res, next);
}
