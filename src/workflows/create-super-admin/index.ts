import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { createSuperAdminStep } from "./steps/create-super-admin";
import { linkUserToSuperAdminStep } from "./steps/link-user-to-super-admin";

export type CreateSuperAdminWorkflowInput = {
  user_id: string;
};

export const createSuperAdminWorkflow = createWorkflow(
  "create-super-admin",
  ({ user_id }: CreateSuperAdminWorkflowInput) => {
    const superAdmin = createSuperAdminStep();

    linkUserToSuperAdminStep({
      userId: user_id,
      superAdminId: superAdmin.id,
    });

    return new WorkflowResponse(superAdmin);
  },
);
