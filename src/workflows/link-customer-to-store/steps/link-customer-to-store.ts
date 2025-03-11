import { Link } from "@medusajs/framework/modules-sdk";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

type LinkCustomerToStoreStepInput = {
  customerId: string;
  storeId: string;
};

export const linkCustomerToStoreStep = createStep(
  "link-customer-to-store-step",
  async (
    { customerId, storeId }: LinkCustomerToStoreStepInput,
    { container }
  ) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    const linkArray = link.create({
      [Modules.CUSTOMER]: {
        customer_id: customerId,
      },
      [Modules.STORE]: {
        store_id: storeId,
      },
    });

    return new StepResponse(linkArray, {
      customerId,
      storeId,
    });
  },
  async ({ customerId, storeId }, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    link.dismiss({
      [Modules.CUSTOMER]: {
        customer_id: customerId,
      },
      [Modules.STORE]: {
        store_id: storeId,
      },
    });
  }
);
