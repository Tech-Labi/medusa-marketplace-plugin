import {
  type MedusaNextFunction,
  type MedusaRequest,
  type MedusaResponse,
} from "@medusajs/framework/http";
import type { LoggedInUser } from "./logged-in-user";

/**
 * Augments the GET /admin/users/me response with `user.super_admin = { id }`
 * (or `null`) so the admin frontend can detect super admin status synchronously
 * from the same payload it already fetches via `useMe()`, without a second
 * round-trip to /admin/super-admin/me.
 *
 * The data is read from the `loggedInUser` container which is already enriched
 * with `super_admin.id` by `registerLoggedInUser`, so no extra DB query is
 * performed here.
 */
export function enrichUserMeWithSuperAdmin(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction,
) {
  const originalJson = res.json.bind(res);

  res.json = ((body: any) => {
    try {
      if (body && typeof body === "object" && body.user && body.user.id) {
        const loggedInUser = req.scope.resolve("loggedInUser", {
          allowUnregistered: true,
        }) as LoggedInUser | undefined;

        if (loggedInUser?.id === body.user.id) {
          body.user.super_admin = loggedInUser.super_admin ?? null;
        }
      }
    } catch {
      // never break /admin/users/me on enrichment errors
    }
    return originalJson(body);
  }) as MedusaResponse["json"];

  next();
}
