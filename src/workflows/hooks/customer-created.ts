import { StoreDTO } from "@medusajs/framework/types";

import { linkCustomerToStoreWorkflow } from "../link-customer-to-store";
import { linkCustomersToSalesChannelWorkflow } from "../link-customer-to-sales-channel";
import { createCustomersWorkflow } from "@medusajs/medusa/core-flows";

createCustomersWorkflow.hooks.customersCreated(async ({ customers }, { container }) => {
  console.log("HOOK customersCreated", customers);

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
});
