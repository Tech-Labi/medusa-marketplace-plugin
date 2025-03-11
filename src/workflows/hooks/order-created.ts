import { createOrderWorkflow } from "@medusajs/medusa/core-flows";
import { UserDTO } from "@medusajs/framework/types";
import { linkOrderToStoreWorkflow } from "../link-order-to-store";

createOrderWorkflow.hooks.orderCreated(async ({ order }, { container }) => {
  console.log("HOOK orderCreated", order);

  const loggedInUser = container.resolve("loggedInUser") as UserDTO;

  await linkOrderToStoreWorkflow(container).run({
    input: {
      orderId: order.id,
      userId: loggedInUser.id,
    },
  });
});
