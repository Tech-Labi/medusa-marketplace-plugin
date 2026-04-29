import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { SUPER_ADMIN_MODULE } from "../../../modules/super-admin";
import SuperAdminModuleService from "../../../modules/super-admin/service";

export const deleteSuperAdminStep = createStep(
  "delete-super-admin-step",
  async ({ superAdminId }: { superAdminId: string }, { container }) => {
    const service: SuperAdminModuleService =
      container.resolve(SUPER_ADMIN_MODULE);

    await service.deleteSuperAdmins([superAdminId]);

    return new StepResponse(null, { superAdminId });
  },
  async ({ superAdminId }, { container }) => {
    const service: SuperAdminModuleService =
      container.resolve(SUPER_ADMIN_MODULE);
    await service.createSuperAdmins({ id: superAdminId });
  },
);
