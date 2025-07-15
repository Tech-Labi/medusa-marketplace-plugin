import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework";
import { IOrderModuleService } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, OrderWorkflowEvents } from "@medusajs/framework/utils";
import { Modules } from "@medusajs/framework/utils";
import productStoreLink from "../links/product-store";
import { linkOrderToStoreWorkflow } from "../workflows/link-order-to-store";
import { linkCustomerToStoreWorkflow } from "../workflows/link-customer-to-store";

export default async function orderPlacedHandler({ event: { data }, container }: SubscriberArgs<{ id: string }>) {
  try {
    console.log("orderPlacedHandler data", data);

    const orderId = data.id;
    const orderModuleService: IOrderModuleService = container.resolve(Modules.ORDER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    // retrieve order
    const order = await orderModuleService.retrieveOrder(orderId, {
      relations: ["items", "shipping_address", "billing_address", "shipping_methods"],
    });
    console.log("order", order);

    // get products of store
    const productsIds = order.items?.map((order) => order.product_id);
    const { data: productsStores } = await query.graph({
      entity: productStoreLink.entryPoint,
      fields: ["*"],
      filters: {
        product_id: productsIds,
      },
    });
    console.log("productsStores", productsStores);

    if (productsStores.length > 0) {
      const storeId = productsStores[0].store_id;
      console.log("storeId", storeId);
      // link order to store
      await linkOrderToStoreWorkflow(container).run({
        input: {
          orderId: order.id,
          storeId,
        },
      });

      // link customer to store
      await linkCustomerToStoreWorkflow(container).run({
        input: {
          customerIds: [order.customer_id],
          storeId,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
}

// subscriber config
export const config: SubscriberConfig = {
  event: OrderWorkflowEvents.PLACED,
};
