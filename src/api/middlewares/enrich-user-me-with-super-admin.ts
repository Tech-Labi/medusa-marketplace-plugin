import {
  type MedusaNextFunction,
  type MedusaRequest,
  type MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import type { LoggedInUser } from "./logged-in-user";

/**
 * Augments the GET /admin/users/me response with `user.super_admin = { id }`
 * (or `null`) so the admin frontend can detect super admin status synchronously
 * from the same payload it already fetches via `useMe()`.
 *
 * Preferred path: read the already-enriched `loggedInUser` from the request
 * scope (registered by `registerLoggedInUser`).
 *
 * Fallback path: `/admin/users/me` opts out of the global `authenticate`
 * middleware (`AUTHENTICATE = false` in medusa core's route file) and re-applies
 * it as a route-local middleware. As a result, `req.auth_context` is still
 * `undefined` when our `/admin/*` `registerLoggedInUser` runs, so
 * `loggedInUser` never gets registered for this specific endpoint. By the time
 * the route handler calls `res.json`, the body already contains the resolved
 * user, so we can look up the `super_admin` link directly from `body.user.id`.
 */
export function enrichUserMeWithSuperAdmin(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction,
) {
  const originalJson = res.json.bind(res);

  res.json = ((body: any) => {
    if (!body || typeof body !== "object" || !body.user?.id) {
      return originalJson(body);
    }

    try {
      const loggedInUser = req.scope.resolve("loggedInUser", {
        allowUnregistered: true,
      }) as LoggedInUser | undefined;

      if (loggedInUser?.id === body.user.id) {
        body.user.super_admin = loggedInUser.super_admin ?? null;
        return originalJson(body);
      }
    } catch {
      // fall through to the direct lookup below
    }

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    return query
      .graph({
        entity: "user",
        fields: ["id", "super_admin.id"],
        filters: { id: body.user.id },
      })
      .then(({ data: [user] }) => {
        body.user.super_admin =
          (user as { super_admin?: { id: string } | null } | undefined)
            ?.super_admin ?? null;
        originalJson(body);
      })
      .catch(() => {
        // never break /admin/users/me on enrichment errors
        originalJson(body);
      });
  }) as MedusaResponse["json"];

  next();
}
