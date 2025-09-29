import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { linkOrderToStoreStep } from "./steps/link-order-to-store";

export type LinkOrderToStoreInput = {
  orderId: string;
  storeId: string;
};

export const linkOrderToStoreWorkflow = createWorkflow(
  "link-order-to-store",
  (input: LinkOrderToStoreInput) => {
    const orderStoreLinkArray = linkOrderToStoreStep(input);

    return new WorkflowResponse({
      orderStoreLinkArray,
    });
  }
);
