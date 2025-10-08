import { createWorkflow, transform, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { getMerchantsStep } from "./steps/get-merchants";

export type GetMerchantsListWorkflowInput = {
  userId: string;
  isSuperAdmin: boolean;
  skip?: number;
  take?: number;
  q?: string;
};

export const getMerchantsListWorkflow = createWorkflow(
  "get-merchants-list-workflow",
  (input: GetMerchantsListWorkflowInput) => {
    const merchantsResult = getMerchantsStep(input);

    return new WorkflowResponse(merchantsResult);
  }
);
