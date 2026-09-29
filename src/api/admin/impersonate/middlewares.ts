import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  MiddlewareRoute,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils";

/**
 * Only a super admin may start an impersonation. The check uses the actor that
 * actually logged in (the session's auth context), not `loggedInUser`, which
 * already points at the impersonated user while an impersonation is active.
 */
async function onlyAuthenticatedSuperAdmin(
  req: MedusaRequest,
  _res: MedusaResponse,
  next: MedusaNextFunction,
) {
  try {
    const authContext =
      (req as MedusaRequest & { auth_context?: { actor_id?: string; actor_type?: string } })
        .auth_context ?? req.session?.auth_context;
    const actorId = authContext?.actor_type === "user" ? authContext.actor_id : undefined;
    if (!actorId) {
      throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Unauthorized");
    }

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const {
      data: [actor],
    } = await query.graph({
      entity: "user",
      fields: ["id", "super_admin.id"],
      filters: { id: actorId },
    });

    if (!(actor as { super_admin?: { id: string } | null } | undefined)?.super_admin?.id) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Access denied. This operation is restricted to super administrator only",
      );
    }

    return next();
  } catch (error) {
    next(error);
  }
}

export const adminImpersonateRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/impersonate",
    middlewares: [onlyAuthenticatedSuperAdmin],
  },
  // DELETE only clears the caller's own impersonation, so it stays open: it is
  // called while impersonating, when the super admin looks like a merchant.
];
