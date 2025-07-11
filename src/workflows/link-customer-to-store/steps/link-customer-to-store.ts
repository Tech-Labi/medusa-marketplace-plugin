import { Link } from "@medusajs/framework/modules-sdk";
import { ContainerRegistrationKeys, MedusaError, Modules } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { StoreDTO } from "@medusajs/types";
import customerStoreLink from "../../../links/customer-store";
export type LinkCustomerToStoreStepInput = {
  customerId: string;
  storeId?: string;
};

export const linkCustomerToStoreStep = createStep(
  "link-customer-to-store-step",
  async (data: LinkCustomerToStoreStepInput, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    const currentStore = container.resolve("currentStore") as StoreDTO;

    const linkArray = link.create({
      [Modules.CUSTOMER]: {
        customer_id: data.customerId,
      },
      [Modules.STORE]: {
        store_id: data?.storeId || currentStore.id,
      },
    });

    return new StepResponse(linkArray, {
      customerId: data.customerId,
      storeId: data?.storeId || currentStore.id,
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
