import { MiddlewareRoute } from "@medusajs/framework";
import { onlyForSuperAdmins } from "../../middlewares/only-for-super-admin";

export const adminSalesChannelRoutesMiddlewares: MiddlewareRoute[] = [
    {
        method: ["POST"],
        matcher: "/admin/sales-channels",
        middlewares: [onlyForSuperAdmins],
    },
    {
        method: ["POST"],
        matcher: "/admin/sales-channels/:id",
        middlewares: [onlyForSuperAdmins],
    },
    {
        method: ["DELETE"],
        matcher: "/admin/sales-channels/:id",
        middlewares: [onlyForSuperAdmins],
    },
]