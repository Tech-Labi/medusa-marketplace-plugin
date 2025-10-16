import {
  MedusaRequest,
  MedusaResponse,
  MedusaNextFunction,
} from "@medusajs/framework";
import { isPresent } from "@medusajs/framework/utils";
import { UserDTO } from "@medusajs/types";

/**
 * Middleware that enforces product visibility rules based on the logged-in user.
 *
 * - Super admins: bypass all filters, see all products
 * - Other users: if the "id" filter is an empty array, replace it with `null` only for Index Engine to ensure no products are returned (instead of all products).
 */
export function productStoreAccessMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const loggedInUser = req.scope.resolve("loggedInUser", {
    allowUnregistered: true,
  }) as UserDTO;

  if (loggedInUser?.metadata?.is_super_admin) {
    return next();
  }

  if (!process.env.MEDUSA_FF_INDEX_ENGINE) {
    return next();
  }

  if (
    Object.keys(req.filterableFields).length === 0 ||
    isPresent(req.filterableFields.tags) ||
    isPresent(req.filterableFields.categories)
  ) {
    return next();
  }

  // Only for Index Engine
  const existingFilters = req.filterableFields["id"];
  req.filterableFields["id"] = Array.isArray(existingFilters)
    ? existingFilters.length === 0
      ? null
      : existingFilters
    : existingFilters;

  return next();
}
