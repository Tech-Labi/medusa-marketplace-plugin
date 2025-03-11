import { MiddlewareRoute } from "@medusajs/framework/http";
import { onlyForSuperAdmins } from "../../middlewares/only-for-super-admin";

export const adminImpersonateRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/impersonate",
    middlewares: [onlyForSuperAdmins],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/impersonate",
    middlewares: [onlyForSuperAdmins],
  },
];
