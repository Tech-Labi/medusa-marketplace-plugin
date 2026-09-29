import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { StoreDTO } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils";
import type { LoggedInUser } from "./logged-in-user";

const ORDER_ID_PREFIX = "order_";

/**
 * Rejects `/admin/orders/:id` and `/admin/orders/:id/*` requests for an order
 * that is not linked to the current store, so a merchant cannot read or
 * modify another store's order by id. Super admins are not restricted.
 *
 * Only real order ids are checked: the same matcher also catches collection
 * routes such as `/admin/orders/export` or custom ones like
 * `/admin/orders/all`, which are scoped by their own middlewares.
 *
 * Responds with 404 (not 403) so the order's existence is not disclosed.
 */
export async function validateOrderInCurrentStore(
  req: MedusaRequest,
  _res: MedusaResponse,
  next: MedusaNextFunction,
) {
  try {
    const orderId = req.params?.id;
    if (!orderId?.startsWith(ORDER_ID_PREFIX)) {
      return next();
    }

    const loggedInUser = req.scope.resolve("loggedInUser", {
      allowUnregistered: true,
    }) as LoggedInUser | undefined;

    if (loggedInUser?.super_admin?.id) {
      return next();
    }

    const currentStore = req.scope.resolve("currentStore", {
      allowUnregistered: true,
    }) as StoreDTO | undefined;

    const notFound = new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Order with id: ${orderId} was not found`,
    );

    if (!currentStore?.id) {
      throw notFound;
    }

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const { data: links } = await query.graph({
      entity: "order_store",
      fields: ["order_id"],
      filters: {
        order_id: orderId,
        store_id: currentStore.id,
      },
    });

    if (!links.length) {
      throw notFound;
    }

    return next();
  } catch (error) {
    next(error);
  }
}
