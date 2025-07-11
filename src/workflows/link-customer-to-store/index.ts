import { createWorkflow, transform, when, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { linkCustomerToStoreStep } from "./steps/link-customer-to-store";
import { getStoreStep } from "../link-product-to-store/steps/get-store";
import { validateLinkCustomerToStoreStep } from "./steps/validate-customer-to-store-link";
import { emitEventStep } from "@medusajs/medusa/core-flows";
import { CustomerWorkflowEvents } from "../../subscribers/customer-link-created";

export type LinkCustomerToStoreInput = {
  customerId: string;
  storeId?: string;
  userId?: string;
};

export const linkCustomerToStoreWorkflow = createWorkflow(
  "link-customer-to-store-workflow",
  (input: LinkCustomerToStoreInput) => {
    const storeIdFromUser = when("check_user_id", input, (input) => {
      return !!input.userId;
    }).then(() => {
      const store = getStoreStep({ userId: input.userId });
      return store.id;
    });

    const storeId = transform(
      { storeId: input.storeId, storeIdFromUser },
      (data) => data.storeId || data.storeIdFromUser
    );

    validateLinkCustomerToStoreStep({
      customerId: input.customerId,
      storeId,
    });

    const customerStoreLinkArray = linkCustomerToStoreStep({
      customerId: input.customerId,
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
