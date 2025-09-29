import { createOrderWorkflow } from "@medusajs/medusa/core-flows";
import { StoreDTO } from "@medusajs/framework/types";
import { linkOrderToStoreWorkflow } from "../link-order-to-store";

createOrderWorkflow.hooks.orderCreated(async ({ order }, { container }) => {
  console.log("HOOK orderCreated", order);

  const currentStore = container.resolve("currentStore") as Pick<StoreDTO, 'id'>;
  await linkOrderToStoreWorkflow(container).run({
    input: {
      orderId: order.id,
      storeId: currentStore.id,
    },
  });
});
