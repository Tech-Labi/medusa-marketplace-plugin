import { createCustomersWorkflow } from "@medusajs/medusa/core-flows";
import { linkCustomersToSalesChannelWorkflow } from "../link-customer-to-sales-channel";

createCustomersWorkflow.hooks.customersCreated(
  async ({ customers }, { container }) => {
    console.log("HOOK customersCreated", customers);

    if (process.env.IS_CHANNEL_PRICING_ENABLED) {
      const groupedBySalesChannel = new Map<string, string[]>();

      customers.forEach(({ id, metadata }) => {
        const salesChannelId = metadata?.sales_channel_id as string;
        if (!salesChannelId) return;

        groupedBySalesChannel.set(salesChannelId, [
          ...(groupedBySalesChannel.get(salesChannelId) ?? []),
          id,
        ]);
      });

      for (const [sales_channel_id, customer_ids] of groupedBySalesChannel) {
        linkCustomersToSalesChannelWorkflow(container).run({
          input: { sales_channel_id, customer_ids },
        });
      }
    }
  }
);
