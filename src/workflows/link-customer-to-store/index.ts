import { createWorkflow, transform, when, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { emitEventStep } from "@medusajs/medusa/core-flows";
import { CustomerWorkflowEvents } from "../../subscribers/customer-link-created";
import { linkCustomerToStoreStep } from "./steps/link-customer-to-store";
import { validateLinkCustomerToStoreStep } from "./steps/validate-customer-to-store-link";
import { getCurrentStoreStep } from "./steps/get-current-store";

export type LinkCustomerToStoreInput = {
  customerIds: string[];
  storeId?: string;
};

export const linkCustomerToStoreWorkflow = createWorkflow(
  "link-customer-to-store-workflow",
  (input: LinkCustomerToStoreInput) => {
    const storeIdFromApi = when("check_store_id", input, (input) => {
      return !input.storeId;
    }).then(() => {
      const store = getCurrentStoreStep();
      return store.id;
    });

    const storeId = transform(
      { storeId: input.storeId, storeIdFromApi },
      (data) => data.storeId || data.storeIdFromApi
    );

    validateLinkCustomerToStoreStep({
      customerIds: input.customerIds,
      storeId,
    });

    const customerStoreLinkArray = linkCustomerToStoreStep({
      customerIds: input.customerIds,
      storeId,
    });

    emitEventStep({
      eventName: CustomerWorkflowEvents.LINKED,
      data: customerStoreLinkArray,
    });

    return new WorkflowResponse({
      customerStoreLinkArray,
    });
  }
);
