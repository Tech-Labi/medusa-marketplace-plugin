import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { getStoreStep } from "../link-product-to-store/steps/get-store";
import { getMerchantsStep } from "./steps/get-merchants";

export type GetMerchantsListWorkflowInput = {
  userId: string;
};

export const getMerchantsListWorkflow = createWorkflow(
  "get-merchants-list-workflow",
  (input: GetMerchantsListWorkflowInput) => {
    const store = getStoreStep(input.userId);

    const isSuperAdmin = transform({ store }, (data) => !data.store);

    const merchants = getMerchantsStep({
      userId: input.userId,
      isSuperAdmin,
    });

    return new WorkflowResponse(merchants);
  }
);
