import {
  type MedusaNextFunction,
  type MedusaRequest,
  type MedusaResponse,
} from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/framework/utils";
import type { LoggedInUser } from "./logged-in-user";

export async function onlyForSuperAdmins(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  try {
    const loggedInUser = req.scope.resolve("loggedInUser", {
      allowUnregistered: true,
    }) as LoggedInUser | undefined;

    if (!loggedInUser) {
      throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Unauthorized");
    }

    const isSuperAdmin =
      !!loggedInUser.super_admin?.id && !req.session?.impersonate_user_id;

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
