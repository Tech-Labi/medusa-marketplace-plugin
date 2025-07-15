import { Link } from "@medusajs/framework/modules-sdk";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { StoreDTO } from "@medusajs/types";

export type LinkCustomerToStoreStepInput = {
  customerIds: string[];
  storeId?: string;
};

export const linkCustomerToStoreStep = createStep(
  "link-customer-to-store-step",
  async (data: LinkCustomerToStoreStepInput, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    const currentStore = container.resolve("currentStore") as StoreDTO;

    const store_id = data?.storeId || currentStore.id;

    const linkArray = data.customerIds.map((customerId) =>
      link.create({
        [Modules.CUSTOMER]: {
          customer_id: customerId,
        },
        [Modules.STORE]: {
          store_id: store_id,
        },
      })
    );

    await Promise.all(linkArray);

    return new StepResponse(null, {
      customerIds: data.customerIds,
      storeId: store_id,
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
