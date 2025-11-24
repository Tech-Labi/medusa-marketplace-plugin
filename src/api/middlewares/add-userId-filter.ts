import { type MedusaNextFunction, type MedusaRequest, type MedusaResponse } from "@medusajs/framework/http";
import { UserDTO } from "@medusajs/framework/types";

export async function addUserIdToFilterableFields(req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) {
  const loggedInUser = req.scope.resolve("loggedInUser", {
    allowUnregistered: true,
  }) as UserDTO;
  if (!loggedInUser) {
    return next();
  }

  if (!req.filterableFields) {
    req.filterableFields = {};
  }

  req.filterableFields["user_id"] = loggedInUser.id;
  return next();
}
