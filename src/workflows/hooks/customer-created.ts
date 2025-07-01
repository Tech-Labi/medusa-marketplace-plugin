import { StoreDTO } from "@medusajs/framework/types";
import { createCustomersWorkflow } from "@medusajs/medusa/core-flows";
import { linkCustomerToStoreWorkflow } from "../link-customer-to-store";
import { linkCustomersToSalesChannelWorkflow } from "../link-customer-to-sales-channel";

createCustomersWorkflow.hooks.customersCreated(
  async ({ customers }, { container }) => {
    console.log("HOOK customersCreated", customers);

    if (container.hasRegistration("currentStore")) {
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

    if (process.env.IS_CHANNEL_PRICING_ENABLED) {
      customers.forEach(({ id, metadata }) => {
        if (metadata?.sales_channel_id) {
          linkCustomersToSalesChannelWorkflow(container).run({
            input: {
              customer_id: id,
              sales_channel_id: metadata.sales_channel_id as string,
            },
          });
        }
      });
    }
  }
);
