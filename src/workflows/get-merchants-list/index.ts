import { createWorkflow, transform, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { getMerchantsStep } from "./steps/get-merchants";

export type GetMerchantsListWorkflowInput = {
  userId: string;
  isSuperAdmin: boolean;
  offset?: number;
  limit?: number;
  searchString?: string;
};

export const getMerchantsListWorkflow = createWorkflow(
  "get-merchants-list-workflow",
  (input: GetMerchantsListWorkflowInput) => {
    const offset = transform({ input }, (data) => data.input.offset ?? 0);
    const limit = transform({ input }, (data) => data.input.limit ?? 20);

    const merchantsResult = getMerchantsStep({
      userId: input.userId,
      isSuperAdmin: input.isSuperAdmin,
      offset,
      limit,
      searchString: input?.searchString,
    });

    return new WorkflowResponse(merchantsResult);
  }
);
