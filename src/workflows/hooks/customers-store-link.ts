import { StoreDTO } from "@medusajs/framework/types";

import { linkCustomerToStoreWorkflow } from "../link-customer-to-store";
import { createCustomCustomersWorkflow } from "../create-customer";
import { MedusaError } from "@medusajs/framework/utils";

createCustomCustomersWorkflow.hooks.customersStoreLink(async ({ customers }, { container }) => {
  console.log("HOOK customersStoreLink", customers);

  if (container.hasRegistration("currentStore")) {
    const currentStore = container.resolve("currentStore") as StoreDTO;

    await Promise.all(
      customers.map(async ({ id }) => {
        try {
          await linkCustomerToStoreWorkflow(container).run({
            input: {
              customerId: id,
              storeId: currentStore.id,
            },
          });
        } catch (err) {
          if (err.name === "MedusaError") throw err;

          throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, `Failed to link customer ${id}: ${err.message}`);
        }
      })
    );
  }
});
