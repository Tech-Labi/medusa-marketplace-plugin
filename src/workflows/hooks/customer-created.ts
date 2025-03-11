import { UserDTO } from "@medusajs/framework/types";
import { createCustomersWorkflow } from "@medusajs/medusa/core-flows";
import { linkCustomerToStoreWorkflow } from "../link-customer-to-store";

createCustomersWorkflow.hooks.customersCreated(
  async ({ customers }, { container }) => {
    console.log("HOOK customersCreated", customers);

    const loggedInUser = container.resolve("loggedInUser") as UserDTO;
    await Promise.all(
      customers.map(({ id }) =>
        linkCustomerToStoreWorkflow(container).run({
          input: {
            customerId: id,
            userId: loggedInUser.id,
          },
        })
      )
    );
  }
);
