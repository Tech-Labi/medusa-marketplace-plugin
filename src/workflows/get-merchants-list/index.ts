import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { getMerchantsStep } from "./steps/get-merchants";

export type GetMerchantsListWorkflowInput = {
  userId: string;
  isSuperAdmin: boolean;
};

export const getMerchantsListWorkflow = createWorkflow(
  "get-merchants-list-workflow",
  (input: GetMerchantsListWorkflowInput) => {
    const merchants = getMerchantsStep({
      userId: input.userId,
      isSuperAdmin: input.isSuperAdmin,
    });

    return new WorkflowResponse(merchants);
  }
);
