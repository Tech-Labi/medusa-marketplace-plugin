import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  MiddlewareRoute,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { onlyForSuperAdmins } from "../../middlewares/only-for-super-admin";

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

async function onlySuperAdminsForSystemDefaultView(
  req: MedusaRequest<{ is_system_default?: boolean }>,
  res: MedusaResponse,
  next: MedusaNextFunction,
) {
  if (req.body?.is_system_default) {
    return onlyForSuperAdmins(req, res, next);
  }

  if (req.params.id) {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const {
      data: [view],
    } = await query.graph({
      entity: "view_configuration",
      fields: ["is_system_default"],
      filters: { id: req.params.id },
    });

    if (view?.is_system_default) {
      return onlyForSuperAdmins(req, res, next);
    }
  }

  return next();
}

// core admin routes (Medusa 2.16 - 2.21) that are not store scoped
export const adminRestrictedCoreRoutesMiddlewares: MiddlewareRoute[] = [
  // queries all stores, the dashboard fork uses the scoped list endpoints
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
  // returns a reset token for any user
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
  // inventory is not linked to stores
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
  // shared between stores
  {
    method: ["POST"],
    matcher: "/admin/product-options",
    middlewares: [onlyForSuperAdmins],
  },
  {
    method: ["POST", "DELETE"],
    matcher: "/admin/product-options/:id",
    middlewares: [onlyForSuperAdmins],
  },
  {
    method: ["POST", "DELETE"],
    matcher: "/admin/product-options/:id/values/*",
    middlewares: [onlyForSuperAdmins],
  },
  {
    method: ["POST"],
    matcher: "/admin/views/:entity/configurations",
    middlewares: [onlySuperAdminsForSystemDefaultView],
  },
  {
    method: ["POST", "DELETE"],
    matcher: "/admin/views/:entity/configurations/:id",
    middlewares: [onlySuperAdminsForSystemDefaultView],
  },
  {
    method: ["POST"],
    matcher: "/admin/property-labels",
    middlewares: [onlyForSuperAdmins],
  },
  {
    method: ["POST", "DELETE"],
    matcher: "/admin/property-labels/*",
    middlewares: [onlyForSuperAdmins],
  },
];
