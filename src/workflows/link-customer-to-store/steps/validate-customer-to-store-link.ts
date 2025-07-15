import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils";
import { createStep } from "@medusajs/framework/workflows-sdk";
import customerStoreLink from "../../../links/customer-store";
import { LinkCustomerToStoreStepInput } from "./link-customer-to-store";

export const validateLinkCustomerToStoreStep = createStep(
  "validate-link-customer-to-store-step",
  async (data: LinkCustomerToStoreStepInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    const { data: customerStores } = await query.graph({
      entity: customerStoreLink.entryPoint,
      fields: ["*", "customer.email"],
      filters: {
        customer_id: [...data.customerIds],
        store_id: data.storeId,
      },
    });

    if (customerStores?.length) {
      throw new MedusaError(
        MedusaError.Types.DUPLICATE_ERROR,
        `Customer with this email ${customerStores[0].customer.email} already exist in this store`
      );
    }
  }
);
