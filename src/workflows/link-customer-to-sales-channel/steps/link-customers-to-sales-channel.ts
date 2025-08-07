import { Link } from "@medusajs/framework/modules-sdk";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

export type LinkCustomersToSalesChannelStepInput = {
  sales_channel_id: string;
  customer_ids: string[];
};

export const linkCustomersToSalesChannelStep = createStep(
  "link-customers-to-sales-channel-step",
  async (
    { sales_channel_id, customer_ids }: LinkCustomersToSalesChannelStepInput,
    { container }
  ) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    const linkArray = customer_ids.map((customer_id) =>
      link.create({
        [Modules.CUSTOMER]: {
          customer_id,
        },
        [Modules.SALES_CHANNEL]: {
          sales_channel_id,
        },
      })
    );

    await Promise.all(linkArray);

    return new StepResponse(null, {
      sales_channel_id,
      customer_ids,
    });
  },
  async ({ sales_channel_id, customer_ids }, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    const dismissArray = customer_ids.map((customer_id) =>
      link.dismiss({
        [Modules.CUSTOMER]: {
          customer_id,
        },
        [Modules.SALES_CHANNEL]: {
          sales_channel_id,
        },
      })
    );

    await Promise.all(dismissArray);
  }
);
