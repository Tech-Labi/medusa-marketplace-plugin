import { StoreDTO, UserDTO } from "@medusajs/framework/types";
import { createCustomersWorkflow } from "@medusajs/medusa/core-flows";
import { linkCustomerToStoreWorkflow } from "../link-customer-to-store";

createCustomersWorkflow.hooks.customersCreated(async ({ customers }, { container }) => {
  console.log("HOOK customersCreated", customers);

  if (container.hasRegistration("currentStore")) {
    // const loggedInUser = container.resolve("loggedInUser") as UserDTO;
    const currentStore = container.resolve("currentStore") as StoreDTO;
    console.log("currentStore", currentStore);
    await Promise.all(
      customers.map(({ id }) =>
        linkCustomerToStoreWorkflow(container).run({
          input: {
            customerId: id,
            storeId: currentStore.id,
          },
        })
      )
    );
  }
});
