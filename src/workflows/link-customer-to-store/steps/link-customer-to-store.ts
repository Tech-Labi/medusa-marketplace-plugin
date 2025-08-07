import { Link } from "@medusajs/framework/modules-sdk";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

export type LinkCustomerToStoreStepInput = {
  customerIds: string[];
  storeId: string;
};

export const linkCustomerToStoreStep = createStep(
  "link-customer-to-store-step",
  async (data: LinkCustomerToStoreStepInput, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    const linkArray = data.customerIds.map((customerId) =>
      link.create({
        [Modules.CUSTOMER]: {
          customer_id: customerId,
        },
        [Modules.STORE]: {
          store_id: data.storeId,
        },
      })
    );

    await Promise.all(linkArray);

    return new StepResponse(null, {
      customerIds: data.customerIds,
      storeId: data.storeId,
    });
  },
  async ({ customerIds, storeId }, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    const dismissArray = customerIds.map((customerId) =>
      link.dismiss({
        [Modules.CUSTOMER]: {
          customer_id: customerId,
        },
        [Modules.STORE]: {
          store_id: storeId,
        },
      })
    );

    await Promise.all(dismissArray);
  }
);
