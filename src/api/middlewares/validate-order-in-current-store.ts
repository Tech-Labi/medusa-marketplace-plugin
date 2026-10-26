import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { StoreDTO } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils";
import type { LoggedInUser } from "./logged-in-user";

const ORDER_ID_PREFIX = "order_";
const ORDER_CHANGE_ID_PREFIX = "ordch_";

// 404 for another store's order; non order ids (export, all) are skipped
export async function validateOrderInCurrentStore(
  req: MedusaRequest,
  _res: MedusaResponse,
  next: MedusaNextFunction,
) {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    let orderId: string | undefined =
      req.params?.id ?? (req.body as { order_id?: string } | undefined)?.order_id;

    if (orderId?.startsWith(ORDER_CHANGE_ID_PREFIX)) {
      const {
        data: [orderChange],
      } = await query.graph({
        entity: "order_change",
        fields: ["order_id"],
        filters: { id: orderId },
      });
      orderId = orderChange?.order_id;
    }

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
      `Order with id: ${req.params?.id ?? orderId} was not found`,
    );

    if (!currentStore?.id) {
      throw notFound;
    }

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
