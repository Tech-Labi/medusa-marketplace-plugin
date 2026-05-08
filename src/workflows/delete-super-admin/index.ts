import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { dismissUserSuperAdminLinkStep } from "./steps/dismiss-user-super-admin-link";
import { deleteSuperAdminStep } from "./steps/delete-super-admin";

export type DeleteSuperAdminWorkflowInput = {
  user_id: string;
  super_admin_id: string;
};

export const deleteSuperAdminWorkflow = createWorkflow(
  "delete-super-admin",
  ({ user_id, super_admin_id }: DeleteSuperAdminWorkflowInput) => {
    dismissUserSuperAdminLinkStep({
      userId: user_id,
      superAdminId: super_admin_id,
    });

    deleteSuperAdminStep({ superAdminId: super_admin_id });

    return new WorkflowResponse({ user_id, super_admin_id });
  },
);
