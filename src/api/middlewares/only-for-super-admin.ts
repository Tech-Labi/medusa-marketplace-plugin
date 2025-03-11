import {
  type MedusaNextFunction,
  type MedusaRequest,
  type MedusaResponse,
} from "@medusajs/framework/http";
import { UserDTO } from "@medusajs/framework/types";
import { MedusaError } from "@medusajs/framework/utils";

export async function onlyForSuperAdmins(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  try {
    const loggedInUser = req.scope.resolve("loggedInUser", {
      allowUnregistered: true,
    }) as UserDTO;

    if (!loggedInUser) {
      throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Unauthorized");
    }

    const isSuperAdmin = loggedInUser.metadata?.is_super_admin;
    if (!isSuperAdmin) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Access denied. This operation is restricted to super administrator only"
      );
    }

    return next();
  } catch (error) {
    next(error);
  }
}
