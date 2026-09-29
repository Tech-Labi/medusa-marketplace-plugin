import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  MiddlewareRoute,
} from "@medusajs/framework/http";
import { onlyForSuperAdmins } from "../../middlewares/only-for-super-admin";

/**
 * Core admin routes (added in Medusa 2.17 - 2.21) that are not scoped to a
 * store. In a multi-vendor setup a merchant must not reach them, so they are
 * restricted to super admins (not while impersonating a merchant).
 */

/**
 * Anyone may save their own layout, but only a super admin may change the
 * global default layout (`is_default: true`) that applies to every user.
 */
async function onlySuperAdminsForDefaultLayout(
  req: MedusaRequest<{ is_default?: boolean }>,
  res: MedusaResponse,
  next: MedusaNextFunction,
) {
  if (req.body?.is_default) {
    return onlyForSuperAdmins(req, res, next);
  }

  return next();
}

export const adminRestrictedCoreRoutesMiddlewares: MiddlewareRoute[] = [
  // Global search queries every entity via `query.graph`, bypassing the
  // store filters of the list endpoints. Our dashboard fork searches through
  // the scoped list endpoints instead.
  {
    method: ["GET"],
    matcher: "/admin/search",
    middlewares: [onlyForSuperAdmins],
  },
  {
    method: ["GET"],
    matcher: "/admin/search-indexes",
    middlewares: [onlyForSuperAdmins],
  },
  {
    method: ["GET"],
    matcher: "/admin/search-indexes/:id",
    middlewares: [onlyForSuperAdmins],
  },
  {
    method: ["POST"],
    matcher: "/admin/search-indexes/:id/reindex",
    middlewares: [onlyForSuperAdmins],
  },
  // Returns a password reset token for any user id, which would let a
  // merchant take over another store's (or a super admin's) account.
  {
    method: ["POST"],
    matcher: "/admin/users/:id/reset-password",
    middlewares: [onlyForSuperAdmins],
  },
  {
    method: ["GET"],
    matcher: "/admin/users/:id/auth-providers",
    middlewares: [onlyForSuperAdmins],
  },
  // Inventory is not linked to stores; the export would include every store.
  {
    method: ["POST"],
    matcher: "/admin/inventory-items/export",
    middlewares: [onlyForSuperAdmins],
  },
  {
    method: ["POST"],
    matcher: "/admin/layouts/:zone/configuration",
    middlewares: [onlySuperAdminsForDefaultLayout],
  },
];
